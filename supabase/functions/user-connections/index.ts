import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

interface Database {
  public: {
    Tables: {
      user_connections: {
        Row: {
          id: string
          user_id: string
          connected_user_id: string
          status: 'pending' | 'accepted' | 'blocked'
          created_at: string
        }
        Insert: {
          user_id: string
          connected_user_id: string
          status?: 'pending' | 'accepted' | 'blocked'
        }
        Update: {
          status?: 'pending' | 'accepted' | 'blocked'
        }
      }
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
    const connectionId = pathParts[pathParts.length - 1]

    switch (req.method) {
      case 'GET': {
        const status = url.searchParams.get('status') || 'accepted'
        
        const { data: connections, error } = await supabaseClient
          .from('user_connections')
          .select(`
            *,
            connected_user:user_profiles!user_connections_connected_user_id_fkey(*)
          `)
          .or(`user_id.eq.${user.id},connected_user_id.eq.${user.id}`)
          .eq('status', status)

        if (error) {
          throw error
        }

        // Format the connections to show the other user's profile
        const formattedConnections = connections?.map(conn => ({
          ...conn,
          other_user: conn.user_id === user.id ? conn.connected_user : null
        })) || []

        return new Response(
          JSON.stringify({ connections: formattedConnections }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      case 'POST': {
        const { connected_user_id } = await req.json()
        
        if (!connected_user_id) {
          return new Response(
            JSON.stringify({ error: 'connected_user_id is required' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          )
        }

        if (connected_user_id === user.id) {
          return new Response(
            JSON.stringify({ error: 'Cannot connect to yourself' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          )
        }

        // Check if connection already exists
        const { data: existingConnection } = await supabaseClient
          .from('user_connections')
          .select('*')
          .or(`and(user_id.eq.${user.id},connected_user_id.eq.${connected_user_id}),and(user_id.eq.${connected_user_id},connected_user_id.eq.${user.id})`)
          .single()

        if (existingConnection) {
          return new Response(
            JSON.stringify({ error: 'Connection already exists' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          )
        }

        const { data: connection, error } = await supabaseClient
          .from('user_connections')
          .insert({
            user_id: user.id,
            connected_user_id,
            status: 'pending'
          })
          .select()
          .single()

        if (error) {
          throw error
        }

        return new Response(
          JSON.stringify({ connection }),
          {
            status: 201,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      case 'PUT': {
        if (!connectionId || connectionId === 'user-connections') {
          return new Response(
            JSON.stringify({ error: 'Connection ID required for update' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          )
        }

        const { status: newStatus } = await req.json()
        
        if (!['accepted', 'blocked'].includes(newStatus)) {
          return new Response(
            JSON.stringify({ error: 'Invalid status' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          )
        }

        const { data: connection, error } = await supabaseClient
          .from('user_connections')
          .update({ status: newStatus })
          .eq('id', connectionId)
          .eq('connected_user_id', user.id) // Only the recipient can update
          .select()
          .single()

        if (error) {
          throw error
        }

        return new Response(
          JSON.stringify({ connection }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      case 'DELETE': {
        if (!connectionId || connectionId === 'user-connections') {
          return new Response(
            JSON.stringify({ error: 'Connection ID required for deletion' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          )
        }

        const { error } = await supabaseClient
          .from('user_connections')
          .delete()
          .eq('id', connectionId)
          .or(`user_id.eq.${user.id},connected_user_id.eq.${user.id}`)

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