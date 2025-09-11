import React from 'react';
import { Code2, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

function EmptyProjects(): JSX.Element {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-8 text-center">
            <Code2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Projects Yet</h3>
            <p className="text-gray-400 mb-6">
              Be the first to showcase your amazing project to the community!
            </p>
            <Button 
              asChild
              className="bg-primary hover:bg-primary/90 text-black"
            >
              <a href="/auth">
                <Plus className="w-4 h-4 mr-2" />
                Join & Add Project
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default EmptyProjects;