import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  Alert 
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"; 
import { useNavigation } from "@react-navigation/native"; 
import { getAuth } from "firebase/auth";
import { getFirestore, collection, doc, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { FontAwesome } from "@expo/vector-icons";
import { format, differenceInMinutes } from "date-fns";
import * as LocalAuthentication from "expo-local-authentication";
import styles from "../styles/HubEstilos";

// Importar pantallas
import Menu from "./Menu";
import HistorialNotas from "./HistorialNotas";

const db = getFirestore();
const Tab = createBottomTabNavigator();

// Imágenes de estados de ánimo
const moodImages = {
  muy_feliz: require("../assets/muy_feliz.png"),
  feliz: require("../assets/feliz.png"),
  neutral: require("../assets/neutral.png"),
  triste: require("../assets/triste.png"),
  muy_triste: require("../assets/muy_triste.png"),
};

// Pantalla de Inicio
const HomeScreen = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    checkExistingMood();

    // Intervalo para reducir el contador cada minuto
    const interval = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime > 1) {
          return prevTime - 1;
        } else {
          setSelectedMood(null); // Restablece el estado cuando el tiempo llega a 0
          return 0;
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Verifica si ya eligió un estado de ánimo en los últimos 2 minutos
  const checkExistingMood = async () => { 
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const userName = user.displayName || "Usuario";
      const today = format(new Date(), "yyyy-MM-dd");

      // Referencia a la subcolección del usuario
      const moodsCollectionRef = collection(db, "estados_animo", userName, "estados");
      const querySnapshot = await getDocs(moodsCollectionRef);

      let lastMood = null;
      let lastTimestamp = null;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const docDate = format(data.timestamp.toDate(), "yyyy-MM-dd");

        if (docDate === today) {
          if (!lastTimestamp || data.timestamp.toDate() > lastTimestamp) {
            lastTimestamp = data.timestamp.toDate();
            lastMood = data.estado;
          }
        }
      });

      if (lastMood && lastTimestamp) {
        const minutesPassed = differenceInMinutes(new Date(), lastTimestamp);

        if (minutesPassed < 30) {
          setSelectedMood(lastMood);
          setTimeRemaining(30 - minutesPassed);
        } else {
          setSelectedMood(null);
          setTimeRemaining(0);
        }
      }
    } catch (error) {
      console.error("Error al verificar estado de ánimo:", error);
    }
  };

  // Guarda el estado de ánimo en la subcolección del usuario
  const saveMoodToFirestore = async (mood) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const userName = user.displayName || "Usuario";

      // Referencia a la subcolección "estados" dentro del usuario
      const moodsCollectionRef = collection(db, "estados_animo", userName, "estados");

      await addDoc(moodsCollectionRef, {
        estado: mood,
        timestamp: serverTimestamp(),
      });

      setSelectedMood(mood);
      setTimeRemaining(30);
    } catch (error) {
      console.error("Error al guardar el estado de ánimo:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Cómo te sientes el día de hoy?</Text>

      {/* Contenedor (emojis) */}
      <View style={styles.moodContainer}>
        <Text style={styles.moodText}>Selecciona el emoji que describa tu ánimo</Text>
        <View style={styles.moodIcons}>
          {Object.keys(moodImages).map((mood) => (
            <TouchableOpacity
              key={mood}
              onPress={() => saveMoodToFirestore(mood)}
              disabled={selectedMood !== null}
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

      {/* Tiempo restante en minutos */}
      {selectedMood && timeRemaining > 0 && (
        <Text style={styles.timerText}>
          Podrás cambiar tu estado en:{" "}
          <Text style={{ fontWeight: "bold", color: "red" }}>
            {timeRemaining}m
          </Text>
        </Text>
      )}
    </View>
  );
};

// Autenticación biométrica con huella
const handleBiometricAuth = async (navigation) => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) {
    Alert.alert("Error", "Tu dispositivo no soporta autenticación biométrica.");
    return;
  }

  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  if (!isEnrolled) {
    Alert.alert("Error", "No hay huellas registradas en el dispositivo.");
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

// Bottom Tab Navigator
export default function Hub() {
  const navigation = useNavigation();

  return (
    <Tab.Navigator
      initialRouteName="Crear Notas"
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#FF8C42",
        tabBarInactiveTintColor: "#777",
      }}
    >
      <Tab.Screen
        name="Estado de Ánimo"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="angellist" size={size} color={color} />
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
