const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/crear-parte', async (req, res) => {
    const promptUsuario = req.body.prompt;

    if (!promptUsuario) {
        return res.status(400).json({ error: "Falta el prompt" });
    }

    try {
        const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system", 
                        content: "Eres un asistente de Roblox. Responde estrictamente con un JSON plano que contenga: SizeX, SizeY, SizeZ, PosX, PosY, PosZ, ColorR, ColorG, ColorB. Sin texto extra."
                    },
                    {
                        role: "user", 
                        content: promptUsuario
                    }
                ],
                temperature: 0.7
            })
        });

        const data = await openaiResponse.json();
        const contenidoIA = data.choices[0].message.content;
        
        const jsonParte = JSON.parse(contenidoIA);
        res.json(jsonParte);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al conectar con OpenAI" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

