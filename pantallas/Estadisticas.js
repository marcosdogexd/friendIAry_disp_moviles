import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FontAwesome } from "@expo/vector-icons";
import { BarChart } from "react-native-chart-kit";
import axios from "axios";
import styles from "../styles/EstadisticasEstilos";

const moodIcons = {
  muy_feliz: "😃",
  feliz: "🙂",
  neutral: "😐",
  triste: "😟",
  muy_triste: "😢",
};

export default function Estadisticas({ navigation }) {
  const [notas, setNotas] = useState([]);
  const [resumenGPT, setResumenGPT] = useState("");
  const [analisisEstados, setAnalisisEstados] = useState({});
  const [loading, setLoading] = useState(true);
  const [modoSemanal, setModoSemanal] = useState(true); // Estado para alternar entre semanal y diario

  useEffect(() => {
    cargarNotas();
  }, [modoSemanal]);

  const cargarNotas = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const db = getFirestore();
      const notasRef = collection(db, "notas", user.displayName, "mis_notas");
      const querySnapshot = await getDocs(notasRef);

      let notasCargadas = querySnapshot.docs.map((doc) => doc.data());

      // Filtrar notas si está en modo diario
      if (!modoSemanal) {
        const hoy = new Date().toISOString().split("T")[0]; // Fecha de hoy en formato YYYY-MM-DD
        notasCargadas = notasCargadas.filter((nota) =>
          nota.timestamp?.toDate().toISOString().startsWith(hoy)
        );
      }

      setNotas(notasCargadas);
      generarResumenConGPT(notasCargadas);
      generarAnalisisPorEstado(notasCargadas);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar notas:", error);
      setLoading(false);
    }
  };

  const generarResumenConGPT = async (notas) => {
    try {
      const textoNotas = notas
        .map(
          (nota) =>
            `Nota: ${nota.contenido} (Estado: ${moodIcons[nota.sentimiento] || "😐"})`
        )
        .join("\n");

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `Eres un diario emocional que analiza tendencias ${
                modoSemanal ? "semanales" : "diarias"
              } basadas en notas escritas y estados de ánimo expresados con emojis. 
              Genera un resumen claro y conciso (máximo 1 párrafo) de cómo fue ${
                modoSemanal ? "la semana" : "el día"
              } del usuario en términos de emociones, mencionando patrones relevantes sin repetición innecesaria. 
              Evita frases predefinidas como 'Resumen semanal'. El resumen debe estar bien estructurado dentro de un contenedor y fácil de leer.`,
            },
            { role: "user", content: `Aquí están mis notas:\n${textoNotas}` },
          ],
          max_tokens: 200,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      setResumenGPT(response.data.choices[0].message.content);
    } catch (error) {
      console.error("Error al generar resumen con GPT:", error);
      setResumenGPT("No se pudo generar el resumen en este momento.");
    }
  };

  const generarAnalisisPorEstado = async (notas) => {
    try {
      const estados = Object.keys(moodIcons);
      let analisis = {};

      for (const estado of estados) {
        const notasEstado = notas
          .filter((nota) => nota.sentimiento === estado)
          .map((nota) => nota.contenido)
          .join("\n");

        if (notasEstado) {
          const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
              model: "gpt-3.5-turbo",
              messages: [
                {
                  role: "system",
                  content: `Eres un diario emocional que analiza las razones detrás de diferentes estados de ánimo del usuario. 
                  Para cada estado de ánimo si esque ha experimentado ese, proporciona una breve descripción personal (máximo 15 palabras) de factores o eventos que llevaron a ese estado.`,
                },
                {
                  role: "user",
                  content: `Aquí están mis notas con el estado de ánimo ${estado}:\n${notasEstado}`,
                },
              ],
              max_tokens: 50,
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
              },
            }
          );
          analisis[estado] = response.data.choices[0].message.content;
        }
      }
      setAnalisisEstados(analisis);
    } catch (error) {
      console.error("Error al generar análisis de estados con GPT:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <FontAwesome name="arrow-left" size={20} color="#000" />
        <Text style={styles.backText}>Mis notas</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Tu Análisis {modoSemanal ? "Semanal" : "Diario"}</Text>

      {/* Botón para alternar entre análisis semanal y diario */}
      <TouchableOpacity
        style={styles.switchButton}
        onPress={() => {
          setLoading(true);
          setModoSemanal(!modoSemanal);
        }}
      >
        <Text style={styles.switchButtonText}>
          Ver {modoSemanal ? "Análisis Diario" : "Análisis Semanal"}
        </Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#FF8C42" />
      ) : (
        <>
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>{resumenGPT}</Text>
          </View>

          <Text style={styles.chartTitle}>Distribución de estados de ánimo</Text>
          <BarChart
             data={{
              labels: Object.keys(moodIcons).map((estado) => moodIcons[estado]),
              datasets: [
            {
              data: Object.keys(moodIcons).map(
              (estado) => notas.filter((nota) => nota.sentimiento === estado).length
               ),
              },
              ],
         }} 
         width={280}
         height={190}
         chartConfig={{
           backgroundGradientFrom: "#fff",
           backgroundGradientTo: "#fff",
           color: () => "#985224",
           decimalPlaces: 0, // Solo mostrar números enteros
           propsForVerticalLabels: { fontSize: 20 },
           propsForHorizontalLabels: { fontSize: 14 }, 
         }}
         yAxisLabel="" 
         yAxisSuffix="" 
         showBarTops={true} // Ocultar los números en la parte superior de las barras
         fromZero={true}
       />
          <View style={styles.analysisContainer}>
            {Object.keys(moodIcons).map((estado) => (
              <View key={estado} style={styles.analysisBox}>
                <Text style={styles.analysisTitle}>
                  {moodIcons[estado]} {estado.replace("_", " ")}
                </Text>
                <Text style={styles.analysisText}>
                  {analisisEstados[estado] || "No se ha experimentado aún."}
                </Text>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}