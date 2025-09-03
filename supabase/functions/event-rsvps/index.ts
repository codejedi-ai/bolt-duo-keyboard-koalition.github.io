import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

interface Database {
  public: {
    Tables: {
      event_rsvps: {
        Row: {
          id: string
          user_id: string
          event_name: string
          event_date: string
          event_time: string | null
          event_location: string | null
          event_description: string | null
          rsvp_date: string
          status: 'confirmed' | 'cancelled'
        }
        Insert: {
          user_id: string
          event_name: string
          event_date: string
          event_time?: string | null
          event_location?: string | null
          event_description?: string | null
          status?: 'confirmed' | 'cancelled'
        }
        Update: {
          event_name?: string
          event_date?: string
          event_time?: string | null
          event_location?: string | null
          event_description?: string | null
          status?: 'confirmed' | 'cancelled'
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
    const rsvpId = pathParts[pathParts.length - 1]

    switch (req.method) {
      case 'GET': {
        const status = url.searchParams.get('status')
        
        let query = supabaseClient
          .from('event_rsvps')
          .select('*')
          .eq('user_id', user.id)
          .order('event_date', { ascending: true })

        if (status) {
          query = query.eq('status', status)
        }

        const { data: rsvps, error } = await query

        if (error) {
          throw error
        }

        // Separate upcoming and past events
        const today = new Date().toISOString().split('T')[0]
        const upcomingRsvps = rsvps?.filter(rsvp => rsvp.event_date >= today) || []
        const pastRsvps = rsvps?.filter(rsvp => rsvp.event_date < today) || []

        return new Response(
          JSON.stringify({ 
            rsvps: rsvps || [],
            upcoming: upcomingRsvps,
            past: pastRsvps
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      case 'POST': {
        const rsvpData = await req.json()
        
        // Check if RSVP already exists for this event
        const { data: existingRsvp } = await supabaseClient
          .from('event_rsvps')
          .select('*')
          .eq('user_id', user.id)
          .eq('event_name', rsvpData.event_name)
          .eq('event_date', rsvpData.event_date)
          .single()

        if (existingRsvp) {
          return new Response(
            JSON.stringify({ error: 'RSVP already exists for this event' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          )
        }

        const { data: rsvp, error } = await supabaseClient
          .from('event_rsvps')
          .insert({
            user_id: user.id,
            ...rsvpData,
            status: 'confirmed'
          })
          .select()
          .single()

        if (error) {
          throw error
        }

        return new Response(
          JSON.stringify({ rsvp }),
          {
            status: 201,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      case 'PUT': {
        if (!rsvpId || rsvpId === 'event-rsvps') {
          return new Response(
            JSON.stringify({ error: 'RSVP ID required for update' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          )
        }

        const updateData = await req.json()
        
        const { data: rsvp, error } = await supabaseClient
          .from('event_rsvps')
          .update(updateData)
          .eq('id', rsvpId)
          .eq('user_id', user.id)
          .select()
          .single()

        if (error) {
          throw error
        }

        return new Response(
          JSON.stringify({ rsvp }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      case 'DELETE': {
        if (!rsvpId || rsvpId === 'event-rsvps') {
          return new Response(
            JSON.stringify({ error: 'RSVP ID required for cancellation' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          )
        }

        const { error } = await supabaseClient
          .from('event_rsvps')
          .delete()
          .eq('id', rsvpId)
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