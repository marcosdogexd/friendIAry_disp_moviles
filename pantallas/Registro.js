import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { auth } from "../firebase"; // Asegúrate de que firebase.js esté configurado
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

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

        // Actualiza el perfil del usuario con el nombre ingresado
        updateProfile(user, { displayName: name })
          .then(() => {
            Alert.alert("Registro exitoso", `Bienvenido, ${user.displayName}`);
            navigation.navigate("Login"); // Redirige a la pantalla de login
          })
          .catch((error) => {
            console.error("Error al actualizar el perfil:", error);
            Alert.alert("Error", "No se pudo guardar el nombre de usuario.");
          });
      })
      .catch((error) => {
        console.error("Error al registrar:", error);
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
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
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
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.linkText}>¿Ya tienes una cuenta? Inicia sesión</Text>
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