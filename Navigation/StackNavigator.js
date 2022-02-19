import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../Components/HomeScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            title: "Barbarian",
            headerStyle: {
              backgroundColor: "tomato",
            },
            headerTintColor: "#EEEEEE",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
