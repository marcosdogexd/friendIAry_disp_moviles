import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { useNavigation } from "@react-navigation/native";

// Mapeo de imágenes de estado anímico
const moodImages = {
  muy_feliz: require("../assets/muy_feliz.png"),
  feliz: require("../assets/feliz.png"),
  neutral: require("../assets/neutral.png"),
  triste: require("../assets/triste.png"),
  muy_triste: require("../assets/muy_triste.png"),
};

export default function Hub() {
  const [selectedMood, setSelectedMood] = useState(null);
  const navigation = useNavigation();

  // Función para autenticar con huella digital antes de acceder al historial
  const handleBiometricAuth = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      Alert.alert("Error", "Tu dispositivo no soporta autenticación biométrica.");
      return;
    }

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      Alert.alert("Error", "No hay huellas registradas en este dispositivo.");
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Autenticación requerida",
      fallbackLabel: "Usar código de acceso",
    });

    if (result.success) {
      navigation.navigate("HistorialNotas");
    } else {
      Alert.alert("Acceso denegado", "No se pudo autenticar la huella.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a tu Diario</Text>

      {/* Contenedor de emojis para estado de ánimo */}
      <View style={styles.moodContainer}>
        <Text style={styles.moodText}>Elige cómo te sientes de forma rápida</Text>
        <View style={styles.moodIcons}>
          {Object.keys(moodImages).map((mood) => (
            <TouchableOpacity key={mood} onPress={() => setSelectedMood(mood)}>
              <Image source={moodImages[mood]} style={styles.moodIcon} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Opciones principales */}
      <View style={styles.optionsContainer}>
        {/* Bloque para detallar notas */}
        <TouchableOpacity style={styles.optionBlock} onPress={() => navigation.navigate("Menu")}>
          <Text style={styles.optionText}>📖 Detalla lo que has hecho en tu día</Text>
          <Image source={require("../assets/escribir.png")} style={styles.optionImage} />
        </TouchableOpacity>

        {/* Bloque para historial de notas con autenticación biométrica */}
        <TouchableOpacity style={styles.optionBlock} onPress={handleBiometricAuth}>
          <Text style={styles.optionText}>📜 Historial de tus notas</Text>
          <Image source={require("../assets/notas.png")} style={styles.optionImage} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center", // Centra todo el contenido verticalmente
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30, // Más separación del título
    color: "#333",
  },
  moodContainer: {
    backgroundColor: "#EAEAEA",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    width: "100%",
    marginBottom: 40, // Mayor espacio
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moodText: {
    fontSize: 16,
    marginBottom: 15, // Más espacio
    fontWeight: "500",
  },
  moodIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  moodIcon: {
    width: 50,
    height: 50,
  },
  optionsContainer: {
    width: "100%",
    alignItems: "center",
  },
  optionBlock: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20, // Más padding para que sea cómodo
    width: "100%",
    marginBottom: 20, // Mayor separación entre los bloques
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  optionImage: {
    width: 50,
    height: 50,
  },
});