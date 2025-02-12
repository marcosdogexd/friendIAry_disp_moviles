import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./pantallas/Login";
import Registro from "./pantallas/Registro";
import Hub from "./pantallas/Hub"; // Hub maneja el Bottom Tab Navigator
import Menu from "./pantallas/Menu";
import HistorialNotas from "./pantallas/HistorialNotas"; // Agregamos HistorialNotas
import Mensajes from "./pantallas/Mensajes"; // Agregamos Mensajes
import AnalisisSentimiento from "./pantallas/AnalisisSentimiento";
import Comunidad from "./pantallas/Comunidad";
import MensajeAudio from "./pantallas/MensajesAudio" ;   // pantala de ingresar las notas mediante voz
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Registro" component={Registro} />
        <Stack.Screen name="Hub" component={Hub} />
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen name="HistorialNotas" component={HistorialNotas} /> 
        <Stack.Screen name="Mensajes" component={Mensajes} />
        <Stack.Screen name="AnalisisSentimiento" component={AnalisisSentimiento} />
        <Stack.Screen name="Comunidad" component={Comunidad}/>
        <Stack.Screen name="MensajesAudio" component={MensajeAudio}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}