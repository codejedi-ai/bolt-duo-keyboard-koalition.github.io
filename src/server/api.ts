import express from 'express';
import { createClient } from '@supabase/supabase-js';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase client with service role key (server-side only)
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // This should be server-side only
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Middleware to verify JWT token
const verifyAuth = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No authorization token provided' });
  }

  const token = authHeader.substring(7);
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token verification failed' });
  }
};

// User Profile Routes
app.get('/api/user-profile', verifyAuth, async (req: any, res: any) => {
  try {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    res.json({ profile: profile || null });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/user-profile', verifyAuth, async (req: any, res: any) => {
  try {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .upsert({
        id: req.user.id,
        ...req.body,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ profile });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/user-profile', verifyAuth, async (req: any, res: any) => {
  try {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .upsert({
        id: req.user.id,
        ...req.body,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ profile });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// User Projects Routes
app.get('/api/user-projects', verifyAuth, async (req: any, res: any) => {
  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ projects: projects || [] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/user-projects', verifyAuth, async (req: any, res: any) => {
  try {
    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        user_id: req.user.id,
        ...req.body,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ project });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/user-projects/:id', verifyAuth, async (req: any, res: any) => {
  try {
    const { data: project, error } = await supabase
      .from('projects')
      .update({
        ...req.body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ project });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/user-projects/:id', verifyAuth, async (req: any, res: any) => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// User Connections Routes
app.get('/api/user-connections', verifyAuth, async (req: any, res: any) => {
  try {
    const status = req.query.status || 'accepted';
    
    const { data: connections, error } = await supabase
      .from('user_connections')
      .select(`
        *,
        connected_user:user_profiles!user_connections_connected_user_id_fkey(*)
      `)
      .or(`user_id.eq.${req.user.id},connected_user_id.eq.${req.user.id}`)
      .eq('status', status);

    if (error) throw error;

    const formattedConnections = connections?.map(conn => ({
      ...conn,
      other_user: conn.user_id === req.user.id ? conn.connected_user : null
    })) || [];

    res.json({ connections: formattedConnections });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/user-connections', verifyAuth, async (req: any, res: any) => {
  try {
    const { connected_user_id } = req.body;
    
    if (!connected_user_id) {
      return res.status(400).json({ error: 'connected_user_id is required' });
    }

    if (connected_user_id === req.user.id) {
      return res.status(400).json({ error: 'Cannot connect to yourself' });
    }

    // Check if connection already exists
    const { data: existingConnection } = await supabase
      .from('user_connections')
      .select('*')
      .or(`and(user_id.eq.${req.user.id},connected_user_id.eq.${connected_user_id}),and(user_id.eq.${connected_user_id},connected_user_id.eq.${req.user.id})`)
      .single();

    if (existingConnection) {
      return res.status(400).json({ error: 'Connection already exists' });
    }

    const { data: connection, error } = await supabase
      .from('user_connections')
      .insert({
        user_id: req.user.id,
        connected_user_id,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ connection });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Event RSVPs Routes
app.get('/api/event-rsvps', verifyAuth, async (req: any, res: any) => {
  try {
    const status = req.query.status;
    
    let query = supabase
      .from('event_rsvps')
      .select('*')
      .eq('user_id', req.user.id)
      .order('event_date', { ascending: true });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: rsvps, error } = await query;

    if (error) throw error;

    const today = new Date().toISOString().split('T')[0];
    const upcomingRsvps = rsvps?.filter(rsvp => rsvp.event_date >= today) || [];
    const pastRsvps = rsvps?.filter(rsvp => rsvp.event_date < today) || [];

    res.json({ 
      rsvps: rsvps || [],
      upcoming: upcomingRsvps,
      past: pastRsvps
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/event-rsvps', verifyAuth, async (req: any, res: any) => {
  try {
    // Check if RSVP already exists for this event
    const { data: existingRsvp } = await supabase
      .from('event_rsvps')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('event_name', req.body.event_name)
      .eq('event_date', req.body.event_date)
      .single();

    if (existingRsvp) {
      return res.status(400).json({ error: 'RSVP already exists for this event' });
    }

    const { data: rsvp, error } = await supabase
      .from('event_rsvps')
      .insert({
        user_id: req.user.id,
        ...req.body,
        status: 'confirmed'
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ rsvp });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/event-rsvps/:id', verifyAuth, async (req: any, res: any) => {
  try {
    const { error } = await supabase
      .from('event_rsvps')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Search Users Route
app.get('/api/search-users', verifyAuth, async (req: any, res: any) => {
  try {
    const searchTerm = req.query.q || '';
    const limit = parseInt(req.query.limit as string) || 20;

    let query = supabase
      .from('user_profiles')
      .select('id, username, bio, skills, avatar_url')
      .neq('id', req.user.id)
      .limit(limit);

    if (searchTerm) {
      query = query.or(`username.ilike.%${searchTerm}%,bio.ilike.%${searchTerm}%,skills.cs.{${searchTerm}}`);
    }

    const { data: users, error: searchError } = await query;

    if (searchError) throw searchError;

    // Get existing connections for the current user
    const { data: connections } = await supabase
      .from('user_connections')
      .select('user_id, connected_user_id, status')
      .or(`user_id.eq.${req.user.id},connected_user_id.eq.${req.user.id}`);

    const connectedUserIds = new Set<string>();
    connections?.forEach(conn => {
      if (conn.user_id === req.user.id) {
        connectedUserIds.add(conn.connected_user_id);
      } else {
        connectedUserIds.add(conn.user_id);
      }
    });

    const usersWithConnectionStatus = users?.map(u => ({
      ...u,
      isConnected: connectedUserIds.has(u.id),
      mutualConnections: Math.floor(Math.random() * 5)
    })) || [];

    res.json({ 
      users: usersWithConnectionStatus,
      total: usersWithConnectionStatus.length
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Events Routes (Public)
app.get('/api/events', async (req: any, res: any) => {
  try {
    const dateFilter = req.query.date;
    const upcomingOnly = req.query.upcoming === 'true';
    
    let query = supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    if (dateFilter) {
      query = query.eq('date', dateFilter);
    }

    if (upcomingOnly) {
      const today = new Date().toISOString().split('T')[0];
      query = query.gte('date', today);
    }

    const { data: events, error } = await query;

    if (error) throw error;

    res.json({ events: events || [] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/events/:id', async (req: any, res: any) => {
  try {
    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    res.json({ event });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Public Projects Route
app.get('/api/public-projects', async (req: any, res: any) => {
  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select(`
        *,
        user_profiles!inner(username, avatar_url)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

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
    })) || [];

    res.json({ projects: publicProjects });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default app;