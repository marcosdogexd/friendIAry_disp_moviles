import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

export default function SentimentAnalyzer() {
  const [text, setText] = useState("");
  const [sentimentData, setSentimentData] = useState(null);

  const analyzeSentiment = async () => {
    try {
      const response = await fetch("10.0.2.2:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      
      const data = await response.json();
      if (data.sentiments) {
        setSentimentData(data.sentiments);
      } else {
        Alert.alert("Error", "No se pudieron obtener los sentimientos.");
        
      }
    } catch (error) {
      console.error("Error al analizar sentimiento:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Analizador de Sentimientos</Text>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Escribe tu estado de ánimo..."
        value={text}
        onChangeText={setText}
      />
      <TouchableOpacity style={styles.button} onPress={analyzeSentiment}>
        <Text style={styles.buttonText}>Analizar</Text>
      </TouchableOpacity>
      {sentimentData && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Resultados en porcentaje</Text>
          <BarChart
            data={{
              labels: Object.keys(sentimentData),
              datasets: [{ data: Object.values(sentimentData) }],
            }}
            width={Dimensions.get("window").width - 40}
            height={220}
            chartConfig={{
              backgroundColor: "#f4f4f4",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#f4f4f4",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            style={{ marginVertical: 10, borderRadius: 10 }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    textAlignVertical: "top",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  chartContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
