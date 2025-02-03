import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import { auth } from "../firebase";
import  styles  from "../styles/MenuEstilos";

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
