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
    const { httpMethod, body, queryStringParameters } = event;
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

    switch (httpMethod) {
      case 'GET':
        // Get user profile
        const { data: profile, error: getError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (getError && getError.code !== 'PGRST116') { // PGRST116 = no rows returned
          throw getError;
        }

        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({ profile: profile || null })
        };

      case 'POST':
      case 'PUT':
        // Create or update user profile
        const profileData = JSON.parse(body);
        const { data: upsertedProfile, error: upsertError } = await supabase
          .from('user_profiles')
          .upsert({
            id: user.id,
            ...profileData,
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (upsertError) {
          throw upsertError;
        }

        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({ profile: upsertedProfile })
        };

      case 'DELETE':
        // Delete user profile
        const { error: deleteError } = await supabase
          .from('user_profiles')
          .delete()
          .eq('id', user.id);

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
    console.error('Error in user-profile function:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message })
    };
  }
};