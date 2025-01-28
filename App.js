import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./pantallas/Login";
import Registro from "./pantallas/Registro";
import Menu from "./pantallas/Menu";
import Hub from "./pantallas/Hub";
import HistorialNotas from "./pantallas/HistorialNotas";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Registro" component={Registro} />
        <Stack.Screen 
          name="Hub" 
          component={Hub} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen name="HistorialNotas" component={HistorialNotas} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}