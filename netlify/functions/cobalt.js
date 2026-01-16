export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        Allow: 'POST',
      },
      body: 'Method Not Allowed',
    }
  }

  let payload
  try {
    payload = JSON.parse(event.body || '{}')
  } catch (error) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'error', text: 'Invalid JSON.' }),
    }
  }

  if (!payload?.url) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'error', text: 'Missing url.' }),
    }
  }

  const rapidApiKey = process.env.RAPIDAPI_KEY

  if (!rapidApiKey) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'error',
        text: 'Missing RapidAPI key. Add RAPIDAPI_KEY in Netlify env.',
      }),
    }
  }

  try {
    const response = await fetch(
      'https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-host': 'social-download-all-in-one.p.rapidapi.com',
          'x-rapidapi-key': rapidApiKey,
        },
        body: JSON.stringify({ url: payload.url }),
      }
    )

    const data = await response.json()

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data),
    }
  } catch (error) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ status: 'error', text: 'Upstream request failed.' }),
    }
  }
}
