import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from "react-native";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import styles from "../styles/RegistroEstilos";

export default function Registro({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Por favor, ingresa un nombre de usuario.");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        updateProfile(user, { displayName: name })
          .then(() => {
            Alert.alert("Registro exitoso", `Bienvenido, ${user.displayName}`);
            navigation.navigate("Login");
          })
          .catch(() => {
            Alert.alert("Error", "No se pudo guardar el nombre de usuario.");
          });
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          Alert.alert("Error", "El correo ya está registrado.");
        } else if (error.code === "auth/invalid-email") {
          Alert.alert("Error", "El correo electrónico no es válido.");
        } else {
          Alert.alert("Error", error.message);
        }
      });
  };

  return (
    <ImageBackground
      source={require("../assets/background.png")} // 📌 Imagen de fondo
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Registro</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre de usuario"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#ccc"
        />
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#ccc"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#ccc"
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.linkText}>
            ¿Ya tienes una cuenta? <Text style={{ color: "#FFD700" }}>Inicia sesión aquí</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
