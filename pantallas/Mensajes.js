import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { format } from "date-fns";
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";
import { OPENAI_API_KEY } from "@env"; // Asegúrate de tener la API Key en .env
import styles from "../styles/MensajesEstilos";

const db = getFirestore();

export default function Mensajes() {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const navigation = useNavigation();

  // Función para iniciar la grabación de audio
  const iniciarGrabacion = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso Denegado", "Necesitas habilitar el micrófono para grabar.");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await newRecording.startAsync();
      setRecording(newRecording);
      setIsRecording(true);
      console.log(" Grabando...");
    } catch (error) {
      console.error(" Error al iniciar grabación:", error);
      Alert.alert("Error", "No se pudo iniciar la grabación.");
    }
  };

  // Función para detener la grabación y enviar el audio a Whisper
  const detenerGrabacion = async () => {
    try {
      if (!recording) return;
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      console.log(" Grabación detenida. Archivo:", uri);

      if (uri) {
        procesarAudio(uri);
      }
    } catch (error) {
      console.error(" Error al detener la grabación:", error);
    }
  };

  // Función para enviar el audio a OpenAI Whisper
  const procesarAudio = async (uri) => {
    try {
      console.log(" Enviando audio a Whisper...");
      const fileBase64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const formData = new FormData();
      formData.append("file", {
        uri: uri,
        name: "audio.mp3",
        type: "audio/mpeg",
      });
      formData.append("model", "whisper-1");
      formData.append("language", "es");

      const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log("Respuesta de Whisper:", JSON.stringify(data, null, 2));

      if (data.text) {
        setContenido((prev) => prev + " " + data.text);
        console.log("Texto transcrito:", data.text);
      } else {
        console.error("No se obtuvo transcripción.");
      }
    } catch (error) {
      console.error(" Error al procesar audio:", error);
    }
  };

  // Función para guardar la nota en Firebase
  const guardarNota = async () => {
    if (!contenido.trim()) {
      Alert.alert("Error", "No puedes guardar una nota vacía.");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "No se encontró usuario autenticado.");
      return;
    }

    const fechaActual = format(new Date(), "yyyy-MM-dd_HH:mm");
    const tituloNota = titulo.trim() ? titulo : `Nota_${fechaActual}`;

    try {
      const userDocRef = doc(db, "notas", user.displayName);
      const notaRef = doc(collection(userDocRef, "mis_notas"), fechaActual);

      await setDoc(notaRef, {
        usuario: user.displayName,
        titulo: tituloNota,
        contenido,
        timestamp: new Date(),
      });

      Alert.alert("Éxito", "Tu nota ha sido guardada.");
      setTitulo("");
      setContenido("");
      navigation.goBack();
    } catch (error) {
      console.error("Error al guardar la nota:", error);
      Alert.alert("Error", "No se pudo guardar la nota.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Botón de volver */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>← Volver</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Nueva Nota</Text>

      {/* Campo para el título */}
      <TextInput
        style={styles.inputTitulo}
        placeholder="Título (opcional)"
        value={titulo}
        onChangeText={setTitulo}
      />

      {/* Campo para el contenido */}
      <TextInput
        style={styles.inputContenido}
        placeholder="Escribe tu nota aquí..."
        multiline
        value={contenido}
        onChangeText={setContenido}
      />

      {/* Botón de micrófono */}
      <TouchableOpacity
        style={[styles.micButton, { backgroundColor: isRecording ? "red" : "white" }]}
        onPress={isRecording ? detenerGrabacion : iniciarGrabacion}
      >
        <Image source={require("../assets/microfono.png")} style={styles.micIcon} />
      </TouchableOpacity>

      {/* Botón de guardar */}
      <TouchableOpacity style={styles.botonGuardar} onPress={guardarNota}>
        <Text style={styles.textoBoton}>Guardar Nota</Text>
      </TouchableOpacity>
    </View>
  );
}