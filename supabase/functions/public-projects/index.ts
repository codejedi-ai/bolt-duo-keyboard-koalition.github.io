import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
      }
      user_profiles: {
        Row: {
          id: string
          username: string | null
          avatar_url: string | null
        }
      }
    }
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  try {
    const supabaseClient = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get all projects with user profile information
    // Using service role key to bypass RLS for public display
    const { data: projects, error } = await supabaseClient
      .from('user_projects')
      .select(`
        *,
        user_profiles!inner(username, avatar_url)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    // Format projects for public display
    const publicProjects = projects?.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description,
      tech_stack: project.tech_stack || [],
      github_link: project.github_link,
      live_link: project.live_link,
      devpost_link: project.devpost_link,
      image_url: project.image_url,
      created_at: project.created_at,
      author: {
        username: project.user_profiles?.username || 'Anonymous',
        avatar_url: project.user_profiles?.avatar_url
      }
    })) || []

    return new Response(
      JSON.stringify({ projects: publicProjects }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error fetching public projects:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})