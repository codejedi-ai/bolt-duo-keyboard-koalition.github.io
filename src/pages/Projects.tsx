import React from 'react';
import { useProjects } from '../hooks/useProjects';
import ProjectsHeader from '../components/projects/ProjectsHeader';
import ProjectsGrid from '../components/projects/ProjectsGrid';
import ProjectsLoading from '../components/projects/ProjectsLoading';
import ProjectsError from '../components/projects/ProjectsError';
import EmptyProjects from '../components/projects/EmptyProjects';

function Projects(): JSX.Element {
  const { projects, isLoading, error, refetch } = useProjects();

  if (isLoading) {
    return <ProjectsLoading />;
  }

  if (error) {
    return <ProjectsError error={error} onRetry={refetch} />;
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <ProjectsHeader />
        {projects.length > 0 ? (
          <ProjectsGrid projects={projects} />
        ) : (
          <EmptyProjects />
        )}
      </div>
    </section>
  );
}

export default Projects;