import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import styles from "../styles/HistorialNotasEstilos";

// Diccionario de emojis según el sentimiento
const EMOJI_SENTIMIENTOS = {
  Miedo: "😨",
  Ira: "😡",
  Tristeza: "😢",
  Alegría: "😃",
  Asco: "🤢",
  Sorpresa: "😲",
};

export default function HistorialNotas() {
  const navigation = useNavigation();
  const [modoLista, setModoLista] = useState(true);
  const [notas, setNotas] = useState([]);
  const [notaSeleccionada, setNotaSeleccionada] = useState(null);
  const [modalNotaVisible, setModalNotaVisible] = useState(false); // Modal para la nota
  const [modalSentimientoVisible, setModalSentimientoVisible] = useState(false); // Modal para el análisis de sentimientos
  const [analisisSentimiento, setAnalisisSentimiento] = useState(null); // Estado para mostrar el análisis

  useEffect(() => {
    cargarNotas();
  }, []);

  const cargarNotas = async () => {
    try {
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
    } catch (error) {
      console.error("Error al cargar notas:", error);
    }
  };

  const toggleModo = () => {
    setModoLista(!modoLista);
  };

  const abrirNota = (nota) => {
    setNotaSeleccionada(nota);
    setModalNotaVisible(true);
    setModalSentimientoVisible(false); // Cerrar modal de sentimiento si está abierto
  };

  const abrirAnalisisSentimiento = (analisis) => {
    setAnalisisSentimiento(analisis); // Guardar el análisis seleccionado
    setModalSentimientoVisible(true);
    setModalNotaVisible(false); // Cerrar modal de nota si está abierto
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

      <View style={styles.separator} />

      {/* 📝 Lista de Notas */}
      {modoLista ? (
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
                  {/* Mostrar el análisis de sentimientos como un emoji */}
                  <TouchableOpacity onPress={() => abrirAnalisisSentimiento(item.analisisSentimiento)}>
                    <Text style={styles.noteSentiment}>
                      {item.analisisSentimiento ? "😊" : "No disponible"}
                    </Text>
                  </TouchableOpacity>
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
      <Modal
        animationType="fade"
        transparent
        visible={modalNotaVisible}
        onRequestClose={() => setModalNotaVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{notaSeleccionada?.titulo}</Text>
            <Text style={styles.modalDate}>
              {new Date(notaSeleccionada?.timestamp?.seconds * 1000).toLocaleString()}
            </Text>
            <ScrollView style={styles.modalContentContainer}>
              <Text style={styles.modalContent}>{notaSeleccionada?.contenido}</Text>
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalNotaVisible(false)}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 🗂️ Modal para ver el análisis de sentimiento */}
      <Modal
        animationType="fade"
        transparent
        visible={modalSentimientoVisible}
        onRequestClose={() => setModalSentimientoVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Análisis de Sentimiento</Text>
            {/* Muestra el emoji y la explicación del sentimiento */}
            <Text style={styles.modalEmoji}>
              {EMOJI_SENTIMIENTOS[analisisSentimiento?.emocion_principal] || "😶"}
            </Text>
            <Text style={styles.modalSentiment}>
              {analisisSentimiento?.explicacion || "No hay análisis disponible."}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalSentimientoVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

