import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import GetStarted from "../auth/GetStarted";
import Register from "../auth/Register";
import Login from "../auth/Login";
import MainNavigator from "./MainNavigator";

const Stack = createStackNavigator();

const Routers = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen
          name="Start"
          component={GetStarted}
          options={{ headerShown: false }}
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
        />

        <Stack.Screen
          name="Main"
          component={MainNavigator}
          options={{ headerShown: false }} // Hide header for MainNavigator
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routers;
