import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FontAwesome } from "@expo/vector-icons";
import { BarChart } from "react-native-chart-kit";
import styles from "../styles/EstadisticasEstilos";

const moodIcons = {
  muy_feliz: "😃",
  feliz: "🙂",
  neutral: "😐",
  triste: "😟",
  muy_triste: "😢",
};

export default function Estadisticas({ navigation }) {
  const [notas, setNotas] = useState([]);
  const [estadoMasFrecuente, setEstadoMasFrecuente] = useState(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);
  const [notasFiltradas, setNotasFiltradas] = useState([]);

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

      const notasCargadas = querySnapshot.docs.map((doc) => doc.data());
      setNotas(notasCargadas);

      // Calcular estado de ánimo más frecuente
      const frecuencia = {};
      notasCargadas.forEach((nota) => {
        if (nota.sentimiento) {
          frecuencia[nota.sentimiento] = (frecuencia[nota.sentimiento] || 0) + 1;
        }
      });

      const estadoFrecuente = Object.keys(frecuencia).reduce((a, b) =>
        frecuencia[a] > frecuencia[b] ? a : b
      , null);

      setEstadoMasFrecuente(estadoFrecuente);
    } catch (error) {
      console.error("Error al cargar notas:", error);
    }
  };

  // Filtrar notas por emoji seleccionado
  const filtrarPorEmoji = (emoji) => {
    setEstadoSeleccionado(emoji);
    const notasFiltradas = notas.filter((nota) => nota.sentimiento === emoji);
    setNotasFiltradas(notasFiltradas);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Botón Volver alineado a la izquierda */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <FontAwesome name="arrow-left" size={20} color="#000" />
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>

      {/* Título centrado */}
      <Text style={styles.title}>Tu Análisis</Text>

      {/* Resumen de estado de ánimo */}
      <Text style={styles.summary}>
        En general, has tenido días {estadoMasFrecuente ? `${moodIcons[estadoMasFrecuente]} ${estadoMasFrecuente}` : "normales"}.
      </Text>

      {/* Filtro por emoji */}
      <View style={styles.filterContainer}>
        {Object.keys(moodIcons).map((estado) => (
          <TouchableOpacity key={estado} onPress={() => filtrarPorEmoji(estado)} style={styles.emojiButton}>
            <Text style={styles.emoji}>{moodIcons[estado]}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista de notas filtradas */}
      {estadoSeleccionado && (
        <View style={styles.filteredNotesContainer}>
          <Text style={styles.filteredTitle}>Notas con estado "{moodIcons[estadoSeleccionado]}"</Text>
          <FlatList
            data={notasFiltradas}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.noteItem}>
                <Text style={styles.noteTitle}>{item.titulo}</Text>
                <Text style={styles.noteDescription}>{item.contenido}</Text>
              </View>
            )}
          />
        </View>
      )}

      {/* Gráfica de estados de ánimo */}
      <Text style={styles.chartTitle}>Distribución de estados de ánimo</Text>
      <BarChart
        data={{
          labels: Object.values(moodIcons),
          datasets: [{ data: Object.keys(moodIcons).map((estado) => notas.filter((nota) => nota.sentimiento === estado).length) }],
        }}
        width={320}
        height={200}
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          color: () => "#FF8C42",
        }}
      />
    </ScrollView>
  );
}