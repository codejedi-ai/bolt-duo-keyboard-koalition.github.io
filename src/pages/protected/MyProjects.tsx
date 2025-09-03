import { useState } from 'react';
import { useAuth } from '../../components/AuthProvider';
import { apiClient } from '../../lib/api';
import { Plus, Github, ExternalLink, Edit, Trash2, Code2, Trophy } from 'lucide-react';
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export interface UserProject {
  id: string;
  user_id: string;
  name: string;
  description: string;
  tech_stack: string[];
  github_link?: string;
  live_link?: string;
  devpost_link?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

function MyProjects(): JSX.Element {
  const { user } = useAuth();
  const [projects, setProjects] = useState<UserProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    tech_stack: [] as string[],
    github_link: '',
    live_link: '',
    devpost_link: ''
  });
  const [message, setMessage] = useState('');

  // Load projects on component mount
  useState(() => {
    loadProjects();
  });

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getUserProjects();
      setProjects(response.projects || []);
    } catch (error) {
      console.error('Error loading projects:', error);
      setMessage('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name || !newProject.description) return;
    
    try {
      const response = await apiClient.createProject(newProject);
      setProjects([response.project, ...projects]);
      setNewProject({
        name: '',
        description: '',
        tech_stack: [],
        github_link: '',
        live_link: '',
        devpost_link: ''
      });
      setShowAddForm(false);
      setMessage('Project added successfully!');
    } catch (error: any) {
      console.error('Error adding project:', error);
      setMessage(error.message || 'Failed to add project');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await apiClient.deleteProject(id);
      setProjects(projects.filter(project => project.id !== id));
      setMessage('Project deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting project:', error);
      setMessage(error.message || 'Failed to delete project');
    }
  };

  const handleTechStackChange = (value: string) => {
    const techArray = value.split(',').map(tech => tech.trim()).filter(tech => tech);
    setNewProject({ ...newProject, tech_stack: techArray });
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
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

      {message && (
        <div className={`mx-8 mb-4 px-4 py-3 rounded-md ${
          message.includes('success') 
            ? 'bg-green-500/20 border border-green-500 text-green-400'
            : 'bg-red-500/20 border border-red-500 text-red-400'
        }`}>
          {message}
        </div>
      )}

      {/* Add Project Form */}
      {showAddForm && (
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4 text-white">Add New Project</h3>
            <form onSubmit={handleAddProject}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                    placeholder="Enter project name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tech Stack (comma separated)
                  </label>
                  <input
                    type="text"
                    value={newProject.tech_stack.join(', ')}
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
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:border-primary focus:outline-none h-24"
                    placeholder="Describe your project"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    GitHub Link
                  </label>
                  <input
                    type="url"
                    value={newProject.github_link}
                    onChange={(e) => setNewProject({ ...newProject, github_link: e.target.value })}
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
                    value={newProject.live_link}
                    onChange={(e) => setNewProject({ ...newProject, live_link: e.target.value })}
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
                    value={newProject.devpost_link}
                    onChange={(e) => setNewProject({ ...newProject, devpost_link: e.target.value })}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                    placeholder="https://devpost.com/software/your-project"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-black"
                  disabled={!newProject.name || !newProject.description}
                >
                  Add Project
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
              </div>
            </form>
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
                
                {project.tech_stack.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack.map((tech, index) => (
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
                  {project.github_link && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      <a href={project.github_link} target="_blank" rel="noopener noreferrer">
                        <Github className="w-3 h-3 mr-1" />
                        GitHub
                      </a>
                    </Button>
                  )}
                  {project.live_link && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      <a href={project.live_link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                  {project.devpost_link && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      <a href={project.devpost_link} target="_blank" rel="noopener noreferrer">
                        <Trophy className="w-3 h-3 mr-1" />
                        Devpost
                      </a>
                    </Button>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <p className="text-xs text-gray-500">
                    Added on {new Date(project.created_at).toLocaleDateString()}
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