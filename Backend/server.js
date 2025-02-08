app.post("/analizar", async (req, res) => {
  const { contenido } = req.body;

  if (!contenido) {
    return res.status(400).json({ error: "El contenido no puede estar vacío" });
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",  // Asegúrate de que el modelo sea correcto
        response_format: "json", 
        messages: [
          {
            role: "system",
            content: "Eres un asistente que analiza sentimientos en textos. Devuelve solo un JSON sin explicaciones."
          },
          {
            role: "user",
            content: `Analiza el siguiente texto y devuelve un JSON con el análisis de sentimientos.  
            Debes detectar las emociones **Ira, Tristeza, Miedo, Alegría, Asco y Sorpresa**, asignarles un porcentaje de intensidad y agregar su emoji correspondiente.  

            Texto: "${contenido}"

            Devuelve el JSON con esta estructura exacta:

            {
              "sentiment_analysis": {
                "text": "<Texto analizado>",
                "emotions": [
                  {
                    "name": "<Nombre de la emoción>",
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
        headers: { Authorization: `Bearer ${OPENAI_API_KEY}` }
      }
    );

    let resultado = response.data.choices[0].message.content;

    try {
      // Intentar parsear la respuesta de OpenAI como JSON
      const analisis = JSON.parse(resultado);
      res.json({ analisis });
    } catch (jsonError) {
      console.error("Error al parsear el JSON de OpenAI:", jsonError);
      res.status(500).json({ error: "Error al procesar el análisis de sentimiento" });
    }

  } catch (error) {
    console.error("Error al analizar el sentimiento:", error);
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
});