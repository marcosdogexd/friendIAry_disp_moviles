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
import { signInWithEmailAndPassword } from "firebase/auth";
import styles from "../styles/LoginEstilos";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        Alert.alert("Inicio de sesión exitoso", `Bienvenido, ${user.email}`);
        navigation.navigate("Hub");
      })
      .catch((error) => {
        if (error.code === "auth/user-not-found") {
          Alert.alert("Error", "Usuario no encontrado. Regístrate primero.");
        } else if (error.code === "auth/wrong-password") {
          Alert.alert("Error", "Contraseña incorrecta.");
        } else if (error.code === "auth/invalid-email") {
          Alert.alert("Error", "El correo electrónico no es válido.");
        } else {
          Alert.alert("Error", error.message);
        }
      });
  };

  return (
    <ImageBackground
      source={require("../assets/background.png")} //  Imagen de fondo
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Iniciar Sesión</Text>

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

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Registro")}>
          <Text style={styles.linkText}>
            ¿No tienes una cuenta? <Text style={{ color: "#FFD700" }}>Regístrate aquí</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
