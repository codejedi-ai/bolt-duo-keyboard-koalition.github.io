// In-house authentication system
import { supabase } from './supabase';

export interface User {
  id: string;
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  skills?: string[];
  github_url?: string;
  linkedin_url?: string;
  avatar_url?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  session_token?: string;
  error?: string;
}

class AuthManager {
  private sessionToken: string | null = null;
  private currentUser: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];

  constructor() {
    // Load session from localStorage on initialization
    this.sessionToken = localStorage.getItem('session_token');
    if (this.sessionToken) {
      this.validateSession();
    }
  }

  // Subscribe to auth state changes
  onAuthStateChange(callback: (user: User | null) => void) {
    this.listeners.push(callback);
    // Immediately call with current state
    callback(this.currentUser);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentUser));
  }

  private async validateSession(): Promise<boolean> {
    if (!this.sessionToken) return false;

    try {
      // Set session token for RLS
      await supabase.rpc('set_config', {
        setting_name: 'app.session_token',
        setting_value: this.sessionToken,
        is_local: true
      });

      const { data, error } = await supabase.rpc('get_current_user', {
        p_session_token: this.sessionToken
      });

      if (error || !data?.success) {
        this.clearSession();
        return false;
      }

      this.currentUser = data.user;
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      this.clearSession();
      return false;
    }
  }

  async register(
    email: string,
    password: string,
    username?: string,
    firstName?: string,
    lastName?: string
  ): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.rpc('register_user', {
        p_email: email,
        p_password: password,
        p_username: username || null,
        p_first_name: firstName || null,
        p_last_name: lastName || null
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.success) {
        return { success: false, error: data.error };
      }

      // Store session
      this.sessionToken = data.session_token;
      this.currentUser = data.user;
      localStorage.setItem('session_token', this.sessionToken);

      // Set session token for RLS
      await supabase.rpc('set_config', {
        setting_name: 'app.session_token',
        setting_value: this.sessionToken,
        is_local: true
      });

      this.notifyListeners();
      return { success: true, user: data.user, session_token: data.session_token };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.rpc('login_user', {
        p_email: email,
        p_password: password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.success) {
        return { success: false, error: data.error };
      }

      // Store session
      this.sessionToken = data.session_token;
      this.currentUser = data.user;
      localStorage.setItem('session_token', this.sessionToken);

      // Set session token for RLS
      await supabase.rpc('set_config', {
        setting_name: 'app.session_token',
        setting_value: this.sessionToken,
        is_local: true
      });

      this.notifyListeners();
      return { success: true, user: data.user, session_token: data.session_token };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  }

  async logout(): Promise<void> {
    if (this.sessionToken) {
      try {
        await supabase.rpc('logout_user', {
          p_session_token: this.sessionToken
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    this.clearSession();
  }

  private clearSession() {
    this.sessionToken = null;
    this.currentUser = null;
    localStorage.removeItem('session_token');
    this.notifyListeners();
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getSessionToken(): string | null {
    return this.sessionToken;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null && this.sessionToken !== null;
  }

  async updateProfile(updates: Partial<User>): Promise<{ success: boolean; error?: string }> {
    if (!this.currentUser || !this.sessionToken) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', this.currentUser.id);

      if (error) {
        return { success: false, error: error.message };
      }

      // Update local user data
      this.currentUser = { ...this.currentUser, ...updates };
      this.notifyListeners();

      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Profile update failed' };
    }
  }
}

// Export singleton instance
export const auth = new AuthManager();