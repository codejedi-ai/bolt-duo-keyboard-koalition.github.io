import React from 'react';
import { Github, ExternalLink, Trophy } from 'lucide-react';
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

interface ProjectCardProps {
  project: {
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
  };
}

function ProjectCard({ project }: ProjectCardProps): JSX.Element {
  return (
    <Card className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden transition-transform transform hover:scale-105">
      {project.image_url && (
        <img 
          src={project.image_url} 
          alt={project.name} 
          className="w-full h-48 object-cover" 
        />
      )}
      <CardContent className="p-4">
        <h3 className="text-xl font-bold mb-2 text-white">{project.name}</h3>
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
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <a 
                href={project.github_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <Github className="w-3 h-3 mr-1" />
                GitHub
              </a>
            </Button>
          )}
          
          {project.devpost_link ? (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <a 
                href={project.devpost_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <Trophy className="w-3 h-3 mr-1" />
                Devpost
              </a>
            </Button>
          ) : (
            project.live_link && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <a 
                  href={project.live_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Live Demo
                </a>
              </Button>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ProjectCard;