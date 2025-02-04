import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../firebase";

export default function Menu() {
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState(require("../assets/usuario.png"));

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

        <TouchableOpacity style={styles.micButton}>
          <Image source={require("../assets/microfono.png")} style={styles.micIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.writeButton}>
          <Image source={require("../assets/texto.png")} style={styles.writeIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8d1c4",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
  },
  title: {
    fontSize: 24,
    color: "#333",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  coverContainer: {
    width: "100%",
    height: 250,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  userIconWrapper: {
    position: "absolute",
    top: "50%",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    overflow: "hidden",
  },
  userIcon: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  cameraButton: {
    position: "absolute",
    bottom: 20,
    right: 120,
    backgroundColor: "#000",
    padding: 6,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  greeting: {
    fontSize: 18,
    textAlign: "center",
    color: "#333",
    marginTop: 40,
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
