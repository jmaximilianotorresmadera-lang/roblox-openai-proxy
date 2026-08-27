const express = require('express');
const fetch = require('node-fetch'); // O usa global.fetch dependiendo de tu versión de Node
const app = express();

app.use(express.json());

app.post('/crear-parte', async (req, res) => {
    const userPrompt = req.body.prompt;

    if (!userPrompt) {
        return res.status(400).json({ error: 'Falta el prompt' });
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { 
                        role: 'system', 
                        content: 'Eres un asistente de IA útil integrado en un juego de Roblox. Responde de forma clara, directa y concisa a lo que el usuario te pida.' 
                    },
                    { 
                        role: 'user', 
                        content: userPrompt 
                    }
                ],
                max_tokens: 300
            })
        });

        const data = await response.json();

        if (data.choices && data.choices.length > 0) {
            const aiReply = data.choices[0].message.content;
            // Enviamos la respuesta estructurada que espera el script de Roblox
            res.json({ reply: aiReply });
        } else {
            res.status(500).json({ error: 'No se pudo obtener respuesta de OpenAI', details: data });
        }

    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ error: 'Error interno del servidor proxy' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor proxy corriendo en el puerto ${PORT}`);
});
