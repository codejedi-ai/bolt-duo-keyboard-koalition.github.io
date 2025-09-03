const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

exports.handler = async (event, context) => {
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

    // Extract RSVP ID from path if present
    const pathParts = path.split('/');
    const rsvpId = pathParts[pathParts.length - 1];

    switch (httpMethod) {
      case 'GET':
        // Get user RSVPs
        const status = queryStringParameters?.status;
        let query = supabase
          .from('event_rsvps')
          .select('*')
          .eq('user_id', user.id)
          .order('event_date', { ascending: true });

        if (status) {
          query = query.eq('status', status);
        }

        const { data: rsvps, error: getError } = await query;

        if (getError) {
          throw getError;
        }

        // Separate upcoming and past events
        const today = new Date().toISOString().split('T')[0];
        const upcomingRsvps = rsvps?.filter(rsvp => rsvp.event_date >= today) || [];
        const pastRsvps = rsvps?.filter(rsvp => rsvp.event_date < today) || [];

        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({ 
            rsvps: rsvps || [],
            upcoming: upcomingRsvps,
            past: pastRsvps
          })
        };

      case 'POST':
        // Create RSVP
        const rsvpData = JSON.parse(body);
        
        // Check if RSVP already exists for this event
        const { data: existingRsvp } = await supabase
          .from('event_rsvps')
          .select('*')
          .eq('user_id', user.id)
          .eq('event_name', rsvpData.event_name)
          .eq('event_date', rsvpData.event_date)
          .single();

        if (existingRsvp) {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'RSVP already exists for this event' })
          };
        }

        const { data: newRsvp, error: createError } = await supabase
          .from('event_rsvps')
          .insert({
            user_id: user.id,
            ...rsvpData,
            status: 'confirmed'
          })
          .select()
          .single();

        if (createError) {
          throw createError;
        }

        return {
          statusCode: 201,
          headers: corsHeaders,
          body: JSON.stringify({ rsvp: newRsvp })
        };

      case 'PUT':
        // Update RSVP status
        if (!rsvpId || rsvpId === 'event-rsvps') {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'RSVP ID required for update' })
          };
        }

        const updateData = JSON.parse(body);
        const { data: updatedRsvp, error: updateError } = await supabase
          .from('event_rsvps')
          .update(updateData)
          .eq('id', rsvpId)
          .eq('user_id', user.id)
          .select()
          .single();

        if (updateError) {
          throw updateError;
        }

        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({ rsvp: updatedRsvp })
        };

      case 'DELETE':
        // Cancel RSVP
        if (!rsvpId || rsvpId === 'event-rsvps') {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'RSVP ID required for cancellation' })
          };
        }

        const { error: deleteError } = await supabase
          .from('event_rsvps')
          .delete()
          .eq('id', rsvpId)
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
  } catch (error) {
    console.error('Error in event-rsvps function:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message })
    };
  }
};