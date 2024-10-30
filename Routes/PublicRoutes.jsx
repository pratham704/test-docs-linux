import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import GetStarted from "../auth/GetStarted";

const Stack = createStackNavigator();

const PublicRoutes = () => {
  return (
    <Stack.Navigator initialRouteName="Start">
      <Stack.Screen
        name="Start"
        component={GetStarted}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default PublicRoutes;
