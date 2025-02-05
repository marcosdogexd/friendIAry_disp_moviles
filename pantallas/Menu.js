import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
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

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Se requiere permiso para acceder a la galería");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setUserImage({ uri: result.assets[0].uri });
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Se requiere permiso para usar la cámara");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setUserImage({ uri: result.assets[0].uri });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Bienvenido a tu Diario</Text>

        <View style={styles.coverContainer}>
          <Image source={require("../assets/portada.png")} style={styles.coverImage} />
          <View style={styles.userIconWrapper}>
            <Image source={userImage} style={styles.userIcon} />
          </View>
          <TouchableOpacity style={styles.cameraButton} onPress={pickImage} onLongPress={takePhoto}>
            <Ionicons name="camera" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.greeting}>Hola {userName.toUpperCase()}, cuéntame sobre tu día</Text>

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

          

      </View>
    </View>
  );
}
