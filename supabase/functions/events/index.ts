import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          name: string
          date: string
          time: string | null
          description: string
          image_url: string | null
          location: string | null
          registration_link: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          date: string
          time?: string | null
          description: string
          image_url?: string | null
          location?: string | null
          registration_link?: string | null
        }
        Update: {
          name?: string
          date?: string
          time?: string | null
          description?: string
          image_url?: string | null
          location?: string | null
          registration_link?: string | null
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
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const url = new URL(req.url)
    const pathParts = url.pathname.split('/')
    const eventId = pathParts[pathParts.length - 1]

    switch (req.method) {
      case 'GET': {
        if (eventId && eventId !== 'events') {
          // Get specific event
          const { data: event, error } = await supabaseClient
            .from('events')
            .select('*')
            .eq('id', eventId)
            .single()

          if (error) {
            throw error
          }

          return new Response(
            JSON.stringify({ event }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          )
        } else {
          // Get all events with optional filtering
          const dateFilter = url.searchParams.get('date')
          const upcomingOnly = url.searchParams.get('upcoming') === 'true'
          
          let query = supabaseClient
            .from('events')
            .select('*')
            .order('date', { ascending: true })

          if (dateFilter) {
            query = query.eq('date', dateFilter)
          }

          if (upcomingOnly) {
            const today = new Date().toISOString().split('T')[0]
            query = query.gte('date', today)
          }

          const { data: events, error } = await query

          if (error) {
            throw error
          }

          return new Response(
            JSON.stringify({ events: events || [] }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          )
        }
      }

      case 'POST': {
        // Get the authenticated user (optional for events)
        const authHeader = req.headers.get('Authorization')
        if (authHeader) {
          const supabaseClientWithAuth = createClient<Database>(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            {
              global: {
                headers: { Authorization: authHeader },
              },
            }
          )

          const {
            data: { user },
            error: userError,
          } = await supabaseClientWithAuth.auth.getUser()

          if (userError || !user) {
            return new Response(
              JSON.stringify({ error: 'Unauthorized' }),
              {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              }
            )
          }
        }

        const eventData = await req.json()
        
        const { data: event, error } = await supabaseClient
          .from('events')
          .insert(eventData)
          .select()
          .single()

        if (error) {
          throw error
        }

        return new Response(
          JSON.stringify({ event }),
          {
            status: 201,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      case 'PUT': {
        if (!eventId || eventId === 'events') {
          return new Response(
            JSON.stringify({ error: 'Event ID required for update' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          )
        }

        // Require authentication for updates
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
          return new Response(
            JSON.stringify({ error: 'Authorization required' }),
            {
              status: 401,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          )
        }

        const supabaseClientWithAuth = createClient<Database>(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_ANON_KEY') ?? '',
          {
            global: {
              headers: { Authorization: authHeader },
            },
          }
        )

        const {
          data: { user },
          error: userError,
        } = await supabaseClientWithAuth.auth.getUser()

        if (userError || !user) {
          return new Response(
            JSON.stringify({ error: 'Unauthorized' }),
            {
              status: 401,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          )
        }

        const updateData = await req.json()
        
        const { data: event, error } = await supabaseClient
          .from('events')
          .update({
            ...updateData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', eventId)
          .select()
          .single()

        if (error) {
          throw error
        }

        return new Response(
          JSON.stringify({ event }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      case 'DELETE': {
        if (!eventId || eventId === 'events') {
          return new Response(
            JSON.stringify({ error: 'Event ID required for deletion' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          )
        }

        // Require authentication for deletion
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
          return new Response(
            JSON.stringify({ error: 'Authorization required' }),
            {
              status: 401,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          )
        }

        const supabaseClientWithAuth = createClient<Database>(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_ANON_KEY') ?? '',
          {
            global: {
              headers: { Authorization: authHeader },
            },
          }
        )

        const {
          data: { user },
          error: userError,
        } = await supabaseClientWithAuth.auth.getUser()

        if (userError || !user) {
          return new Response(
            JSON.stringify({ error: 'Unauthorized' }),
            {
              status: 401,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          )
        }

        const { error } = await supabaseClient
          .from('events')
          .delete()
          .eq('id', eventId)

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