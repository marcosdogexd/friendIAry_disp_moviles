import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Alert 
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { FontAwesome } from "@expo/vector-icons";
import { format, differenceInSeconds, endOfDay } from "date-fns";
import * as LocalAuthentication from "expo-local-authentication"; // 📌 Importar autenticación biométrica

// Importar pantallas
import Menu from "./Menu";
import HistorialNotas from "./HistorialNotas";

const db = getFirestore();
const Tab = createBottomTabNavigator();

// 📌 Imágenes de estados de ánimo
const moodImages = {
  muy_feliz: require("../assets/muy_feliz.png"),
  feliz: require("../assets/feliz.png"),
  neutral: require("../assets/neutral.png"),
  triste: require("../assets/triste.png"),
  muy_triste: require("../assets/muy_triste.png"),
};

// 🏠 Pantalla de Inicio
const HomeScreen = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    checkExistingMood();
  }, []);

  // 🔍 Verifica si el usuario ya seleccionó un estado hoy
  const checkExistingMood = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const userName = user.displayName || "Usuario";
      const today = format(new Date(), "yyyy-MM-dd");
      const docId = `${userName}_${today}`;

      const docRef = doc(db, "estados_animo", docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setSelectedMood(docSnap.data().estado);
        calculateTimeRemaining();
      }
    } catch (error) {
      console.error("Error al verificar estado de ánimo:", error);
    }
  };

  // ⏳ Calcula el tiempo restante hasta medianoche
  const calculateTimeRemaining = () => {
    const now = new Date();
    const endOfToday = endOfDay(now);
    const secondsRemaining = differenceInSeconds(endOfToday, now);

    setTimeRemaining(secondsRemaining);
    startCountdown(secondsRemaining);
  };

  // ⏲ Inicia la cuenta regresiva en tiempo real
  const startCountdown = (seconds) => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setSelectedMood(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 🕒 Formatea los segundos en HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  // 💾 Guarda el estado de ánimo en Firebase
  const saveMoodToFirestore = async (mood) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const userName = user.displayName || "Usuario";
      const today = format(new Date(), "yyyy-MM-dd");
      const docId = `${userName}_${today}`;

      const userMoodRef = doc(db, "estados_animo", docId);
      await setDoc(userMoodRef, {
        usuario: userName,
        estado: mood,
        timestamp: new Date(),
      });

      setSelectedMood(mood);
      calculateTimeRemaining();
    } catch (error) {
      console.error("Error al guardar el estado de ánimo:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona como te sientes</Text>

      {/* Contenedor de estados de ánimo */}
      <View style={styles.moodContainer}>
        <Text style={styles.moodText}>Estado anímico diario</Text>
        <View style={styles.moodIcons}>
          {Object.keys(moodImages).map((mood) => (
            <TouchableOpacity
              key={mood}
              onPress={() => saveMoodToFirestore(mood)}
              disabled={selectedMood !== null} // Bloquea si ya eligió un estado
            >
              <Image
                source={moodImages[mood]}
                style={[
                  styles.moodIcon,
                  selectedMood === mood ? styles.selectedMood : {},
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Estado actual */}
      <Text style={styles.statusText}>
        Estado actual: {selectedMood ? selectedMood.replace("_", " ") : "No seleccionado"}
      </Text>

      {/* Tiempo restante */}
      {selectedMood && timeRemaining > 0 && (
        <Text style={styles.timerText}>
          Podrás cambiar tu estado en:{" "}
          <Text style={{ fontWeight: "bold", color: "red" }}>
            {formatTime(timeRemaining)}
          </Text>
        </Text>
      )}
    </View>
  );
};

// 📌 Autenticación biométrica antes de acceder a la lista de notas
const handleBiometricAuth = async (navigation) => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) {
    Alert.alert("Error", "Tu dispositivo no soporta autenticación biométrica.");
    return;
  }

  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  if (!isEnrolled) {
    Alert.alert("Error", "No hay huellas registradas en este dispositivo.");
    return;
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Autenticación requerida",
    fallbackLabel: "Usar código de acceso",
  });

  if (result.success) {
    navigation.navigate("HistorialNotas");
  } else {
    Alert.alert("Acceso denegado", "No se pudo autenticar la huella.");
  }
};

// 🌟 Configuración del Bottom Tab Navigator
export default function Hub() {
  const navigation = useNavigation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#FF8C42",
        tabBarInactiveTintColor: "#777",
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Crear Notas"
        component={Menu}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="edit" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Lista de Notas"
        component={HistorialNotas}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            handleBiometricAuth(navigation);
          },
        }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="bars" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// 🎨 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9F9F9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  timerText: {
    fontSize: 16,
    color: "red",
    fontWeight: "bold",
    marginTop: 10,
  },
  moodContainer: {
    backgroundColor: "#EAEAEA",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    width: "90%",
    marginBottom: 20,
  },
  moodText: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "500",
  },
  moodIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  moodIcon: {
    width: 50,
    height: 50,
  },
  selectedMood: {
    borderWidth: 2,
    borderColor: "#FF8C42",
    borderRadius: 10,
  },
  tabBar: {
    backgroundColor: "#FFE5D9",
    paddingBottom: 5,
    height: 60,
  },
});