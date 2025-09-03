import { createClient } from '@supabase/supabase-js';
import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    const { httpMethod, body, queryStringParameters, path } = event;
    const authHeader = event.headers.authorization;
    
    if (!authHeader) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Authorization header required' })
      };
    }

    // Verify the user token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid token' })
      };
    }

    // Extract project ID from path if present
    const pathParts = path?.split('/') || [];
    const projectId = pathParts[pathParts.length - 1];

    switch (httpMethod) {
      case 'GET':
        if (projectId && projectId !== 'user-projects') {
          // Get specific project
          const { data: project, error: getError } = await supabase
            .from('user_projects')
            .select('*')
            .eq('id', projectId)
            .eq('user_id', user.id)
            .single();

          if (getError) {
            throw getError;
          }

          return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ project })
          };
        } else {
          // Get all user projects
          const { data: projects, error: getError } = await supabase
            .from('user_projects')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (getError) {
            throw getError;
          }

          return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ projects: projects || [] })
          };
        }

      case 'POST':
        // Create new project
        const projectData = JSON.parse(body || '{}');
        const { data: newProject, error: createError } = await supabase
          .from('user_projects')
          .insert({
            user_id: user.id,
            ...projectData
          })
          .select()
          .single();

        if (createError) {
          throw createError;
        }

        return {
          statusCode: 201,
          headers: corsHeaders,
          body: JSON.stringify({ project: newProject })
        };

      case 'PUT':
        // Update existing project
        if (!projectId || projectId === 'user-projects') {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Project ID required for update' })
          };
        }

        const updateData = JSON.parse(body || '{}');
        const { data: updatedProject, error: updateError } = await supabase
          .from('user_projects')
          .update({
            ...updateData,
            updated_at: new Date().toISOString()
          })
          .eq('id', projectId)
          .eq('user_id', user.id)
          .select()
          .single();

        if (updateError) {
          throw updateError;
        }

        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({ project: updatedProject })
        };

      case 'DELETE':
        // Delete project
        if (!projectId || projectId === 'user-projects') {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Project ID required for deletion' })
          };
        }

        const { error: deleteError } = await supabase
          .from('user_projects')
          .delete()
          .eq('id', projectId)
          .eq('user_id', user.id);

        if (deleteError) {
          throw deleteError;
        }

        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({ success: true })
        };

      default:
        return {
          statusCode: 405,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error: any) {
    console.error('Error in user-projects function:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message })
    };
  }
};