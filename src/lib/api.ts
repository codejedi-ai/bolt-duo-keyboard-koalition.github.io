// API client for interacting with Netlify Functions
import { supabase } from './supabase';

class ApiClient {
  private async getAuthToken(): Promise<string> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('No authentication token available');
    }
    return session.access_token;
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = await this.getAuthToken();
    
    const response = await fetch(`/.netlify/functions/${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // User Profile API
  async getUserProfile(): Promise<any> {
    return this.request('user-profile');
  }

  async updateUserProfile(profile: any): Promise<any> {
    return this.request('user-profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  }

  async createUserProfile(profile: any): Promise<any> {
    return this.request('user-profile', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
  }

  // User Projects API
  async getUserProjects(): Promise<any> {
    return this.request('user-projects');
  }

  async createProject(project: any): Promise<any> {
    return this.request('user-projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  }

  async updateProject(projectId: string, project: any): Promise<any> {
    return this.request(`user-projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    });
  }

  async deleteProject(projectId: string): Promise<any> {
    return this.request(`user-projects/${projectId}`, {
      method: 'DELETE',
    });
  }

  // User Connections API
  async getUserConnections(status: string = 'accepted'): Promise<any> {
    return this.request(`user-connections?status=${status}`);
  }

  async createConnection(connectedUserId: string): Promise<any> {
    return this.request('user-connections', {
      method: 'POST',
      body: JSON.stringify({ connected_user_id: connectedUserId }),
    });
  }

  async updateConnection(connectionId: string, status: string): Promise<any> {
    return this.request(`user-connections/${connectionId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async deleteConnection(connectionId: string): Promise<any> {
    return this.request(`user-connections/${connectionId}`, {
      method: 'DELETE',
    });
  }

  // Event RSVPs API
  async getUserRSVPs(): Promise<any> {
    return this.request('event-rsvps');
  }

  async createRSVP(rsvp: any): Promise<any> {
    return this.request('event-rsvps', {
      method: 'POST',
      body: JSON.stringify(rsvp),
    });
  }

  async updateRSVP(rsvpId: string, updates: any): Promise<any> {
    return this.request(`event-rsvps/${rsvpId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async cancelRSVP(rsvpId: string): Promise<any> {
    return this.request(`event-rsvps/${rsvpId}`, {
      method: 'DELETE',
    });
  }

  // Search Users API
  async searchUsers(query: string, limit: number = 20): Promise<any> {
    return this.request(`search-users?q=${encodeURIComponent(query)}&limit=${limit}`);
  }
}

export const apiClient = new ApiClient();