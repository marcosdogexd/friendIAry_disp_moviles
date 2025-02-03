import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

export default function HistorialNotas() {
  const navigation = useNavigation();
  const [modoLista, setModoLista] = useState(true);

  const notas = [
    { id: "1", titulo: "Nota 1", descripcion: "Aquí va la descripción de la nota" },
    { id: "2", titulo: "Nota 2", descripcion: "Aquí va la descripción de la nota" },
    { id: "3", titulo: "Nota 3", descripcion: "Aquí va la descripción de la nota" },
  ];

  const toggleModo = () => {
    setModoLista(!modoLista);
  };

  return (
    <View style={styles.container}>
      {/* Botón de regreso */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <FontAwesome name="arrow-left" size={20} color="#000" />
        <Text style={styles.backText}>Mis notas</Text>
      </TouchableOpacity>

      {/* Título */}
      <Text style={styles.title}>Notas creadas</Text>

      {/* Botón de Cambiar Modo */}
      <View style={styles.headerContainer}>
        <FontAwesome name="book" size={20} color="#F2994A" />
        <TouchableOpacity style={styles.changeModeButton} onPress={toggleModo}>
          <Text style={styles.buttonText}>Cambiar modo</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.separator} />
      
      {/* Lista de Notas */}
      {modoLista ? (
        <FlatList
          data={notas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.noteItem}>
              <View>
                <Text style={styles.noteTitle}>{item.titulo}</Text>
                <Text style={styles.noteDescription}>{item.descripcion}</Text>
              </View>
              <Image source={require("../assets/nota_icono.png")} style={styles.noteIcon} />
            </View>
          )}
        />
      ) : (
        <Text style={styles.modeText}>Modo cuaderno aún no implementado</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 60,
  },
  backText: {
    fontSize: 18,
    marginLeft: 5,
    fontWeight: "bold",

  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  changeModeButton: {
    backgroundColor: "#F2994A",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginLeft: 8,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  separator: {
    height: 2,
    backgroundColor: "#F2994A",
    marginVertical: 10,
  },
  noteItem: {
    flexDirection: "row",
    backgroundColor: "#F6F6F6",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  noteDescription: {
    fontSize: 14,
    color: "#888",
  },
  noteIcon: {
    width: 40,
    height: 40,
  },
  modeText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  },
});