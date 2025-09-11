import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface ProjectsErrorProps {
  error: string;
  onRetry: () => void;
}

function ProjectsError({ error, onRetry }: ProjectsErrorProps): JSX.Element {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Failed to Load Projects</h3>
            <p className="text-red-400 mb-6">{error}</p>
            <Button 
              onClick={onRetry}
              className="bg-primary hover:bg-primary/90 text-black"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default ProjectsError;