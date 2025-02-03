import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import { auth } from "../firebase";

export default function Menu() {
  const [userName, setUserName] = useState("");
  const scaleAnimMic = new Animated.Value(1);
  const scaleAnimWrite = new Animated.Value(1);

  useEffect(() => {
    const fetchUserName = () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUserName(currentUser.displayName || "Usuario");
      }
    };
    fetchUserName();
  }, []);

  // Animaciones de escala al presionar
  const animatePressIn = (animValue) => {
    Animated.spring(animValue, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const animatePressOut = (animValue) => {
    Animated.spring(animValue, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a tu Diario</Text>

      {/* Contenedor de portada y usuario */}
      <View style={styles.coverContainer}>
        <Image source={require("../assets/portada.png")} style={styles.coverImage} />
        <View style={styles.userIconWrapper}>
          <Image source={require("../assets/usuario.png")} style={styles.userIcon} />
        </View>
      </View>

      {/* Texto de saludo */}
      <Text style={styles.greeting}>Hola {userName.toUpperCase()}, cuéntame sobre tu día</Text>

      {/* Botón de micrófono */}
      <Animated.View style={[styles.micButton, { transform: [{ scale: scaleAnimMic }] }]}>
        <TouchableOpacity
          onPress={() => console.log("Grabar Audio")}
          onPressIn={() => animatePressIn(scaleAnimMic)}
          onPressOut={() => animatePressOut(scaleAnimMic)}
        >
          <Image source={require("../assets/microfono.png")} style={styles.micIcon} />
        </TouchableOpacity>
      </Animated.View>

      {/* Botón de escribir */}
      <Animated.View style={[styles.writeButton, { transform: [{ scale: scaleAnimWrite }] }]}>
        <TouchableOpacity
          onPress={() => console.log("Escribir Nota")}
          onPressIn={() => animatePressIn(scaleAnimWrite)}
          onPressOut={() => animatePressOut(scaleAnimWrite)}
        >
          <Image source={require("../assets/texto.png")} style={styles.writeIcon} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 1, // Bajado un poco
    marginTop: 45, // Subido un poco
    color: "#000000",
  },
  coverContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 20, // Bajado un poco
  },
  coverImage: {
    width: "90%",
    height: 200, // Aumentado un poco para dar más espacio
    resizeMode: "contain",
  },
  userIconWrapper: {
    position: "absolute",
    bottom: -40, // Posiciona sobre la portada, más abajo
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#D5A6A6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  userIcon: {
    width: 60,
    height: 60,
  },
  greeting: {
    fontSize: 18,
    textAlign: "center",
    color: "#5D3A3A",
    marginTop: 70, // Bajado más
    marginBottom: 50, // Más espacio con los botones
    fontWeight: "500",
  },
  micButton: {
    width: 90,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 45,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 30, // Bajado un poco más
  },
  micIcon: {
    width: 55,
    height: 55,
  },
  writeButton: {
    width: 90,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 45,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 10, // Espaciado mejorado
  },
  writeIcon: {
    width: 50,
    height: 50,
  },
});