import React from 'react';
import { SafeAreaView, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native'; // Import necessary components
import { StatusBar } from 'expo-status-bar'; // Import StatusBar from expo-status-bar
import PublicRoutes from './Routes/PublicRoutes'
// import Toast from 'react-native-toast-message';
// import 'react-native-gesture-handler';


export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Handle status bar for Android */}
      {Platform.OS === 'android' && <RNStatusBar barStyle="light-content" backgroundColor="#000" />}
      
      {/* Set the StatusBar to light mode for iOS */}
      <StatusBar style="light" backgroundColor="#000" />
      
      <PublicRoutes />
      
      {/* Render Toast at the top level */}
      {/* <Toast  /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Set background to dark for a consistent look
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0, // Add padding for Android to prevent content from being under the StatusBar
  },
});