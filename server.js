const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

// Asegúrate de que la ruta sea '/crear-parte' (para que coincida con tu Roblox) o cámbiala en Roblox
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
                    { role: 'system', content: 'Eres un asistente útil en Roblox.' },
                    { role: 'user', content: userPrompt }
                ],
                max_tokens: 250
            })
        });

        const data = await response.json();

        if (data.choices && data.choices.length > 0) {
            const aiReply = data.choices[0].message.content;
            res.json({ reply: aiReply });
        } else {
            res.status(500).json({ error: 'Error en OpenAI', details: data });
        }

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error en el servidor proxy' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
