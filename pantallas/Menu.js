import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; 
import styles from "../styles/MenuEstilos";
import { auth } from "../firebase";

export default function Menu() {
  const [userName, setUserName] = useState("");
  const navigation = useNavigation();
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

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Bienvenido a tu Diario</Text>

      <View style={styles.coverContainer}>
        <Image source={require("../assets/portada2.png")} style={styles.coverImage} />
        <View style={styles.userIconWrapper}>
          <Image source={require("../assets/usuario.png")} style={styles.userIcon} />
        </View>
      </View>

      <Text style={styles.greeting}>Hola {userName.toUpperCase()}, cuéntame sobre tu día</Text>

      {/* Botón de escribir */}
      <Animated.View style={[styles.writeButton, { transform: [{ scale: scaleAnimWrite }] }]}>
        <TouchableOpacity onPress={() => navigation.navigate("Mensajes")}>
          <Image source={require("../assets/texto.png")} style={styles.writeIcon} />
        </TouchableOpacity>
      </Animated.View> 
    </View>
  );
}