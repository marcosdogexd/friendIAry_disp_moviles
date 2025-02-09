import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./pantallas/Login";
import Registro from "./pantallas/Registro";
import Hub from "./pantallas/Hub"; // Hub maneja el Bottom Tab Navigator
import Menu from "./pantallas/Menu";
import HistorialNotas from "./pantallas/HistorialNotas"; // Agregamos HistorialNotas
import AnalisisSentimientos from "./pantallas/analisisSentimientos";
import Mensajes from "./pantallas/Mensajes"; // Agregamos Mensajes
console.log("Navigation Container initialized");
console.log("Stack Navigator initialized");
console.log("Screens initialized: Login, Registro, Hub, Menu, HistorialNotas, Mensajes, AnalisisSentimientos");


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
        <Stack.Screen name="AnalisisSentimientos" component={AnalisisSentimientos} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}