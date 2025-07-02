// src/app/api/whatsapp/send-message/route.ts

import { NextResponse } from 'next/server';

// Export a named function for the POST method
export async function POST(req: Request) {
  try {
    // 1. Get the request body
    const body = await req.json();
    const { to, parameters } = body;

    // 2. Validate the input
    if (!to || !parameters || !Array.isArray(parameters) || parameters.length !== 3) {
      return NextResponse.json({ 
        message: 'The "to" number and an array of exactly 3 "parameters" are required.' 
      }, { status: 400 });
    }

    const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
    const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
      console.error('WhatsApp API credentials are not set in environment variables');
      return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
    }

    // 3. Construct the WhatsApp API request payload
    const apiUrl = `https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;
    const data = {
      messaging_product: 'whatsapp',
      to: to,
      type: 'template',
      template: {
        name: 'actualizacion_estado_producto', // Your template name
        language: {
          code: 'es_MX' // Language code for Spanish (Mexico)
        },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: parameters[0] }, // Corresponds to {{1}}
              { type: 'text', text: parameters[1] }, // Corresponds to {{2}}
              { type: 'text', text: parameters[2] }, // Corresponds to {{3}}
            ]
          }
        ]
      }
    };

    // 4. Send the request to the WhatsApp API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    // 5. Handle the response from the WhatsApp API
    if (!response.ok) {
      console.error('WhatsApp API Error:', responseData);
      return NextResponse.json({
        message: 'Error sending template message',
        error: responseData,
      }, { status: response.status });
    }

    // 6. Send a success response back to your frontend
    return NextResponse.json({ 
      message: 'Template message sent successfully!', 
      data: responseData 
    });

  } catch (error) {
    console.error('Internal Server Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Internal Server Error', error: errorMessage }, { status: 500 });
  }
}