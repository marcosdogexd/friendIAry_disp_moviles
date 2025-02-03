import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import styles from "../styles/HistorialNotasEstilos";

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
