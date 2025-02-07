import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import styles from "../styles/MensajesEstilos"; // Usa tus estilos

export default function AnalisisSentimiento() {
  const navigation = useNavigation();
  const route = useRoute();
  const { analisis } = route.params;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>← Volver</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Análisis de Sentimiento</Text>
      <Text style={styles.textoAnalisis}>{analisis}</Text>
    </View>
  );
}
