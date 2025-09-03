const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, OPTIONS'
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

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { queryStringParameters } = event;
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

    const searchTerm = queryStringParameters?.q || '';
    const limit = parseInt(queryStringParameters?.limit) || 20;

    let query = supabase
      .from('user_profiles')
      .select('id, username, bio, skills, avatar_url')
      .neq('id', user.id) // Exclude current user
      .limit(limit);

    if (searchTerm) {
      // Search by username, bio, or skills
      query = query.or(`username.ilike.%${searchTerm}%,bio.ilike.%${searchTerm}%,skills.cs.{${searchTerm}}`);
    }

    const { data: users, error: searchError } = await query;

    if (searchError) {
      throw searchError;
    }

    // Get existing connections for the current user
    const { data: connections } = await supabase
      .from('user_connections')
      .select('user_id, connected_user_id, status')
      .or(`user_id.eq.${user.id},connected_user_id.eq.${user.id}`);

    // Create a map of connected user IDs
    const connectedUserIds = new Set();
    connections?.forEach(conn => {
      if (conn.user_id === user.id) {
        connectedUserIds.add(conn.connected_user_id);
      } else {
        connectedUserIds.add(conn.user_id);
      }
    });

    // Add connection status to each user
    const usersWithConnectionStatus = users?.map(u => ({
      ...u,
      isConnected: connectedUserIds.has(u.id),
      mutualConnections: Math.floor(Math.random() * 5) // Mock data for now
    })) || [];

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ 
        users: usersWithConnectionStatus,
        total: usersWithConnectionStatus.length
      })
    };

  } catch (error) {
    console.error('Error in search-users function:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message })
    };
  }
};