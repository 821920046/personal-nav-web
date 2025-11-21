// supabase/functions/get-weather/index.ts
// Deno edge function - 使用 QWeather (和风天气) 优先，其次回退到 OpenWeatherMap（可选）
Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'false'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    const city = (payload.city || '').trim();
    if (!city) {
      return new Response(JSON.stringify({ error: { code: 'NO_CITY', message: 'No city provided' } }), {
        status: 400,
        headers: {...corsHeaders, 'Content-Type': 'application/json'}
      });
    }

    // 1) 尝试读取和风 Key（支持几个常见 env 名）
    const hefengKey = Deno.env.get('HEFENG_API_KEY') || Deno.env.get('HEFENG_KEY') || Deno.env.get('QWEATHER_KEY') || Deno.env.get('WEATHER_API_KEY');

    if (hefengKey) {
      // 使用和风 v7 接口（实时天气）
      // 文档: https://dev.qweather.com/docs/api/weather/weather-now/
      const location = encodeURIComponent(city);
      const url = `https://devapi.qweather.com/v7/weather/now?location=${location}&key=${hefengKey}&lang=zh`;
      const resp = await fetch(url, { method: 'GET' });
      if (!resp.ok) {
        throw new Error(`HeWeather API error status ${resp.status}`);
      }
      const json = await resp.json();
      // qweather 返回示例: { "code":"200", "now": { "temp":"28", "text":"多云", ... }, ... }
      // 不同接口版本字段可能有差异，下面做容错解析
      let temperature: string | number = '--';
      let condition = '';
      if (json && (json.now || json.now)) {
        const now = json.now || json.now;
        // qweather v7: now.temp, now.text
        temperature = now.temp ?? now.temperature ?? '--';
        condition = now.text ?? now.description ?? '';
      } else if (json.code && json.now) {
        temperature = json.now.temp ?? '--';
        condition = json.now.text ?? '';
      } else {
        // 若返回结构不同，尝试常见字段
        temperature = json.temp ?? json.temperature ?? '--';
        condition = json.text ?? json.cond_txt ?? '';
      }

      return new Response(JSON.stringify({ data: { temperature, condition } }), {
        status: 200,
        headers: {...corsHeaders, 'Content-Type': 'application/json'}
      });
    }

    // 2) 如果没有和风 Key，回退到 OpenWeatherMap（仍需 OPENWEATHER_API_KEY）
    const openKey = Deno.env.get('OPENWEATHER_API_KEY') || Deno.env.get('OPENWEATHER_KEY');
    if (!openKey) {
      return new Response(JSON.stringify({ error: { code: 'NO_WEATHER_KEY', message: 'No weather API key configured' } }), {
        status: 500,
        headers: {...corsHeaders, 'Content-Type': 'application/json'}
      });
    }
    // 回退：用 OpenWeatherMap（根据需要保留）
    const englishCity = encodeURIComponent(city);
    const owUrl = `https://api.openweathermap.org/data/2.5/weather?q=${englishCity},CN&appid=${openKey}&units=metric&lang=zh_cn`;
    const owResp = await fetch(owUrl);
    if (!owResp.ok) {
      throw new Error(`OpenWeatherMap API error status ${owResp.status}`);
    }
    const owJson = await owResp.json();
    const temp = owJson?.main?.temp ?? '--';
    const owCondition = (owJson?.weather && owJson.weather[0] && owJson.weather[0].description) ? owJson.weather[0].description : '';

    return new Response(JSON.stringify({ data: { temperature: temp, condition: owCondition } }), {
      status: 200,
      headers: {...corsHeaders, 'Content-Type': 'application/json'}
    });

  } catch (error) {
    console.error('Weather API error:', error);
    const errorResponse = {
      error: {
        code: 'WEATHER_FETCH_FAILED',
        message: error.message || 'Unknown error'
      }
    };
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
