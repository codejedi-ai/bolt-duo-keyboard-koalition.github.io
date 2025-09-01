import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, User } from '../lib/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, username?: string, firstName?: string, lastName?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = auth.onAuthStateChange((user) => {
      setUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    const result = await auth.login(email, password);
    return { success: result.success, error: result.error };
  };

  const register = async (email: string, password: string, username?: string, firstName?: string, lastName?: string) => {
    const result = await auth.register(email, password, username, firstName, lastName);
    return { success: result.success, error: result.error };
  };

  const logout = async () => {
    await auth.logout();
  };

  const updateProfile = async (updates: Partial<User>) => {
    return await auth.updateProfile(updates);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: auth.isAuthenticated(),
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}