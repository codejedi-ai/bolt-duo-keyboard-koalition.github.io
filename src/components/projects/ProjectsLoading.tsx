import React from 'react';

function ProjectsLoading(): JSX.Element {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <p className="text-center text-gray-400 mt-4">Loading projects...</p>
      </div>
    </section>
  );
}

export default ProjectsLoading;