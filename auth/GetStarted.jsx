import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
// import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
// import Icon from "react-native-vector-icons/MaterialIcons"; // Importing MaterialIcons
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

const GetStarted = () => {
  const nav = useNavigation();

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("access_token");
      if (token) {
        nav.navigate("Main"); // Navigate to Main if token exists
        console.log("minhbedwehb")
      }
    };

    checkToken();
  }, []); // Add nav to the dependency array

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <LottieView
        source={require("../../../assets/animation.json")} // Adjust the path as necessary
        autoPlay
        loop
        style={styles.image}
      /> */}
      <Text style={styles.title}>Welcome to SafeDocs</Text>
      <Text style={styles.description}>
        Upload your documents securely and access them anytime, anywhere. Keep
        your important files safe and organized with our easy-to-use interface.
      </Text>

      <TouchableOpacity style={styles.button} 
      onPress={() => nav.navigate("Login")}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>

      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>Features:</Text>

        <View style={styles.featureItem}>
          {/* <Icon name="access-time" size={20} color="#ff6347" /> */}
          <Text style={styles.featureText}>Easy Access Anytime</Text>
        </View>
        <View style={styles.featureItem}>
          {/* <Icon name="folder" size={20} color="#ff6347" /> */}
          <Text style={styles.featureText}>Organized File Management</Text>
        </View>
        <View style={styles.featureItem}>
          {/* <Icon name="backup" size={20} color="#ff6347" /> */}
          <Text style={styles.featureText}>Automatic Backups</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Your documents are safe with us!</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    color: "#ffffff",
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  description: {
    fontSize: 18,
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#ff6347",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
    elevation: 5, // Shadow for button
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  featuresContainer: {
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    padding: 15,
    width: "100%",
    marginBottom: 30,
  },
  featuresTitle: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "bold",
    marginBottom: 10,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  featureText: {
    color: "#8e8e8e",
    fontSize: 16,
    marginLeft: 10, // Space between icon and text
  },
  footer: {
    marginTop: 30,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#444444",
    width: "100%",
    alignItems: "center",
  },
  footerText: {
    color: "#8e8e8e",
    fontSize: 14,
  },
});

export default GetStarted;
