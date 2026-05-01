import { StatusBar } from "expo-status-bar";
import { InitialState, NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { EventProvider } from "./src/context/EventContext";
import { ThemeProvider, ThemeContext } from "./src/context/ThemeContext";
import { AuthProvider } from "./src/context/AuthContext";
import { useCallback, useContext, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"

const NAV_STATE_KEY = "eventease.navstate";

function AppContent() {
  const { theme } = useContext(ThemeContext);
  const [initialNavState, setInitialNavState] = useState<InitialState | undefined>(undefined);
  const [navStateLoaded, setNavStateLoaded] = useState(false);
  const isFirstLoad = useRef(true);
  const onNavigationReady = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem(NAV_STATE_KEY);
      if (saved) {
        setInitialNavState(JSON.parse(saved) as InitialState);
      }
    } catch (e) {
      console.warn("[App] Failed to load navigation state:", e);
    } finally {
      setNavStateLoaded(true);
    }
  }, []);

  const onNavigationStateChange = useCallback((state: object | undefined) => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    if (state) {
      AsyncStorage.setItem(NAV_STATE_KEY, JSON.stringify(state)).catch((e) =>
        console.warn("[App] Failed to save navigation state:", e)
      );
    }
  }, []);

   return (
    <>
      <StatusBar style={theme.statusBar as any} />
      <NavigationContainer
        initialState={navStateLoaded ? initialNavState : undefined}
        onReady={onNavigationReady}
        onStateChange={onNavigationStateChange}
      >
        <AppNavigator />
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EventProvider>
          <AppContent />
        </EventProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
