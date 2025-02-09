import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { format } from "date-fns";
import styles from "../styles/MensajesEstilos"; // Importar estilos

const db = getFirestore();

export default function Mensajes() {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigation = useNavigation();

  // Función para guardar la nota en Firebase con el análisis de sentimientos
  const guardarNota = async () => {
    if (!contenido.trim()) {
      Alert.alert("Error", "No puedes guardar una nota vacía.");
      return;
    }
  
    setCargando(true);
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      setCargando(false);
      Alert.alert("Error", "No se encontró usuario autenticado.");
      return;
    }
  
    const fechaActual = format(new Date(), "yyyy-MM-dd_HH:mm");
    const tituloNota = titulo.trim() ? titulo : `Nota_${fechaActual}`;
  
    try {
      console.log("📡 Enviando solicitud al backend...");
      
      // 🔹 Fetch con timeout de 10 segundos
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
  
      const response = await fetch("http://192.168.100.149:3000/analizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contenido }),
        signal: controller.signal, // Conectar el abort controller
      });
  
      clearTimeout(timeout); // Limpiar timeout si responde antes
  
      if (!response.ok) {
        throw new Error(`Error en el servidor: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("📥 Respuesta recibida:", data);
  
      if (!data.analisis) {
        throw new Error("No se recibió análisis de sentimientos.");
      }
  
      // 🔹 Guardar en Firebase
      const userDocRef = doc(db, "notas", user.displayName);
      const notaRef = doc(collection(userDocRef, "mis_notas"), fechaActual);
  
      await setDoc(notaRef, {
        usuario: user.displayName,
        titulo: tituloNota,
        contenido,
        timestamp: new Date(),
        analisisSentimiento: data.analisis,
      });
  
      console.log("✅ Nota guardada en Firebase");
      Alert.alert("Éxito", "Tu nota ha sido guardada.");
  
      setTitulo("");
      setContenido("");
      setCargando(false);
  
      // 🔹 Navegar a la pantalla de análisis
      //navigation.navigate("AnalisisSentimiento", { analisis: data.analisis });
    } catch (error) {
      console.error("❌ Error al guardar la nota:", error);
      Alert.alert("Error", error.message || "No se pudo guardar la nota.");
      setCargando(false);
    }
  };
  
  return (
    <View style={styles.container}>
      {/* 🔙 Botón de volver */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>← Volver</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Nueva Nota</Text>

      {/* 📝 Campo para el título */}
      <TextInput
        style={styles.inputTitulo}
        placeholder="Título (opcional)"
        value={titulo}
        onChangeText={setTitulo}
      />

      {/* ✍️ Campo para el contenido */}
      <TextInput
        style={styles.inputContenido}
        placeholder="Escribe tu nota aquí..."
        multiline
        value={contenido}
        onChangeText={setContenido}
      />

      {/* ⏳ Indicador de carga */}
      {cargando && <ActivityIndicator size="large" color="#F2994A" />}

      {/* 💾 Botón de guardar */}
      <TouchableOpacity style={styles.botonGuardar} onPress={guardarNota} disabled={cargando}>
        <Text style={styles.textoBoton}>Guardar Nota</Text>
      </TouchableOpacity>
    </View>
  );
}
