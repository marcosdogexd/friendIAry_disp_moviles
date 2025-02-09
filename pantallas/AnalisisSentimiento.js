import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import styles from "../styles/MensajesEstilos"; // Usa tus estilos

export default function AnalisisSentimiento() {
  const navigation = useNavigation();
  const route = useRoute();
  const { analisis } = route.params || {}; // Evita errores si no hay datos

  // Verifica que se recibió correctamente el análisis
  console.log("Análisis recibido:", analisis);

  // Verifica que 'analisis' tiene las propiedades 'label' y 'score'
  if (!analisis || typeof analisis !== 'object' || !analisis.label || !analisis.score) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Análisis de Sentimiento</Text>
        <Text style={styles.textoAnalisis}>No se pudo obtener el análisis.</Text>
      </View>
    );
  }

  // Mapeo de emociones con emojis y colores
  const emociones = {
    "alegría": { emoji: "😃", color: "green" },
    "tristeza": { emoji: "😢", color: "blue" },
    "ira": { emoji: "😡", color: "red" },
    "asco": { emoji: "🤢", color: "purple" },
    "miedo": { emoji: "😨", color: "gray" },
    "sorpresa": { emoji: "😲", color: "orange" },
  };

  // Usamos un valor predeterminado si no hay coincidencia
  const emocion = emociones[analisis.label.toLowerCase()] || { emoji: "❓", color: "black" };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>← Volver</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Análisis de Sentimiento</Text>

      <View style={[styles.cardAnalisis, { borderColor: emocion.color }]}>
        <Text style={styles.label}>Resultado:</Text>
        <Text style={[styles.textoAnalisis, { color: emocion.color }]}>
          {emocion.emoji} {analisis.label.toUpperCase()}
        </Text>

        <Text style={styles.label}>Puntuación:</Text>
        <Text style={styles.textoAnalisis}>{analisis.score.toFixed(2)}</Text>
      </View>
    </View>
  );
}
