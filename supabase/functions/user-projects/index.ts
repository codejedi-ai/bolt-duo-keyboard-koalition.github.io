import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

interface Database {
  public: {
    Tables: {
      user_projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string
          tech_stack: string[] | null
          github_link: string | null
          live_link: string | null
          devpost_link: string | null
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          name: string
          description: string
          tech_stack?: string[] | null
          github_link?: string | null
          live_link?: string | null
          devpost_link?: string | null
          image_url?: string | null
        }
        Update: {
          name?: string
          description?: string
          tech_stack?: string[] | null
          github_link?: string | null
          live_link?: string | null
          devpost_link?: string | null
          image_url?: string | null
        }
      }
    }
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const url = new URL(req.url)
    const pathParts = url.pathname.split('/')
    const projectId = pathParts[pathParts.length - 1]

    switch (req.method) {
      case 'GET': {
        if (projectId && projectId !== 'user-projects') {
          // Get specific project
          const { data: project, error } = await supabaseClient
            .from('user_projects')
            .select('*')
            .eq('id', projectId)
            .eq('user_id', user.id)
            .single()

          if (error) {
            throw error
          }

          return new Response(
            JSON.stringify({ project }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          )
        } else {
          // Get all user projects
          const { data: projects, error } = await supabaseClient
            .from('user_projects')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

          if (error) {
            throw error
          }

          return new Response(
            JSON.stringify({ projects: projects || [] }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          )
        }
      }

      case 'POST': {
        const projectData = await req.json()
        
        const { data: project, error } = await supabaseClient
          .from('user_projects')
          .insert({
            user_id: user.id,
            ...projectData,
          })
          .select()
          .single()

        if (error) {
          throw error
        }

        return new Response(
          JSON.stringify({ project }),
          {
            status: 201,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      case 'PUT': {
        if (!projectId || projectId === 'user-projects') {
          return new Response(
            JSON.stringify({ error: 'Project ID required for update' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          )
        }

        const updateData = await req.json()
        
        const { data: project, error } = await supabaseClient
          .from('user_projects')
          .update({
            ...updateData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', projectId)
          .eq('user_id', user.id)
          .select()
          .single()

        if (error) {
          throw error
        }

        return new Response(
          JSON.stringify({ project }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      case 'DELETE': {
        if (!projectId || projectId === 'user-projects') {
          return new Response(
            JSON.stringify({ error: 'Project ID required for deletion' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          )
        }

        const { error } = await supabaseClient
          .from('user_projects')
          .delete()
          .eq('id', projectId)
          .eq('user_id', user.id)

        if (error) {
          throw error
        }

        return new Response(
          JSON.stringify({ success: true }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          {
            status: 405,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})