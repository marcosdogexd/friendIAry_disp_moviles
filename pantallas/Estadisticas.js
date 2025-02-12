import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { getFirestore, collection, doc, getDoc, setDoc, getDocs } from "firebase/firestore";
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
  const [modoSemanal, setModoSemanal] = useState(true);

  useEffect(() => {
    cargarDatosGuardados();
  }, [modoSemanal]);

  const cargarDatosGuardados = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const db = getFirestore();
      const estadisticasRef = doc(db, "estadisticas", user.displayName);
      const estadisticasSnap = await getDoc(estadisticasRef);

      if (estadisticasSnap.exists()) {
        const datos = estadisticasSnap.data();
        if (modoSemanal && datos.general) {
          setResumenGPT(datos.general.resumen);
          setAnalisisEstados(datos.general.analisis);
        } else if (!modoSemanal && datos.diario) {
          setResumenGPT(datos.diario.resumen);
          setAnalisisEstados(datos.diario.analisis);
        }
        setLoading(false);
      } else {
        cargarNotas();
      }
    } catch (error) {
      console.error("Error al cargar datos guardados:", error);
      cargarNotas();
    }
  };

  const cargarNotas = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const db = getFirestore();
      const notasRef = collection(db, "notas", user.displayName, "mis_notas");
      const querySnapshot = await getDocs(notasRef);

      let notasCargadas = querySnapshot.docs.map((doc) => doc.data());

      if (!modoSemanal) {
        const hoy = new Date().toISOString().split("T")[0]; 
        notasCargadas = notasCargadas.filter((nota) =>
          nota.timestamp?.toDate().toISOString().startsWith(hoy)
        );
      }

      setNotas(notasCargadas);
      await generarResumenConGPT(notasCargadas);
      await generarAnalisisPorEstado(notasCargadas);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar notas:", error);
      setLoading(false);
    }
  };

  const guardarEnFirestore = async (tipo, resumen, analisis) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const db = getFirestore();
      const estadisticasRef = doc(db, "estadisticas", user.displayName);

      await setDoc(
        estadisticasRef,
        {
          [tipo]: {
            resumen,
            analisis,
            timestamp: new Date(),
          },
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error al guardar estadísticas en Firestore:", error);
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
              } del usuario en términos de emociones, mencionando patrones relevantes sin repetición innecesaria.`,
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
      await guardarEnFirestore(modoSemanal ? "general" : "diario", response.data.choices[0].message.content, analisisEstados);
    } catch (error) {
      console.error("Error al generar resumen con GPT:", error);
      setResumenGPT("No se pudo generar el resumen en este momento.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <FontAwesome name="arrow-left" size={20} color="#000" />
        <Text style={styles.backText}>Mis notas</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Tu Análisis {modoSemanal ? "Semanal" : "Diario"}</Text>

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
                    (estado) =>
                      notas.filter((nota) => nota.sentimiento === estado).length
                  ),
                },
              ],
            }}
            width={320}
            height={200}
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              color: () => "#FF8C42",
            }}
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