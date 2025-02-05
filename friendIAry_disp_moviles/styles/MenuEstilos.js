import { StyleSheet } from "react-native";

export default StyleSheet.create({
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
      borderColor: "#FF8C42",
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