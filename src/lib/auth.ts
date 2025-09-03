import { supabase } from './supabase';
import type { User, Session } from '@supabase/supabase-js';

export interface AuthUser {
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

  private async handleUserSignIn(user: User) {
    // Get or create user profile
    const profile = await this.getOrCreateUserProfile(user);
    this.notifyListeners(profile);
  }

  private async getOrCreateUserProfile(user: User): Promise<AuthUser> {
    // First, try to get existing profile
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (existingProfile) {
      return {
        id: existingProfile.id,
        email: user.email!,
        username: existingProfile.username,
        first_name: existingProfile.first_name,
        last_name: existingProfile.last_name,
        bio: existingProfile.bio,
        skills: existingProfile.skills,
        github_url: existingProfile.github_url,
        linkedin_url: existingProfile.linkedin_url,
        avatar_url: existingProfile.avatar_url || user.user_metadata?.avatar_url
      };
    }

    // Create new profile
    const newProfile = {
      id: user.id,
      username: user.user_metadata?.preferred_username || user.user_metadata?.username,
      first_name: user.user_metadata?.first_name || user.user_metadata?.name?.split(' ')[0],
      last_name: user.user_metadata?.last_name || user.user_metadata?.name?.split(' ').slice(1).join(' '),
      avatar_url: user.user_metadata?.avatar_url
    };

    const { data: createdProfile } = await supabase
      .from('user_profiles')
      .insert(newProfile)
      .select()
      .single();

    return {
      id: user.id,
      email: user.email!,
      username: createdProfile?.username,
      first_name: createdProfile?.first_name,
      last_name: createdProfile?.last_name,
      bio: createdProfile?.bio,
      skills: createdProfile?.skills,
      github_url: createdProfile?.github_url,
      linkedin_url: createdProfile?.linkedin_url,
      avatar_url: createdProfile?.avatar_url
    };
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
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    return await this.getOrCreateUserProfile(session.user);
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
        const profile = await this.getOrCreateUserProfile(data.user);
        return { success: true, user: profile };
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
        const profile = await this.getOrCreateUserProfile(data.user);
        return { success: true, user: profile };
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        return { success: false, error: error.message };
      }

      // Refresh current user data
      const updatedProfile = await this.getOrCreateUserProfile(user);
      this.notifyListeners(updatedProfile);

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