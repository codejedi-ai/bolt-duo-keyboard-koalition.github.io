import { useState, useEffect } from 'react';
import { apiClient } from '../lib/api';

interface Project {
  id: string;
  name: string;
  description: string;
  image_url: string;
  tech_stack: string[];
  github_link: string;
  devpost_link?: string;
  live_link?: string;
  author?: {
    username: string;
    avatar_url?: string;
  };
}

function Projects(): JSX.Element {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.getPublicProjects();
      setProjects(response.projects || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 px-4">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Our Projects</h2>
          <p className="text-red-400">Error loading projects: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4">
      <h2 className="text-3xl font-bold mb-6">Our Projects</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <div key={index} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden transition-transform transform hover:scale-105">
            {project.image_url && (
              <img src={project.image_url} alt={project.name} className="w-full h-48 object-cover" />
            )}
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">{project.name}</h3>
              <p className="text-gray-400 mb-4">{project.description}</p>
              {project.author && (
                <div className="flex items-center mb-2">
                  {project.author.avatar_url ? (
                    <img
                      src={project.author.avatar_url}
                      alt={project.author.username}
                      className="w-6 h-6 rounded-full mr-2"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mr-2">
                      <span className="text-black text-xs font-semibold">
                        {project.author.username.charAt(0)}
                      </span>
                    </div>
                  )}
                  <span className="text-sm text-gray-500">by {project.author.username}</span>
                </div>
              )}
              <p className="text-gray-500 mb-2">
                Tech Stack: {project.tech_stack?.join(', ') || 'Not specified'}
              </p>
              <div className="mt-2 flex justify-between">
                {project.github_link && (
                  <a href={project.github_link} className="text-blue-500 hover:underline transition-colors duration-200">GitHub</a>
                )}
                {project.devpost_link ? (
                  <a href={project.devpost_link} className="text-blue-500 hover:underline transition-colors duration-200">Devpost</a>
                ) : (
                  project.live_link && (
                    <a href={project.live_link} className="text-blue-500 hover:underline transition-colors duration-200">Live Demo</a>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;