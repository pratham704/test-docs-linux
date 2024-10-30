import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import GetStarted from "../auth/GetStarted";

const Stack = createStackNavigator();

const Routers = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="start">
        <Stack.Screen
          name="gettingstarted"
          component={GetStarted}
          options={{ headerShown: false }}
        />
       
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routers;



