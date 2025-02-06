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
  const [analisis, setAnalisis] = useState({});
  const [estadoGeneral, setEstadoGeneral] = useState("Analizando...");
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
    let resultados = {};
    let textos = notas.map((nota) => nota.contenido).join("\n\n");

    for (const nota of notas) {
      const sentimiento = await analizarSentimiento(nota.contenido);
      resultados[nota.id] = sentimiento;
    }
    setAnalisis(resultados);
    analizarEstadoGeneral(textos);
  };

  const analizarSentimiento = async (texto) => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [{ role: "user", content: `Analiza el sentimiento de este texto: ${texto}` }],
          max_tokens: 50,
        },
        {
          headers: {
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error("Error en el análisis de sentimientos:", error);
      return "No se pudo analizar el sentimiento.";
    }
  };

  const analizarEstadoGeneral = async (textos) => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [
            {
              role: "user",
              content: `Aquí están varias notas escritas por un usuario. Analiza el estado de ánimo general basado en todas ellas y proporciona un resumen conciso en una sola frase: \n\n${textos}`,
            },
          ],
          max_tokens: 100,
        },
        {
          headers: {
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      setEstadoGeneral(response.data.choices[0].message.content);
    } catch (error) {
      console.error("Error en el análisis general del estado de ánimo:", error);
      setEstadoGeneral("No se pudo analizar el estado de ánimo general.");
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
        <View style={styles.stateContainer}>
          <Text style={styles.stateTitle}>🧠 Estado anímico general</Text>
          <Text style={styles.stateText}>{estadoGeneral}</Text>
        </View>
      )}
    </View>
  );
  
}
