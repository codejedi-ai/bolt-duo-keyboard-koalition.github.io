import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Github, ExternalLink, Edit, Trash2, Code2, Trophy } from 'lucide-react';
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

interface UserProject {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  githubLink?: string;
  liveLink?: string;
  devpostLink?: string;
  image?: string;
  createdAt: string;
}

function MyProjects(): JSX.Element {
  const { user } = useAuth();
  const [projects, setProjects] = useState<UserProject[]>([
    {
      id: '1',
      name: 'Sample Project',
      description: 'This is a sample project to demonstrate the layout. Add your own projects!',
      techStack: ['React', 'TypeScript', 'Tailwind CSS'],
      githubLink: 'https://github.com/example/project',
      createdAt: '2025-01-01'
    }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProject, setNewProject] = useState<Partial<UserProject>>({
    name: '',
    description: '',
    techStack: [],
    githubLink: '',
    liveLink: '',
    devpostLink: ''
  });

  const handleAddProject = () => {
    if (!newProject.name || !newProject.description) return;
    
    const project: UserProject = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description,
      techStack: newProject.techStack || [],
      githubLink: newProject.githubLink,
      liveLink: newProject.liveLink,
      devpostLink: newProject.devpostLink,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setProjects([...projects, project]);
    setNewProject({
      name: '',
      description: '',
      techStack: [],
      githubLink: '',
      liveLink: '',
      devpostLink: ''
    });
    setShowAddForm(false);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(project => project.id !== id));
  };

  const handleTechStackChange = (value: string) => {
    const techArray = value.split(',').map(tech => tech.trim()).filter(tech => tech);
    setNewProject({ ...newProject, techStack: techArray });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">My Projects</h2>
          <p className="text-gray-400">
            Showcase your hackathon projects and personal work
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-primary hover:bg-primary/90 text-black"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Add Project Form */}
      {showAddForm && (
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4 text-white">Add New Project</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={newProject.name || ''}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tech Stack (comma separated)
                </label>
                <input
                  type="text"
                  value={newProject.techStack?.join(', ') || ''}
                  onChange={(e) => handleTechStackChange(e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                  placeholder="React, TypeScript, Node.js"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={newProject.description || ''}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:border-primary focus:outline-none h-24"
                  placeholder="Describe your project"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  GitHub Link
                </label>
                <input
                  type="url"
                  value={newProject.githubLink || ''}
                  onChange={(e) => setNewProject({ ...newProject, githubLink: e.target.value })}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                  placeholder="https://github.com/username/project"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Live Demo Link
                </label>
                <input
                  type="url"
                  value={newProject.liveLink || ''}
                  onChange={(e) => setNewProject({ ...newProject, liveLink: e.target.value })}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                  placeholder="https://your-project.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Devpost/Competition Link
                </label>
                <input
                  type="url"
                  value={newProject.devpostLink || ''}
                  onChange={(e) => setNewProject({ ...newProject, devpostLink: e.target.value })}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                  placeholder="https://devpost.com/software/your-project"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <Button
                onClick={handleAddProject}
                className="bg-primary hover:bg-primary/90 text-black"
                disabled={!newProject.name || !newProject.description}
              >
                Add Project
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="bg-gray-900 border-gray-800 hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white">{project.name}</h3>
                  <div className="flex gap-2">
                    <button className="text-gray-400 hover:text-primary transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteProject(project.id)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                  {project.description}
                </p>
                
                {project.techStack.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2 flex-wrap">
                  {project.githubLink && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                        <Github className="w-3 h-3 mr-1" />
                        GitHub
                      </a>
                    </Button>
                  )}
                  {project.liveLink && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                  {project.devpostLink && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      <a href={project.devpostLink} target="_blank" rel="noopener noreferrer">
                        <Trophy className="w-3 h-3 mr-1" />
                        Devpost
                      </a>
                    </Button>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <p className="text-xs text-gray-500">
                    Added on {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-8 text-center">
            <Code2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Projects Yet</h3>
            <p className="text-gray-400 mb-6">
              Start building your portfolio by adding your first project!
            </p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-primary hover:bg-primary/90 text-black"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default MyProjects;