import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');

    const { country } = await req.json();
    if (!country) {
      return new Response(JSON.stringify({ error: 'Missing country' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          {
            role: 'system',
            content: `You are a news and advisory service for immigrant workers. Generate exactly 5 current and realistic-sounding announcements relevant to ${country} that would help immigrant/migrant workers. Include a mix of:
- Travel advisories (flight/ship price changes, visa updates)
- Currency exchange rate alerts
- Safety/crisis warnings
- Labor law changes or workers' rights updates
- Weather/natural disaster alerts
- Public holiday or transportation changes

For each announcement, return a JSON array of objects with:
- "title": Short headline (under 80 chars)
- "body": 2-3 sentence description
- "category": one of "travel", "safety", "finance", "labor", "weather", "transport"
- "urgency": one of "info", "warning", "alert"
- "time": a realistic time like "2h ago", "5h ago", "1d ago", "Just now"

Return ONLY the JSON array, no other text.`,
          },
          { role: 'user', content: `Generate current announcements for ${country}` },
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Credits exhausted. Please add funds.' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errBody = await response.text();
      throw new Error(`AI error [${response.status}]: ${errBody}`);
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content?.trim() || '[]';
    
    // Strip markdown code fences if present
    if (content.startsWith('```')) {
      content = content.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const announcements = JSON.parse(content);

    return new Response(JSON.stringify({ announcements }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Announcements error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
