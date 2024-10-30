
import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
// import Routers from "./Routing/Routers";
import "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";
import PublicRoutes from './Routes/PublicRoutes';


export default function App() {
  return (
    <>
      <StatusBar backgroundColor="black" translucent={false} style="light" />
      <View style={styles.container}>
        <PublicRoutes />
        <Toast />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});





// import React from 'react';
// import { SafeAreaView, StyleSheet } from 'react-native';
// import { NavigationContainer } from "@react-navigation/native";
// import { enableScreens } from 'react-native-screens'; // Import enableScreens

// enableScreens(); // Call enableScreens here

// export default function App() {
//   return (
//     <SafeAreaView style={styles.container}>
//       <NavigationContainer>
//         <PublicRoutes />
//       </NavigationContainer>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000', 
//   },
// });

