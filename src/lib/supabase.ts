import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface UserProfile {
  id: string
  username?: string
  bio?: string
  skills?: string[]
  github_url?: string
  linkedin_url?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface UserProject {
  id: string
  user_id: string
  name: string
  description: string
  tech_stack?: string[]
  github_link?: string
  live_link?: string
  devpost_link?: string
  image_url?: string
  created_at: string
  updated_at: string
}

export interface UserConnection {
  id: string
  user_id: string
  connected_user_id: string
  status: 'pending' | 'accepted' | 'blocked'
  created_at: string
}

export interface EventRSVP {
  id: string
  user_id: string
  event_name: string
  event_date: string
  event_time?: string
  event_location?: string
  event_description?: string
  rsvp_date: string
  status: 'confirmed' | 'cancelled'
}

// Helper functions for database operations
export const dbHelpers = {
  // User Profile operations
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
    return data
  },

  async upsertUserProfile(profile: Partial<UserProfile> & { id: string }): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(profile)
      .select()
      .single()
    
    if (error) {
      console.error('Error upserting user profile:', error)
      return null
    }
    return data
  },

  // User Projects operations
  async getUserProjects(userId: string): Promise<UserProject[]> {
    const { data, error } = await supabase
      .from('user_projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching user projects:', error)
      return []
    }
    return data || []
  },

  async createProject(project: Omit<UserProject, 'id' | 'created_at' | 'updated_at'>): Promise<UserProject | null> {
    const { data, error } = await supabase
      .from('user_projects')
      .insert(project)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating project:', error)
      return null
    }
    return data
  },

  async updateProject(id: string, updates: Partial<UserProject>): Promise<UserProject | null> {
    const { data, error } = await supabase
      .from('user_projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating project:', error)
      return null
    }
    return data
  },

  async deleteProject(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('user_projects')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting project:', error)
      return false
    }
    return true
  },

  // User Connections operations
  async getUserConnections(userId: string): Promise<UserConnection[]> {
    const { data, error } = await supabase
      .from('user_connections')
      .select('*')
      .or(`user_id.eq.${userId},connected_user_id.eq.${userId}`)
      .eq('status', 'accepted')
    
    if (error) {
      console.error('Error fetching user connections:', error)
      return []
    }
    return data || []
  },

  async createConnection(userId: string, connectedUserId: string): Promise<UserConnection | null> {
    const { data, error } = await supabase
      .from('user_connections')
      .insert({
        user_id: userId,
        connected_user_id: connectedUserId,
        status: 'pending'
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating connection:', error)
      return null
    }
    return data
  },

  // Event RSVPs operations
  async getUserRSVPs(userId: string): Promise<EventRSVP[]> {
    const { data, error } = await supabase
      .from('event_rsvps')
      .select('*')
      .eq('user_id', userId)
      .order('event_date', { ascending: true })
    
    if (error) {
      console.error('Error fetching user RSVPs:', error)
      return []
    }
    return data || []
  },

  async createRSVP(rsvp: Omit<EventRSVP, 'id' | 'rsvp_date'>): Promise<EventRSVP | null> {
    const { data, error } = await supabase
      .from('event_rsvps')
      .insert(rsvp)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating RSVP:', error)
      return null
    }
    return data
  },

  async updateRSVP(id: string, updates: Partial<EventRSVP>): Promise<EventRSVP | null> {
    const { data, error } = await supabase
      .from('event_rsvps')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating RSVP:', error)
      return null
    }
    return data
  }
}