import { supabase } from './supabase';
import type { User, Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

class AuthManager {
  private listeners: ((user: AuthUser | null) => void)[] = [];

  constructor() {
    // Listen to auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        this.handleUserSignIn(session.user);
      } else if (event === 'SIGNED_OUT') {
        this.notifyListeners(null);
      }
    });
  }

  private handleUserSignIn(user: User) {
    // Convert Supabase user to AuthUser without database calls
    const authUser: AuthUser = {
      id: user.id,
      email: user.email!,
      username: user.user_metadata?.preferred_username || user.user_metadata?.username || user.user_metadata?.full_name,
      avatar_url: user.user_metadata?.avatar_url,
      first_name: user.user_metadata?.first_name,
      last_name: user.user_metadata?.last_name
    };
    
    this.notifyListeners(authUser);
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    this.listeners.push(callback);
    
    // Immediately call with current state
    this.getCurrentUser().then(callback);
    
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  private notifyListeners(user: AuthUser | null) {
    this.listeners.forEach(listener => listener(user));
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;

      // Convert Supabase user to AuthUser without database calls
      return {
        id: session.user.id,
        email: session.user.email!,
        username: session.user.user_metadata?.preferred_username || session.user.user_metadata?.username || session.user.user_metadata?.full_name,
        avatar_url: session.user.user_metadata?.avatar_url,
        first_name: session.user.user_metadata?.first_name,
        last_name: session.user.user_metadata?.last_name
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async register(email: string, password: string, metadata?: { username?: string; first_name?: string; last_name?: string }): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata || {}
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email!,
          username: data.user.user_metadata?.preferred_username || data.user.user_metadata?.username || data.user.user_metadata?.full_name,
          avatar_url: data.user.user_metadata?.avatar_url,
          first_name: data.user.user_metadata?.first_name,
          last_name: data.user.user_metadata?.last_name
        };
        return { success: true, user: authUser };
      }

      return { success: false, error: 'Registration failed' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email!,
          username: data.user.user_metadata?.preferred_username || data.user.user_metadata?.username || data.user.user_metadata?.full_name,
          avatar_url: data.user.user_metadata?.avatar_url,
          first_name: data.user.user_metadata?.first_name,
          last_name: data.user.user_metadata?.last_name
        };
        return { success: true, user: authUser };
      }

      return { success: false, error: 'Login failed' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async loginWithDiscord(): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: `${window.location.origin}/auth/discord/callback`
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async logout(): Promise<void> {
    await supabase.auth.signOut();
    this.notifyListeners(null);
  }

  async updateProfile(updates: Partial<AuthUser>): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email!,
          username: data.user.user_metadata?.preferred_username || data.user.user_metadata?.username || data.user.user_metadata?.full_name,
          avatar_url: data.user.user_metadata?.avatar_url,
          first_name: data.user.user_metadata?.first_name,
          last_name: data.user.user_metadata?.last_name
        };
        this.notifyListeners(authUser);
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}

export const auth = new AuthManager();