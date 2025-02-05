import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import axios from "axios"; // Para hacer llamadas a OpenAI
import styles from "../styles/HistorialNotasEstilos";

// Clave API de OpenAI (guárdala en .env y accede con process.env.OPENAI_API_KEY)
OPENAI_API_KEY = "AQUI_TU_API"; 

export default function HistorialNotas() {
  const navigation = useNavigation();
  const [modoLista, setModoLista] = useState(true);
  const [notas, setNotas] = useState([]);
  const [notaSeleccionada, setNotaSeleccionada] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [analisis, setAnalisis] = useState({});
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarNotas();
  }, []);

  // 🔹 Carga las notas del usuario autenticado desde Firestore
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

  // 🔍 Analiza el sentimiento de cada nota usando ChatGPT
  const analizarNotas = async (notas) => {
    let resultados = {};
    for (const nota of notas) {
      const sentimiento = await analizarSentimiento(nota.contenido);
      resultados[nota.id] = sentimiento;
    }
    setAnalisis(resultados);
  };

  // 📊 Llamada a la API de OpenAI para el análisis de sentimientos
  const analizarSentimiento = async (texto) => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [{ role: "user", content: `Analiza el sentimiento de este texto y dime si es positivo, neutro o negativo: ${texto}` }],
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

  // 📊 Calcula el estado de ánimo general
  const calcularEstadoAnimo = () => {
    const valores = Object.values(analisis);
    const positivos = valores.filter((v) => v.includes("positivo")).length;
    const negativos = valores.filter((v) => v.includes("negativo")).length;

    if (positivos > negativos) return "😊 Positivo";
    if (negativos > positivos) return "😢 Negativo";
    return "😐 Neutro";
  };

  const toggleModo = () => {
    setModoLista(!modoLista);
  };

  const abrirNota = (nota) => {
    setNotaSeleccionada(nota);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* 🔙 Botón de regreso */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <FontAwesome name="arrow-left" size={20} color="#000" />
        <Text style={styles.backText}>Mis notas</Text>
      </TouchableOpacity>

      {/* 📌 Título */}
      <Text style={styles.title}>Notas creadas</Text>

      {/* 🔄 Botón de Cambiar Modo */}
      <View style={styles.headerContainer}>
        <FontAwesome name="book" size={20} color="#F2994A" />
        <TouchableOpacity style={styles.changeModeButton} onPress={toggleModo}>
          <Text style={styles.buttonText}>Cambiar modo</Text>
        </TouchableOpacity>
      </View>

      {/* 📊 Estado de ánimo general */}
      <Text style={styles.estadoAnimo}>
        Estado de Ánimo General: {calcularEstadoAnimo()}
      </Text>

      <View style={styles.separator} />

      {/* 📝 Lista de Notas */}
      {cargando ? (
        <ActivityIndicator size="large" color="#F2994A" />
      ) : modoLista ? (
        <FlatList
          data={notas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => abrirNota(item)}>
              <View style={styles.noteItem}>
                <View style={styles.noteContentContainer}>
                  <Text style={styles.noteTitle}>{item.titulo}</Text>
                  <Text style={styles.noteDescription} numberOfLines={1} ellipsizeMode="tail">
                    {item.contenido}
                  </Text>
                  <Text style={styles.sentimiento}>
                    Sentimiento: {analisis[item.id] || "Analizando..."}
                  </Text>
                </View>
                <Image source={require("../assets/nota_icono.png")} style={styles.noteIcon} />
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.modeText}>Modo cuaderno aún no implementado</Text>
      )}

      {/* 🗂️ Modal para ver nota completa */}
      <Modal animationType="fade" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{notaSeleccionada?.titulo}</Text>
            <Text style={styles.modalDate}>
              {new Date(notaSeleccionada?.timestamp?.seconds * 1000).toLocaleString()}
            </Text>

            <View style={styles.modalContentContainer}>
              <ScrollView style={styles.modalScrollView}>
                <Text style={styles.modalContent}>{notaSeleccionada?.contenido}</Text>
                <Text style={styles.modalSentimiento}>
                  Sentimiento: {analisis[notaSeleccionada?.id] || "Analizando..."}
                </Text>
              </ScrollView>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
