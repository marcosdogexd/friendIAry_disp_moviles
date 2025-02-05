import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { auth } from "../firebase";


export default function Menu({navigation}) {
  
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserName = () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUserName(currentUser.displayName || "Usuario");
      }
    };

    fetchUserName();
  }, []);

  return (
    <View style={styles.container}>
      {/* Título arriba */}
      <Text style={styles.title}>Bienvenido a tu Diario</Text>

      {/* Contenedor de portada y usuario */}
      <View style={styles.coverContainer}>
        <Image
          source={require("../assets/portada.png")}
          style={styles.coverImage}
        />
        {/* Imagen del usuario */}
        <View style={styles.userIconWrapper}>
          <Image
            source={require("../assets/usuario.png")}
            style={styles.userIcon}
          />
        </View>
      </View>

      {/* Texto de saludo */}
      <Text style={styles.greeting}>
        Hola {userName.toUpperCase()}, cuéntame sobre tu día
      </Text>

      {/* Botón de micrófono */}
      <TouchableOpacity style={styles.micButton}>
        <Image
          source={require("../assets/microfono.png")}
          style={styles.micIcon}
        />
      </TouchableOpacity>

      {/* Botón de escribir */}
      <TouchableOpacity style={styles.writeButton} onPress={() => navigation.navigate("Diario")}>
        <Image
          source={require("../assets/texto.png")}
          style={styles.writeIcon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f8d1c4",
  },
  title: {
    fontSize: 24,
    color: "#333",
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
  },
  coverContainer: {
    width: "100%",
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  coverImage: {
    width: "90%",
    height: "100%",
    resizeMode: "contain",
  },
  userIconWrapper: {
    position: "absolute",
    top: "45%", // Centra la imagen en el medio de la portada
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  userIcon: {
    width: 50,
    height: 50,
    tintColor: "#000",
  },
  greeting: {
    fontSize: 18,
    textAlign: "center",
    color: "#333",
    marginTop: 20,
    marginBottom: 40,
  },
  micButton: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
    marginBottom: 20,
  },
  micIcon: {
    width: 50,
    height: 50,
  },
  writeButton: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
  },
  writeIcon: {
    width: 40,
    height: 40,
  },
});