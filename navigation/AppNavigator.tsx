import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import CreateEventScreen from "../screens/CreateEventScreen";
import EventDetailsScreen from "../screens/EventDetailsScreen";
import EditEventScreen from "../screens/EditEventScreen";

export type RootStackParamList = {
  Home: undefined;
  Create: undefined;
  Details: { id: string };
  Edit: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Create" component={CreateEventScreen} />
      <Stack.Screen name="Details" component={EventDetailsScreen} />
      <Stack.Screen name="Edit" component={EditEventScreen} />
    </Stack.Navigator>
  );
}