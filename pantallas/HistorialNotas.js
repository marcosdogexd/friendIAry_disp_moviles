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

export default function HistorialNotas() {
  const [viewMode, setViewMode] = useState("list"); // 'list' o 'notebook'
  const navigation = useNavigation();

  // Cambiar entre vista de lista y cuaderno
  const toggleViewMode = () => {
    setViewMode(viewMode === "list" ? "notebook" : "list");
  };

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>

        <TouchableOpacity onPress={toggleViewMode}>
          <Image source={require("../assets/cuaderno.png")} style={styles.toggleIcon} />
        </TouchableOpacity>
      </View>

      {/* Título */}
      <Text style={styles.title}>Notas creadas</Text>

      {/* Botón agregar notas */}
      <View style={styles.addNotesContainer}>
        <TouchableOpacity style={styles.addNotesButton} onPress={() => navigation.navigate("Menu")}>
          <Text style={styles.addNotesText}>Agregar Notas</Text>
        </TouchableOpacity>
        <View style={styles.line} />
      </View>

      {/* Vista de lista (Vacía por ahora) */}
      {viewMode === "list" ? (
        <View style={styles.emptyListContainer}>
          <Text style={styles.emptyListText}>Aún no hay notas creadas 📝</Text>
        </View>
      ) : (
        <View style={styles.notebookView}>
          <Text style={styles.notebookText}>📖 Vista de Cuaderno (En desarrollo)</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    color: "#333",
  },
  toggleIcon: {
    width: 30,
    height: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  addNotesContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  addNotesButton: {
    backgroundColor: "#FF8C42",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addNotesText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  line: {
    width: "100%",
    height: 2,
    backgroundColor: "#FFA07A",
    marginTop: 5,
  },
  emptyListContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyListText: {
    fontSize: 16,
    color: "#888",
    fontStyle: "italic",
  },
  notebookView: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  notebookText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
  },
});