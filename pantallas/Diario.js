import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView, Alert } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import DatePicker from 'react-native-date-picker';
import { OPEN_API_KEY } from '@env'; // Importa la API Key desde .env

export default function Diario() {
  const [entry, setEntry] = useState("");
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [showDiagnosisButton, setShowDiagnosisButton] = useState(false);
  const [responseMessage, setResponseMessage] = useState(""); // Estado para la respuesta de ChatGPT

  useEffect(() => {
    if (open) {
      setOpen(true);
    }
  }, [open]);

  const saveEntry = async () => {
    try {
      const response = await fetch("http://10.0.2.2:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: entry }),
      });

      const data = await response.json();
      Alert.alert("Guardado", "Entrada guardada correctamente");
      console.log("Respuesta del backend:", data);

      setShowDiagnosisButton(true);

      // Llamar a la API de OpenAI después de guardar la entrada
      await sendToChatGPT();

    } catch (error) {
      console.error("Error al guardar entrada:", error);
      Alert.alert("Error", "No se pudo guardar la entrada");
    }
  };

  const sendToChatGPT = async () => {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPEN_API_KEY}`, // Usa la API Key correctamente
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "Eres un asistente que analiza el estado emocional de un usuario." },
            { role: "user", content: entry },
          ],
        }),
      });

      const result = await response.json();
      setResponseMessage(result.choices?.[0]?.message?.content || "No se recibió respuesta.");

    } catch (error) {
      console.error("Error al enviar a ChatGPT:", error);
      Alert.alert("Error", "No se pudo obtener el análisis de sentimientos.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Ionicons name="calendar" size={24} color="black" onPress={() => setOpen(true)} />
        <Text style={{ marginTop: 10, fontSize: 16 }}>
          Fecha seleccionada: {date.toLocaleDateString()}
        </Text>

        <DatePicker
          modal
          open={open}
          date={date}
          onConfirm={(selectedDate) => {
            setOpen(false);
            setDate(selectedDate);
          }}
          onCancel={() => setOpen(false)}
        />
      </View>

      <View style={styles.paper}>
        <TextInput
          style={styles.textInput}
          multiline
          placeholder="Querido diario..."
          value={entry}
          onChangeText={setEntry}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveEntry}>
        <Text style={styles.saveText}>Guardar</Text>
      </TouchableOpacity>

      {showDiagnosisButton && (
        <>
          <TouchableOpacity style={styles.saveButton} onPress={sendToChatGPT}>
            <Text style={styles.saveText}>Diagnóstico</Text>
          </TouchableOpacity>

          {responseMessage !== "" && (
            <View style={styles.responseContainer}>
              <Text style={styles.responseText}>Análisis de sentimientos:</Text>
              <Text style={styles.responseText}>{responseMessage}</Text>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  paper: {
    backgroundColor: "#fff",
    padding: 20,
    marginTop: 20,
    borderRadius: 10,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  textInput: {
    height: 200,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: "100%",
    maxWidth: 200,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 18,
  },
  responseContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    maxWidth: 400,
    alignItems: "center",
  },
  responseText: {
    fontSize: 16,
    textAlign: "center",
  },
});
