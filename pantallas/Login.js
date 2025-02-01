import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { auth } from "../firebase"; // Importa la configuración de Firebase
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        Alert.alert("Inicio de sesión exitoso", `Bienvenido, ${user.email}`);
        // Navega a la pantalla de Menu
        navigation.navigate("Menu");
      })
      .catch((error) => {
        console.error("Error al iniciar sesión:", error);
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
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesiónnn</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónicoo"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Registro")}>
        <Text style={styles.linkText}>
          ¿No tienes una cuenta? Regístrate aquí
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8d1c4",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    width: "80%",
    padding: 15,
    borderRadius: 5,
    backgroundColor: "#ff784f",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  linkText: {
    marginTop: 15,
    color: "#007BFF",
  },
});