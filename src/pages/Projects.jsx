import projectsData from '../data/projects.json';

function Projects() {
  return (
    <section className="py-16 px-4">
      <h2 className="text-3xl font-bold mb-6">Our Projects</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectsData.map((project, index) => (
          <div key={index} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden transition-transform transform hover:scale-105">
            <img src={project.image} alt={project.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">{project.name}</h3>
              <p className="text-gray-400 mb-4">{project.description}</p>
              <p className="text-gray-500 mb-2">
                Tech Stack: {project.techStack.join(', ')}
              </p>
              <div className="mt-2 flex justify-between">
                <a href={project.githubLink} className="text-blue-500 hover:underline transition-colors duration-200">GitHub</a>
                {project.devpostLink ? (
                  <a href={project.devpostLink} className="text-blue-500 hover:underline transition-colors duration-200">Devpost</a>
                ) : (
                  project.doraLink && (
                    <a href={project.doraLink} className="text-blue-500 hover:underline transition-colors duration-200">Dora</a>
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