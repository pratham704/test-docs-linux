import React from "react";
import { View, StyleSheet } from "react-native";

const SkeletonLoader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.titleSkeleton} />
        <View style={styles.inputContainer}>
          <View style={styles.icon} />
          <View style={styles.skeleton} />
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.icon} />
          <View style={styles.skeleton} />
        </View>
        <View style={styles.button} />
        <View style={styles.footerTextSkeleton} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  innerContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    flex: 1,
  },
  titleSkeleton: {
    height: 40, // Height for the title
    width: "60%", // Width of the title (adjust as needed)
    backgroundColor: "#333",
    borderRadius: 10,
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%", // Full width to match Login
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    borderColor: "#1e1e1e",
    borderWidth: 2,
  },
  icon: {
    width: 20, // Placeholder width for the icon
    height: 20, // Placeholder height for the icon
    backgroundColor: "#555",
    borderRadius: 10,
    marginRight: 10,
  },
  skeleton: {
    flex: 1,
    height: 50, // Height of input skeleton
    backgroundColor: "#333", // Dark background for input
    borderRadius: 10,
  },
  button: {
    width: "100%", // Full width to match Login
    height: 50,
    backgroundColor: "#ff6347", // Button color
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    elevation: 4,
  },
  footerTextSkeleton: {
    width: "40%", // Width for footer text skeleton
    height: 20, // Height for footer text
    backgroundColor: "#333",
    borderRadius: 10,
    marginTop: 30,
  },
});

export default SkeletonLoader;
