import axios from "axios";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; 

export async function analizarSentimientos(texto) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4", // Puedes usar "gpt-3.5-turbo" si prefieres
        messages: [{ role: "user", content: `Analiza el sentimiento de este texto y dime si es positivo, neutro o negativo: ${texto}` }],
        max_tokens: 50
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error en el análisis de sentimientos:", error);
    return "No se pudo analizar el sentimiento.";
  }
}
