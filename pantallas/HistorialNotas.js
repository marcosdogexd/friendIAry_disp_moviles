import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  analizarYGuardarSentimiento,
  generarYGuardarMensajeEmpatico,
} from "../backend/sentimientosNotas";
import styles from "../styles/HistorialNotasEstilos";

// Importar las imágenes de los estados de ánimo
const moodImages = {
  muy_feliz: require("../assets/muy_feliz.png"),
  feliz: require("../assets/feliz.png"),
  neutral: require("../assets/neutral.png"),
  triste: require("../assets/triste.png"),
  muy_triste: require("../assets/muy_triste.png"),
};

export default function HistorialNotas() { 
  const navigation = useNavigation(); 
  const [notas, setNotas] = useState([]);
  const [notaSeleccionada, setNotaSeleccionada] = useState(null);
  const [modalNotaVisible, setModalNotaVisible] = useState(false);
  const [modalMensajeVisible, setModalMensajeVisible] = useState(false);
  const [mensajeModal, setMensajeModal] = useState("Cargando...");
  const [cargandoMensaje, setCargandoMensaje] = useState(false);

  useEffect(() => {
    const unsubscribe = cargarNotas();
    return () => unsubscribe(); // Limpia la suscripción al desmontar
  }, []);

  // Carga las notas en tiempo real desde Firestore
  const cargarNotas = () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return () => {};

      const db = getFirestore();
      const notasRef = collection(db, "notas", user.displayName, "mis_notas");

      // Suscripción en tiempo real
      const unsubscribe = onSnapshot(notasRef, async (querySnapshot) => {
        const notasCargadas = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setNotas(notasCargadas);

        // Analizar y guardar sentimientos si no existen
        for (const nota of notasCargadas) {
          if (!nota.sentimiento) {
            await analizarYGuardarSentimiento(nota.id, nota.contenido);
          }
          if (!nota.mensajeEmpatico) {
            await generarYGuardarMensajeEmpatico(
              nota.id,
              nota.contenido,
              nota.sentimiento
            );
          }
        }
      });

      return unsubscribe;
    } catch (error) {
      console.error("Error al cargar notas:", error);
      return () => {};
    }
  };

  const abrirNota = (nota) => {
    setNotaSeleccionada(nota);
    setModalNotaVisible(true);
  };

  // Navegar a la pantalla de estadísticas
  const irAEstadisticas = () => {
    navigation.navigate("Estadisticas");
  };

  return (
    <View style={styles.container}>
      {/* Botón de regreso */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <FontAwesome name="arrow-left" size={20} color="#000" />
        <Text style={styles.backText}>Mis notas</Text>
      </TouchableOpacity>

      {/* Título */}
      <Text style={styles.title}>Notas creadas</Text>

      {/* Botón "Tu Análisis" en lugar de "Cambiar Modo" */}
      <View style={styles.headerContainer}>
        <FontAwesome name="line-chart" size={20} color="#F2994A" />
        <TouchableOpacity style={styles.analisisButton} onPress={irAEstadisticas}>
          <Text style={styles.buttonText}>Tu análisis</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.separator} />

      {/* Lista de Notas */}
      <FlatList
        data={notas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.noteItem}>
            {/* Contenedor de la nota */}
            <TouchableOpacity
              onPress={() => abrirNota(item)}
              style={styles.noteContentContainer}
            >
              <Text style={styles.noteTitle}>{item.titulo}</Text>
              <Text style={styles.noteDescription} numberOfLines={1} ellipsizeMode="tail">
                {item.contenido}
              </Text>
            </TouchableOpacity>
            
            {/* Emoji del estado de ánimo */}
            <Image
              source={moodImages[item.sentimiento] || moodImages.neutral}
              style={styles.noteIcon} 
            />
          </View>
        )}
      />

      {/* Modal para ver nota completa */}
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
            <View style={styles.modalContentContainer}>
              <ScrollView style={styles.modalScrollView}>
                <Text style={styles.modalContent}>{notaSeleccionada?.contenido}</Text>
              </ScrollView>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalNotaVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}