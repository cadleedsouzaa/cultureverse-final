// netlify/functions/get-aai-token.ts
import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  try {
    const response = await fetch('https://api.assemblyai.com/v2/realtime/token', {
      method: 'POST',
      headers: {
        Authorization: process.env.ASSEMBLYAI_API_KEY as string, // Set this in Netlify Dashboard
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ expires_in: 3600 }), // Token valid for 1 hour
    });

    const data = await response.json();

    if (data.error) {
      return { statusCode: 400, body: JSON.stringify(data) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data), // Returns { token: "..." }
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};