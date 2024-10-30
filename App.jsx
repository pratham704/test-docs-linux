import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { enableScreens } from 'react-native-screens'; // Import enableScreens
import PublicRoutes from './Routes/PublicRoutes';

enableScreens(); // Call enableScreens here

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <PublicRoutes />
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', 
  },
});
