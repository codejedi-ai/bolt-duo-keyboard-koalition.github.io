import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, AuthUser } from '../lib/auth';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, metadata?: { username?: string; first_name?: string; last_name?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<{ success: boolean; error?: string }>;
  loginWithDiscord: () => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
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

  const register = async (email: string, password: string, metadata?: { username?: string; first_name?: string; last_name?: string }) => {
    const result = await auth.register(email, password, metadata);
    return { success: result.success, error: result.error };
  };

  const logout = async () => {
    await auth.logout();
  };

  const updateProfile = async (updates: Partial<AuthUser>) => {
    return await auth.updateProfile(updates);
  };

  const loginWithDiscord = async () => {
    return await auth.loginWithDiscord();
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    login,
    register,
    logout,
    updateProfile,
    loginWithDiscord
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