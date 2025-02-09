import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import styles from "../styles/HistorialNotasEstilos";

const OPENAI_API_KEY = "AQUI_TU_API";
export default function AnalisisSentimientos() {
  const navigation = useNavigation();
  const [notas, setNotas] = useState([]);
  const [analisis, setAnalisis] = useState([]);
  const [estadoGeneral, setEstadoGeneral] = useState("Analizando...");
  const [fluctuaciones, setFluctuaciones] = useState("Calculando...");
  const [anomalias, setAnomalias] = useState("Analizando...");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarNotas();
  }, []);

  const cargarNotas = async () => {
    try {
      setCargando(true);
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const db = getFirestore();
      const notasRef = collection(db, "notas", user.displayName, "mis_notas");
      const querySnapshot = await getDocs(notasRef);
      const notasCargadas = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNotas(notasCargadas);
      analizarNotas(notasCargadas);
    } catch (error) {
      console.error("Error al cargar notas:", error);
    } finally {
      setCargando(false);
    }
  };

  const analizarNotas = async (notas) => {
    let resultados = [];
    let textos = notas.map((nota) => nota.contenido).join("\n\n");

    for (const nota of notas) {
      const sentimiento = await analizarSentimiento(nota.contenido);
      resultados.push({
        id: nota.id,
        emocion: sentimiento.emocion,
        intensidad: sentimiento.intensidad,
        razon: sentimiento.razon,
      });
    }

    setAnalisis(resultados);
    analizarEstadoGeneral(resultados);
    detectarFluctuaciones(resultados);
    detectarAnomalias(resultados);
  };

  const analizarSentimiento = async (texto) => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [
            {
              role: "user",
              content: `Analiza el siguiente texto y devuelve JSON con:
              - "emocion": Estado de ánimo (feliz, triste, enojado, asustado, neutro).
              - "intensidad": Intensidad (leve, moderado, intenso).
              - "razon": Breve justificación.

              Responde SOLO en JSON sin texto adicional. Texto: ${texto}`,
            },
          ],
          max_tokens: 100,
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      return JSON.parse(response.data.choices[0].message.content);
    } catch (error) {
      console.error("Error en el análisis de sentimientos:", error);
      return { emocion: "desconocido", intensidad: "desconocido", razon: "No se pudo analizar." };
    }
  };

  const analizarEstadoGeneral = async (analisis) => {
    try {
      const emociones = analisis.map((nota) => nota.emocion).join(", ");
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [
            {
              role: "user",
              content: `Basado en esta secuencia de emociones: [${emociones}].
              Proporciona un resumen de cómo ha sido la tendencia emocional general del usuario.`,
            },
          ],
          max_tokens: 100,
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      setEstadoGeneral(response.data.choices[0].message.content);
    } catch (error) {
      console.error("Error en el análisis general del estado de ánimo:", error);
      setEstadoGeneral("No se pudo analizar el estado general.");
    }
  };

  const detectarFluctuaciones = async (analisis) => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [
            {
              role: "user",
              content: `Dado el siguiente historial de emociones: [${analisis
                .map((nota) => `${nota.emocion} (${nota.intensidad})`)
                .join(", ")}].
              Describe cómo han fluctuado los estados de ánimo a lo largo del tiempo.`,
            },
          ],
          max_tokens: 100,
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      setFluctuaciones(response.data.choices[0].message.content);
    } catch (error) {
      console.error("Error en la detección de fluctuaciones:", error);
      setFluctuaciones("No se pudo calcular.");
    }
  };

  const detectarAnomalias = async (analisis) => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [
            {
              role: "user",
              content: `Analiza este historial de emociones: [${analisis
                .map((nota) => `${nota.emocion} (${nota.intensidad})`)
                .join(", ")}].
              ¿Hay cambios repentinos o patrones inusuales? Indica si hay anomalías.`,
            },
          ],
          max_tokens: 100,
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      setAnomalias(response.data.choices[0].message.content);
    } catch (error) {
      console.error("Error en la detección de anomalías:", error);
      setAnomalias("No se pudo detectar anomalías.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <FontAwesome name="arrow-left" size={20} color="#000" />
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Análisis de Sentimientos</Text>

      {cargando ? (
        <ActivityIndicator size="large" color="#F2994A" />
      ) : (
        <>
          <View style={styles.stateContainer}>
            <Text style={styles.stateTitle}>🧠 Estado anímico general</Text>
            <Text style={styles.stateText}>{estadoGeneral}</Text>
          </View>

          <View style={styles.stateContainer}>
            <Text style={styles.stateTitle}>📊 Fluctuaciones emocionales</Text>
            <Text style={styles.stateText}>{fluctuaciones}</Text>
          </View>

          <View style={styles.stateContainer}>
            <Text style={styles.stateTitle}>🚨 Anomalías detectadas</Text>
            <Text style={styles.stateText}>{anomalias}</Text>
          </View>
        </>
      )}
    </View>
  );
}
