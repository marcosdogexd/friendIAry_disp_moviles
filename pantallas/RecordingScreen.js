import React, { useState } from "react";
import { 
  View, Text, TouchableOpacity, StyleSheet, Alert, FlatList, TextInput 
} from "react-native";
import { Audio } from "expo-av";
import { useNavigation } from "@react-navigation/native";

export default function RecordingScreen() {
  const navigation = useNavigation();
  const [recording, setRecording] = useState(null);
  const [recordings, setRecordings] = useState([]); // Lista de grabaciones
  const [newName, setNewName] = useState(""); // Nombre de la nueva grabación

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso denegado", "Se requiere permiso para grabar audio.");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await newRecording.startAsync();
      
      setRecording(newRecording);
    } catch (error) {
      console.error("Error al iniciar la grabación", error);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      if (!newName.trim()) {
        Alert.alert("Error", "Debes asignar un nombre a la grabación.");
        return;
      }

      setRecordings([...recordings, { id: Date.now().toString(), uri, name: newName }]); // Guardar grabación con nombre
      setRecording(null);
      setNewName(""); // Reiniciar nombre después de guardar
    } catch (error) {
      console.error("Error al detener la grabación", error);
    }
  };

  const playRecording = async (uri) => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri });
      await sound.playAsync();
    } catch (error) {
      console.error("Error al reproducir el audio", error);
    }
  };

  const deleteRecording = (id) => {
    setRecordings(recordings.filter((rec) => rec.id !== id));
  };

  const editRecordingName = (id, newName) => {
    setRecordings(recordings.map((rec) => (rec.id === id ? { ...rec, name: newName } : rec)));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Graba tu mensaje</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre de la grabación"
        value={newName}
        onChangeText={setNewName}
      />

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: recording ? "red" : "green" }]} 
        onPress={recording ? stopRecording : startRecording}
      >
        <Text style={styles.buttonText}>
          {recording ? "Detener" : "Grabar"}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={recordings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.recordingItem}>
            <TextInput
              style={styles.nameInput}
              value={item.name}
              onChangeText={(text) => editRecordingName(item.id, text)}
            />
            <TouchableOpacity style={styles.playButton} onPress={() => playRecording(item.uri)}>
              <Text style={styles.buttonText}>▶</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteRecording(item.id)}>
              <Text style={styles.buttonText}>🗑</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8d1c4",
    padding: 70,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  recordingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: 10,
    backgroundColor: "#fff",
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  nameInput: {
    flex: 1,
    padding: 5,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  playButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
});
