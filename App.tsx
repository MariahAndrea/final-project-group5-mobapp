import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";
import { EventProvider } from "./context/EventContext";
import { ThemeProvider, ThemeContext } from "./context/ThemeContext";
import { useContext } from "react";

function AppContent() {
  const { theme } = useContext(ThemeContext);
  return (
    <>
      <StatusBar barStyle={theme.statusBar as any} />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <EventProvider>
        <AppContent />
      </EventProvider>
    </ThemeProvider>
  );
}