import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./Navigation/StackNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container} forceInset={{ top: "never" }}>
        <StackNavigator />
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#232931",
  },
});
