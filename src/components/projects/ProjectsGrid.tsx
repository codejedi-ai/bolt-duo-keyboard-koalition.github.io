import React from 'react';
import ProjectCard from './ProjectCard';

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

interface ProjectsGridProps {
  projects: Project[];
}

function ProjectsGrid({ projects }: ProjectsGridProps): JSX.Element {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

export default ProjectsGrid;