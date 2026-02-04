export default {
    async fetch(request, env) {
        // Handle CORS preflight requests
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            });
        }

        // Only allow POST requests
        if (request.method !== 'POST') {
            return new Response('Method not allowed', {
                status: 405,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        try {
            // Parse the incoming request
            const body = await request.json();
            const {
                messages,
                model = 'llama-3.3-70b-versatile',
                temperature = 0.7,
                max_tokens = 1024
            } = body;

            // Validate messages
            if (!messages || !Array.isArray(messages)) {
                return new Response(JSON.stringify({ error: 'Invalid messages format' }), {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                });
            }

            // System message for Cores Assist context
            const systemMessage = {
                role: 'system',
                content: `You are Cores Assist AI, a helpful customer support assistant for Cores Assist.
        
Your capabilities:
- Answer questions about services (Live Chat, Email Management, Voice Support)
- Explain pricing plans (Starter: $49/mo, Professional: $149/mo, Enterprise: Custom)
- Provide contact info (hello@coresassist.com, +1 (555) 123-4567)

Be friendly, professional, and concise. Keep responses under 150 words unless more detail is requested.`
            };

            // Prepare messages for Groq
            const groqMessages = [systemMessage, ...messages];

            // Call Groq API
            const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${env.GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: model,
                    messages: groqMessages,
                    temperature: temperature,
                    max_tokens: max_tokens,
                    top_p: 1,
                    stream: false
                })
            });

            // Check for errors from Groq
            if (!groqResponse.ok) {
                const errorText = await groqResponse.text();
                console.error('Groq API Error:', errorText);
                return new Response(JSON.stringify({
                    error: 'Groq API error',
                    details: errorText
                }), {
                    status: groqResponse.status,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                });
            }

            // Return successful response
            const data = await groqResponse.json();

            return new Response(JSON.stringify(data), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });

        } catch (error) {
            console.error('Worker Error:', error);
            return new Response(JSON.stringify({
                error: 'Internal server error',
                message: error.message
            }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }
    }
};