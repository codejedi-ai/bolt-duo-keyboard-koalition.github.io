import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          username: string | null
          bio: string | null
          skills: string[] | null
          github_url: string | null
          linkedin_url: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
      }
      user_connections: {
        Row: {
          id: string
          user_id: string
          connected_user_id: string
          status: 'pending' | 'accepted' | 'blocked'
          created_at: string
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
    const searchTerm = url.searchParams.get('q') || ''
    const limit = parseInt(url.searchParams.get('limit') || '20')

    let query = supabaseClient
      .from('user_profiles')
      .select('id, username, bio, skills, avatar_url')
      .neq('id', user.id) // Exclude current user
      .limit(limit)

    if (searchTerm) {
      // Search by username, bio, or skills
      query = query.or(`username.ilike.%${searchTerm}%,bio.ilike.%${searchTerm}%,skills.cs.{${searchTerm}}`)
    }

    const { data: users, error: searchError } = await query

    if (searchError) {
      throw searchError
    }

    // Get existing connections for the current user
    const { data: connections } = await supabaseClient
      .from('user_connections')
      .select('user_id, connected_user_id, status')
      .or(`user_id.eq.${user.id},connected_user_id.eq.${user.id}`)

    // Create a map of connected user IDs
    const connectedUserIds = new Set<string>()
    connections?.forEach(conn => {
      if (conn.user_id === user.id) {
        connectedUserIds.add(conn.connected_user_id)
      } else {
        connectedUserIds.add(conn.user_id)
      }
    })

    // Add connection status to each user
    const usersWithConnectionStatus = users?.map(u => ({
      ...u,
      isConnected: connectedUserIds.has(u.id),
      mutualConnections: Math.floor(Math.random() * 5) // Mock data for now
    })) || []

    return new Response(
      JSON.stringify({ 
        users: usersWithConnectionStatus,
        total: usersWithConnectionStatus.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

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