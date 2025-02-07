require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Ruta para analizar sentimientos
app.post("/analizar", async (req, res) => {
  const { contenido } = req.body;

  if (!contenido) {
    return res.status(400).json({ error: "El contenido no puede estar vacío" });
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Analiza el sentimiento de este texto en positivo, negativo o neutro y explica brevemente por qué y tambien ponlo en porcentaje cada sentimiento analizado en el texto." },
          { role: "user", content: contenido }
        ]
      },
      {
        headers: { Authorization: `Bearer ${OPENAI_API_KEY}` }
      }
    );

    const resultado = response.data.choices[0].message.content;
    res.json({ analisis: resultado });

  } catch (error) {
    console.error("Error al analizar el sentimiento:", error);
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://192.168.100.149:${PORT}`);
});
