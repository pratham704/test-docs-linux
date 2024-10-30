import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";

const NoDocuments = ({ onGetStarted }) => {

    const nav = useNavigation()
  const animatedBorder = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateBorder = () => {
      animatedBorder.setValue(0);
      Animated.loop(
        Animated.timing(animatedBorder, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        })
      ).start();
    };
    
    animateBorder();
  }, [animatedBorder]);

  const borderColor = animatedBorder.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FF5733", "#FFD700"], // Colors for the border
  });

  return (
    <View style={styles.container}>
      <Ionicons name="folder-outline" size={100} color="#FFD700" style={styles.icon} />
      <Text style={styles.title}>No Documents Found</Text>
      <Text style={styles.subtitle}>
        It looks like you haven't uploaded any documents yet.
      </Text>
      <Text style={styles.instruction}>
        Start by adding your first document to get started!
      </Text>
      <TouchableOpacity style={styles.button} onPress={()=>nav.navigate("Profile")}>
        <Animated.View style={[styles.buttonOutline, { borderColor }]}>
          <Text style={styles.buttonText}>Get Started</Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: "#ffffff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#aaaaaa",
    textAlign: "center",
    marginBottom: 10,
  },
  instruction: {
    fontSize: 16,
    color: "#aaaaaa",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  buttonOutline: {
    borderWidth: 2,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: "#ffffff",
  },
});

export default NoDocuments;
