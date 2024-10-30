import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Alert
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { baseUrl } from "../api/BaseUrl";
import Toast from "react-native-toast-message";

const Login = () => {
  const nav = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFocused, setIsFocused] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false); // State to manage loading

  useFocusEffect(
    React.useCallback(() => {
      const checkToken = async () => {
        const token = await AsyncStorage.getItem("access_token");
        if (token) {
          nav.navigate("Main");
        }
      };

      checkToken();
    }, [nav])
  );

  const handleFocus = (field) => {
    setIsFocused((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setIsFocused((prev) => ({ ...prev, [field]: false }));
  };

  const validateFields = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 8) {
      newErrors.password = "Password should have at least 8 characters.";
    } else if (password.length > 20) {
      newErrors.password = "Password should have at most 20 characters.";
    }

    return newErrors;
  };

  const handleLogin = async () => {
    const validationErrors = validateFields();

    if (Object.keys(validationErrors).length > 0) {
      Object.values(validationErrors).forEach((error) => {
        Toast.show({
          type: "error",
          text1: error,
        });
      });
      return;
    }

    setLoading(true); // Start loading

    try {
      const response = await axios.post(`${baseUrl}/api/v1/auth/login`, { email, password });

      if (response.status === 200) {
        const token = response.data.data.access_token;
        await AsyncStorage.setItem("access_token", token);
        Toast.show({
          type: "success",
          text1: "Login successful!",
        });
        nav.navigate("Main");
      } else {
        Toast.show({
          type: "error",
          text1: response.data.message || "Login failed. Please try again.",
        });
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 404) {
          Toast.show({ type: "error", text1: "User not found." });
        } else if (err.response.status === 401) {
          Toast.show({ type: "error", text1: "Incorrect password." });
        } else {
          Toast.show({
            type: "error",
            text1: "An error occurred during login.",
          });
        }
      } else {
        Toast.show({
          type: "error",
          text1: "An unexpected error occurred. Please try again later.",
        });
      }
      console.error(err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={50}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Sign In</Text>

          {loading ? (
            // Skeleton Loader
            <View style={styles.loaderContainer}>
              <View style={styles.skeletonInput} />
              <View style={styles.skeletonInput} />
              <View style={styles.skeletonButton} />
              <View style={styles.skeletonFooterText} />
            </View>
          ) : (
            <>
              <View style={styles.inputContainer}>
                <Icon name="envelope" size={20} color="#ffffff" style={styles.icon} />
                <TextInput
                  style={[styles.input, isFocused.email && styles.inputFocused]}
                  placeholder="Email"
                  placeholderTextColor="#8e8e8e"
                  onChangeText={(text) => setEmail(text)}
                  value={email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => handleFocus("email")}
                  onBlur={() => handleBlur("email")}
                />
              </View>

              <View style={styles.inputContainer}>
                <Icon name="lock" size={20} color="#ffffff" style={styles.icon} />
                <TextInput
                  style={[styles.input, isFocused.password && styles.inputFocused]}
                  placeholder="Password"
                  placeholderTextColor="#8e8e8e"
                  secureTextEntry
                  onChangeText={(text) => setPassword(text)}
                  value={password}
                  autoCapitalize="none"
                  onFocus={() => handleFocus("password")}
                  onBlur={() => handleBlur("password")}
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Sign In</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.footerText}
                onPress={() => nav.navigate("Register")}
              >
                <Text style={{ color: "white" }}>
                  Don't have an account? Register
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Dark background
  },
  innerContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 28,
    color: "#ffffff", // White text
    fontWeight: "bold",
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    borderColor: "#1e1e1e",
    borderWidth: 2,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#ffffff", // White text
    fontSize: 16,
  },
  inputFocused: {
    borderColor: "#ff6347", // Highlight color when focused
  },
  button: {
    width: "100%",
    backgroundColor: "#ff6347",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footerText: {
    color: "#8e8e8e",
    marginTop: 30,
    fontSize: 14,
  },
  loaderContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  skeletonInput: {
    width: "100%",
    height: 50,
    backgroundColor: "#2e2e2e",
    borderRadius: 10,
    marginBottom: 20,
    opacity: 0.6,
  },
  skeletonButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#ff6347",
    borderRadius: 10,
    marginTop: 20,
    opacity: 0.6,
  },
  skeletonFooterText: {
    width: "70%",
    height: 20,
    backgroundColor: "#2e2e2e",
    borderRadius: 10,
    marginTop: 20,
    opacity: 0.6,
  },
});

export default Login;
