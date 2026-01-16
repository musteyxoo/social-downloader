export default async (request) => {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: {
        Allow: 'POST',
      },
    })
  }

  let payload
  try {
    payload = await request.json()
  } catch (error) {
    return new Response(JSON.stringify({ status: 'error', text: 'Invalid JSON.' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  if (!payload?.url) {
    return new Response(JSON.stringify({ status: 'error', text: 'Missing url.' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  try {
    const response = await fetch('https://api.cobalt.tools/api/json', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ status: 'error', text: 'Upstream request failed.' }),
      {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }
}
