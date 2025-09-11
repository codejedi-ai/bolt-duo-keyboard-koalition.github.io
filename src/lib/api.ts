// API client for interacting with Supabase Edge Functions via Vite proxy
import { supabase } from './supabase';

class ApiClient {
  private async getAuthToken(): Promise<string> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('No authentication token available');
    }
    return session.access_token;
  }

  private async request(endpoint: string, options: RequestInit = {}, requireAuth: boolean = true): Promise<any> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
      ...options.headers as Record<string, string>,
    };

    if (requireAuth) {
      try {
        const token = await this.getAuthToken();
        headers['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.warn('No auth token available for request to:', endpoint);
        if (requireAuth) {
          throw new Error('Authentication required');
        }
      }
    }

    // Use direct Supabase URL instead of proxy for now
    const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
    const url = `${baseUrl}/${endpoint}`;
    
    console.log('Making request to:', url);

    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let errorMessage = `API Error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    } else {
      const text = await response.text();
      console.error('Expected JSON but got:', text.substring(0, 200));
      throw new Error('Invalid response format');
    }
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

  // Events API
  async getEvents(options?: { date?: string; upcomingOnly?: boolean }): Promise<any> {
    const params = new URLSearchParams();
    if (options?.date) params.append('date', options.date);
    if (options?.upcomingOnly) params.append('upcoming', 'true');
    
    const queryString = params.toString();
    return this.request(`events${queryString ? `?${queryString}` : ''}`, {}, false);
  }

  async getEvent(eventId: string): Promise<any> {
    return this.request(`events/${eventId}`, {}, false);
  }

  async createEvent(event: any): Promise<any> {
    return this.request('events', {
      method: 'POST',
      body: JSON.stringify(event),
    });
  }

  async updateEvent(eventId: string, event: any): Promise<any> {
    return this.request(`events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(event),
    });
  }

  async deleteEvent(eventId: string): Promise<any> {
    return this.request(`events/${eventId}`, {
      method: 'DELETE',
    });
  }

  // Public Projects API (for public projects page)
  async getPublicProjects(): Promise<any> {
    return this.request('public-projects', {}, false);
  }
}

export const apiClient = new ApiClient();