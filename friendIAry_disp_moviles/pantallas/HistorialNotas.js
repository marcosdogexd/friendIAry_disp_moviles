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
import axios from "axios";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import styles from "../styles/HistorialNotasEstilos";

const OPENAI_API_KEY = "AQUI_TU_API";
export default function HistorialNotas() {
  const navigation = useNavigation();
  const [notas, setNotas] = useState([]);
  const [notaSeleccionada, setNotaSeleccionada] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
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
      const notasCargadas = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const contenido = doc.data().contenido;
          const analisis = await analizarSentimiento(contenido);
          return { id: doc.id, ...doc.data(), ...analisis };
        })
      );

      setNotas(notasCargadas);
    } catch (error) {
      console.error("Error al cargar notas:", error);
    } finally {
      setCargando(false);
    }
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
              content: `Analiza el siguiente texto y proporciona un resultado en JSON con estas claves: 
              - "emocion": El estado de ánimo principal (feliz, triste, enojado, asustado, neutro).
              - "intensidad": Nivel de intensidad de la emoción (leve, moderado, intenso).
              - "razon": Breve explicación de por qué se detectó esa emoción. 

              Responde solo con JSON válido, sin texto adicional. 

              Texto: ${texto}`,
            },
          ],
          max_tokens: 200,
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const jsonResponse = JSON.parse(response.data.choices[0].message.content);
      return jsonResponse;
    } catch (error) {
      console.error("Error en el análisis de sentimientos:", error);
      return {
        emocion: "desconocido",
        intensidad: "desconocido",
        razon: "No se pudo analizar el sentimiento.",
      };
    }
  };

  const obtenerEmojiSentimiento = (emocion) => {
    switch (emocion) {
      case "feliz":
        return "😊";
      case "triste":
        return "😢";
      case "enojado":
        return "😡";
      case "asustado":
        return "😨";
      case "neutro":
        return "😐";
      default:
        return "❓";
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <FontAwesome name="arrow-left" size={20} color="#000" />
        <Text style={styles.backText}>Mis notas</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Notas creadas</Text>

      <TouchableOpacity style={styles.analysisButton} onPress={() => navigation.navigate("AnalisisSentimientos")}>
        <Text style={styles.analysisButtonText}>📊 Tus Sentimientos a través del tiempo</Text>
      </TouchableOpacity>

      <View style={styles.separator} />

      {cargando ? (
        <ActivityIndicator size="large" color="#F2994A" />
      ) : (
        <FlatList
          data={notas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setNotaSeleccionada(item) || setModalVisible(true)}>
              <View style={styles.noteItem}>
                <View style={styles.noteContentContainer}>
                  <Text style={styles.noteTitle}>{item.titulo}</Text>
                  <Text style={styles.noteDescription} numberOfLines={1} ellipsizeMode="tail">
                    {item.contenido}
                  </Text>
                </View>
                <Text style={styles.emoji}>{obtenerEmojiSentimiento(item.emocion)}</Text>
                <Image source={require("../assets/nota_icono.png")} style={styles.noteIcon} />
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <Modal animationType="fade" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{notaSeleccionada?.titulo}</Text>
            <Text style={styles.modalDate}>
              {new Date(notaSeleccionada?.timestamp?.seconds * 1000).toLocaleString()}
            </Text>
            <Text style={styles.modalSentiment}>
              Estado de ánimo: {obtenerEmojiSentimiento(notaSeleccionada?.emocion)} {notaSeleccionada?.emocion}
            </Text>
            <Text style={styles.modalIntensity}>
              Intensidad: {notaSeleccionada?.intensidad}
            </Text>
            <Text style={styles.modalReason}>
              📌 Razón: {notaSeleccionada?.razon}
            </Text>

            <View style={styles.modalContentContainer}>
              <ScrollView style={styles.modalScrollView}>
                <Text style={styles.modalContent}>{notaSeleccionada?.contenido}</Text>
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
