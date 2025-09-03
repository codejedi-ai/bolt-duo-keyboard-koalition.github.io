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

    // Extract connection ID from path if present
    const pathParts = path.split('/');
    const connectionId = pathParts[pathParts.length - 1];

    switch (httpMethod) {
      case 'GET':
        // Get user connections
        const status = queryStringParameters?.status || 'accepted';
        
        const { data: connections, error: getError } = await supabase
          .from('user_connections')
          .select(`
            *,
            connected_user:user_profiles!user_connections_connected_user_id_fkey(*)
          `)
          .or(`user_id.eq.${user.id},connected_user_id.eq.${user.id}`)
          .eq('status', status);

        if (getError) {
          throw getError;
        }

        // Format the connections to show the other user's profile
        const formattedConnections = connections?.map(conn => ({
          ...conn,
          other_user: conn.user_id === user.id ? conn.connected_user : null
        })) || [];

        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({ connections: formattedConnections })
        };

      case 'POST':
        // Create connection request
        const { connected_user_id } = JSON.parse(body);
        
        if (!connected_user_id) {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'connected_user_id is required' })
          };
        }

        if (connected_user_id === user.id) {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Cannot connect to yourself' })
          };
        }

        // Check if connection already exists
        const { data: existingConnection } = await supabase
          .from('user_connections')
          .select('*')
          .or(`and(user_id.eq.${user.id},connected_user_id.eq.${connected_user_id}),and(user_id.eq.${connected_user_id},connected_user_id.eq.${user.id})`)
          .single();

        if (existingConnection) {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Connection already exists' })
          };
        }

        const { data: newConnection, error: createError } = await supabase
          .from('user_connections')
          .insert({
            user_id: user.id,
            connected_user_id,
            status: 'pending'
          })
          .select()
          .single();

        if (createError) {
          throw createError;
        }

        return {
          statusCode: 201,
          headers: corsHeaders,
          body: JSON.stringify({ connection: newConnection })
        };

      case 'PUT':
        // Update connection status (accept/reject)
        if (!connectionId || connectionId === 'user-connections') {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Connection ID required for update' })
          };
        }

        const { status: newStatus } = JSON.parse(body);
        
        if (!['accepted', 'blocked'].includes(newStatus)) {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Invalid status' })
          };
        }

        const { data: updatedConnection, error: updateError } = await supabase
          .from('user_connections')
          .update({ status: newStatus })
          .eq('id', connectionId)
          .eq('connected_user_id', user.id) // Only the recipient can update
          .select()
          .single();

        if (updateError) {
          throw updateError;
        }

        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({ connection: updatedConnection })
        };

      case 'DELETE':
        // Delete connection
        if (!connectionId || connectionId === 'user-connections') {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Connection ID required for deletion' })
          };
        }

        const { error: deleteError } = await supabase
          .from('user_connections')
          .delete()
          .eq('id', connectionId)
          .or(`user_id.eq.${user.id},connected_user_id.eq.${user.id}`);

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
    console.error('Error in user-connections function:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message })
    };
  }
};