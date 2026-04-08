import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ChatScreen } from "./src/screens/ChatScreen";
import { Sidebar } from "./src/components/Sidebar";

const Drawer = createDrawerNavigator();

const linking = {
  prefixes: ["aviationai://"],
  config: {
    screens: {
      Chat: "", 
    },
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer linking={linking}>
        <Drawer.Navigator 
          drawerContent={(props) => <Sidebar {...props} />}
          screenOptions={{ headerShown: false }}
        >
          <Drawer.Screen name="Chat" component={ChatScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
