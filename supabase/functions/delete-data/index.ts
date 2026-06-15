import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type Scope = 'listings' | 'messages' | 'favorites' | 'blocks' | 'reports' | 'profile_info' | 'all';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anonKey = Deno.env.get('SUPABASE_PUBLISHABLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY')!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userErr } = await userClient.auth.getUser();
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json().catch(() => ({}));
    const scopes: Scope[] = Array.isArray(body?.scopes) ? body.scopes : [];
    if (scopes.length === 0) {
      return new Response(JSON.stringify({ error: 'No scopes provided' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const admin = createClient(supabaseUrl, serviceKey);
    const wants = (s: Scope) => scopes.includes(s) || scopes.includes('all');

    if (wants('listings')) await admin.from('products').delete().eq('seller_id', user.id);
    if (wants('favorites')) await admin.from('favorites').delete().eq('user_id', user.id);
    if (wants('messages')) {
      await admin.from('messages').delete().eq('sender_id', user.id);
      await admin.from('conversations').delete().or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`);
    }
    if (wants('blocks')) {
      await admin.from('user_blocks').delete().or(`blocker_id.eq.${user.id},blocked_id.eq.${user.id}`);
    }
    if (wants('reports')) await admin.from('reports').delete().eq('reporter_id', user.id);
    if (wants('profile_info')) {
      await admin.from('profiles').update({
        full_name: null, avatar_url: null, bio: null, location: null, phone: null, website: null,
      }).eq('id', user.id);
    }

    return new Response(JSON.stringify({ success: true, scopes }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('delete-data error', err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
