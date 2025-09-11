import { useState, useEffect } from 'react';
import { apiClient } from '../lib/api';

interface Project {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  tech_stack: string[];
  github_link?: string;
  devpost_link?: string;
  live_link?: string;
  author?: {
    username: string;
    avatar_url?: string;
  };
}

interface UseProjectsReturn {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.getPublicProjects();
      setProjects(response.projects || []);
    } catch (err: any) {
      console.error('Error loading projects:', err);
      setError(err.message || 'Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return {
    projects,
    isLoading,
    error,
    refetch: loadProjects
  };
}