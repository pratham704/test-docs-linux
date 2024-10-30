import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

// Import your screens
import GetStarted from "../auth/GetStarted";
// import Login from "../auth/Login";
// import Register from "../auth/Register";
// import MainNavigator from "./MainNavigator"; // Adjust the path as necessary

const Stack = createStackNavigator();

const PublicRoutes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen
          name="Start"
          component={GetStarted}
          options={{ headerShown: false }} // Hide header for Get Started
        />
        {/* <Stack.Screen
          name="Main"
          component={MainNavigator}
          options={{ headerShown: false }} // Hide header for MainNavigator
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }} // Hide header for Register
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }} // Hide header for Login
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default PublicRoutes;
