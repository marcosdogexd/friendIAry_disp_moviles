require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error("Error: OPENAI_API_KEY no está definido en el archivo .env");
  process.exit(1);
}

app.use(cors());
app.use(bodyParser.json());

app.post("/analizar", async (req, res) => {
  const { contenido } = req.body;

  if (!contenido) {
    return res.status(400).json({ error: "El contenido no puede estar vacío" });
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini", // Modelo corregido
        messages: [
          {
            role: "system",
            content: "Eres un asistente que analiza sentimientos en textos. Devuelve solo un JSON sin explicaciones."
          },
          {
            role: "user",
            content: `Analiza el siguiente texto y devuelve un JSON con el análisis de sentimientos.  
            Debes detectar las emociones **Ira, Tristeza, Miedo, Alegría y Sorpresa**, el proque de manera super corta, asignarles un porcentaje de intensidad y agregar su emoji correspondiente.  

            Texto: "${contenido}"

            Devuelve el JSON con esta estructura exacta:

            {
              "sentiment_analysis": {
                "text": "<Texto analizado>",
                "emotions": [
                  {
                    "name": "<Nombre de la emoción>",
                    "razon:"<razon por la cual tiene esa emocion>",
                    "level": <Porcentaje de intensidad>,
                    "emoji": "<Emoji correspondiente>"
                  }
                ]
              }
            }`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    let resultado = response.data.choices[0].message.content;

    // Imprimir el resultado antes de limpiar
    console.log("Respuesta original de OpenAI:", resultado);

    // Limpiar el contenido para quitar los bloques de código y otros caracteres no válidos
    const cleanedResult = resultado
      .replace(/```json/g, '')       // Elimina '```json'
      .replace(/```/g, '')           // Elimina '```' al final del bloque
      .trim();                       // Elimina espacios al inicio y final

    try {
      const analisis = JSON.parse(cleanedResult);
      res.json({ analisis });
    } catch (jsonError) {
      console.error("Error al parsear el JSON de OpenAI:", jsonError);
      res.status(500).json({ error: "Error al procesar el análisis de sentimiento" });
    }
  } catch (error) {
    console.error("Error al analizar el sentimiento:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://192.168.100.149:${PORT}`);
});


//ip para el servidor
// http://192.168.31.104:3000
//  192.168.100.149