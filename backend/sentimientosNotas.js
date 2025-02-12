import axios from "axios";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { OPENAI_API_KEY } from "@env"; // Clave almacenada en .env

// Mapeo de sentimientos a emojis
const sentimientoAEmoji = {
  "muy_feliz": "😃",
  "feliz": "🙂",
  "neutral": "😐",
  "triste": "😟",
  "muy_triste": "😢",
  
};

/**
 * **Detecta el sentimiento de una nota y lo guarda en Firebase**
 * - Solo analiza si la nota **no tiene sentimiento guardado**.
 */
export const analizarYGuardarSentimiento = async (notaId, texto) => {
  try {
    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const notaRef = doc(db, "notas", user.displayName, "mis_notas", notaId);
    const notaSnap = await getDoc(notaRef);

    if (notaSnap.exists() && notaSnap.data().sentimiento) {
      console.log("Sentimiento ya guardado:", notaSnap.data().sentimiento);
      return;
    }

    console.log("Enviando texto a GPT para análisis de sentimiento...");

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Eres un diario emocional que analiza sentimientos en textos personales.  
            **Clasifica el siguiente texto en una de estas categorías exactas**:  

            - **muy_feliz**: Si el usuario expresa una felicidad intensa o logro personal.  
            - **feliz**: Si el usuario muestra alegría moderada o satisfacción.  
            - **neutral**: Si el usuario solo describe su día sin emociones claras.  
            - **triste**: Si el usuario expresa tristeza, frustración o algo negativo.  
            - **muy_triste**: Si el usuario expresa dolor emocional fuerte o desesperanza.  

            **IMPORTANTE:**  
            - Devuelve solo una palabra exacta: muy_feliz, feliz, neutral, triste, muy_triste.  
            - No agregues explicaciones, solo responde con una palabra. 
            `,
          },
          { role: "user", content: texto },
        ],
        max_tokens: 5,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let sentimiento = response.data.choices[0].message.content.trim().toLowerCase();
    if (!sentimientoAEmoji[sentimiento]) sentimiento = "neutral"; // Si no es válido, asigna neutral

    //  Guarda el sentimiento en Firebase
    await updateDoc(notaRef, { sentimiento });

    console.log(" Sentimiento guardado:", sentimiento);
  } catch (error) {
    console.error(" Error al analizar sentimiento:", error);
  }
};

/**
 * **Genera un mensaje empático según el sentimiento y lo guarda en Firebase**
 * - Solo se genera si el mensaje **no está ya guardado**.
 */
export const generarYGuardarMensajeEmpatico = async (notaId, texto, sentimiento) => {
  try {
    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const notaRef = doc(db, "notas", user.displayName, "mis_notas", notaId);
    const notaSnap = await getDoc(notaRef);

    if (notaSnap.exists() && notaSnap.data().mensajeEmpatico) {
      console.log("Mensaje empático ya guardado:", notaSnap.data().mensajeEmpatico);
      return;
    }

    //console.log("Enviando texto a GPT para generar mensaje empático...");

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Eres un diario personal que responde de forma empática según el estado emocional del usuario.  
            Genera un mensaje corto (máximo 2 líneas) según la emoción detectada.  

            **Ejemplo de Respuestas:**  
            - "¡Hoy fue el mejor día de mi vida!" → "¡Eso es genial! Me encanta verte feliz. 😊"  
            - "Hoy fue un día normal" → "Espero que haya momentos bonitos en tu día. 🌼"  
            - "No me siento bien hoy" → "Lo siento mucho, recuerda que cada día trae una nueva oportunidad. 🌟"  
            - "No quiero seguir, todo es difícil" → "Lamento mucho que te sientas así. No estás solo, busca apoyo en alguien de confianza. 💙"  

            **IMPORTANTE:**  
            - Responde en máximo 2 líneas.  
            - Evita respuestas genéricas, asegúrate de ser empático.  
            `,
          },
          { role: "user", content: `Texto: ${texto}\nSentimiento: ${sentimiento}` },
        ],
        max_tokens: 50,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const mensaje = response.data.choices[0].message.content.trim();

    // Guarda el mensaje en Firebase
    await updateDoc(notaRef, { mensajeEmpatico: mensaje });

    //console.log(" Mensaje empático guardado:", mensaje);
  } catch (error) {
    console.error(" Error al generar mensaje empático:", error);
  }
};