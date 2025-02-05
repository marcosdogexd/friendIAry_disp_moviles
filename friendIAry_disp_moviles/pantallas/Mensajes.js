import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
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
  const navigation = useNavigation();

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

    // Generar título automático si está vacío
    const fechaActual = format(new Date(), "yyyy-MM-dd_HH:mm");
    const tituloNota = titulo.trim() ? titulo : `Nota_${fechaActual}`;

    try {
      // Ruta: notas/{nombreUsuario}/mis_notas/{notaID}
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
      navigation.goBack(); // Volver a la pantalla anterior
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

      {/* Botón de guardar */}
      <TouchableOpacity style={styles.botonGuardar} onPress={guardarNota}>
        <Text style={styles.textoBoton}>Guardar Nota</Text>
      </TouchableOpacity>
    </View>
  );
}