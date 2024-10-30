import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { TouchableOpacity } from "react-native";

// Import your components
// import Documents from "../Documents/Documents"; 
import Profile from "../Profile/Profile";
// import AddDocument from "../Documents/AddDocument";

const Tab = createBottomTabNavigator();



const MainNavigator = () => {
  const navigation = useNavigation();

  const LogoutButton = async() => {

    await AsyncStorage.removeItem("access_token"); // Remove the access token
    navigation.navigate("Start"); // Navigate back to the Welcome page


};

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#121212", // Dark background for the tab bar
          borderTopWidth: 0, // Remove border
        },
        tabBarLabelStyle: {
          fontSize: 14,
          color: "#ffffff", // White text color for labels
        },
        tabBarIcon: ({ color }) => {
          let iconName;
          const iconSize = 30; // Increase this value for larger icons

          switch (route.name) {
            case "MyDocuments":
              iconName = "document-text-outline"; // Use appropriate icon name for My Documents
              break;
            case "AddDocument":
              iconName = "scan-outline"; // Scanner icon for Add Document
              break;
            case "Profile":
              iconName = "person-outline"; // Profile icon for Profile
              break;
            case "Logout": // Icon for Logout
              iconName = "log-out-outline"; // Logout icon
              break;
            default:
              iconName = "help-circle-outline"; // Fallback icon
          }

          return <Ionicons name={iconName} size={iconSize} color={color} />; // Use the defined iconSize
        },
      })}
    >
      {/* <Tab.Screen
        name="MyDocuments"
        children={() => <Documents tabType="myDocuments" />} // Pass prop to differentiate
        options={{ tabBarLabel: "Docs" }}
      />
      <Tab.Screen
        name="AddDocument"
        children={() => <AddDocument tabType="addDocument" />} // Pass prop to differentiate
        options={{ tabBarLabel: "Add" }}
      /> */}
      <Tab.Screen
        name="Profile"
        children={() => <Profile tabType="profile" />} // Pass prop to differentiate
        options={{ tabBarLabel: "Profile" }}
      />
      <Tab.Screen
        name="Logout"
        component={LogoutButton} // Use LogoutButton component for Logout functionality
        options={{ tabBarLabel: "Logout" }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
