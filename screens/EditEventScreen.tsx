import { Platform, View, Text, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Alert, ActivityIndicator } from "react-native";
import { useContext, useState, useMemo } from "react";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { EventContext } from "../context/EventContext";
import { ThemeContext } from "../context/ThemeContext";
import { createEditEventStyles } from "../styles/EditEventStyles";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

type LocationResult = {
  display_name: string;
  lat: string;
  lon: string;
};

const InputField = ({ label, placeholder, value, onChangeText, keyboardType = "default", theme, editStyles }: any) => (
  <View style={{ marginBottom: 16 }}>
    {label && <Text style={editStyles.label}>{label}</Text>}
    <TextInput
      placeholder={placeholder}
      onChangeText={onChangeText}
      style={editStyles.input}
      value={value}
      keyboardType={keyboardType}
      placeholderTextColor={theme.textSecondary}
    />
  </View>
);

export default function EditEventScreen({ route, navigation }: any) {
  const { id } = route.params;
  const { events, updateEvent } = useContext(EventContext);
  const { theme } = useContext(ThemeContext);

  const event = events.find((e) => e.id === id);

  const [name, setName] = useState(event?.name || "");
  const [venue, setVenue] = useState(event?.venue || "");
  const [date, setDate] = useState<Date | null>(event?.date ? new Date(event.date) : null);
  const [time, setTime] = useState<Date | null>(event?.date ? new Date(event.date) : null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [guests, setGuests] = useState(String(event?.guests || ""));
  const [results, setResults] = useState<LocationResult[]>([]);
  const [searchTimeout, setSearchTimeout] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);
  const [tempTime, setTempTime] = useState<Date | null>(null);

  const isFormValid = () => {
    return (
      name.trim().length > 0 &&
      venue.trim().length > 0 &&
      date !== null &&
      time !== null &&
      guests.trim().length > 0 &&
      !isNaN(Number(guests)) &&
      Number(guests) > 0
    );
  };

  const handleUpdate = () => {
    if (!isFormValid()) {
      Alert.alert("Invalid Input", "Please fill in all fields correctly before updating the event.");
      return;
    }

    const eventDate = date ? new Date(date) : new Date(event?.date || "");
    if (time) {
      eventDate.setHours(time.getHours(), time.getMinutes());
    }

    Alert.alert(
      "Confirm Event Changes",
      `Event: ${name}\nVenue: ${venue}\nDate: ${eventDate.toDateString()}\nTime: ${eventDate.toLocaleTimeString()}\nGuests: ${guests}\n\nAre these changes correct?`,
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Update",
          onPress: () => {
            updateEvent({
              ...event!,
              name,
              venue,
              date: eventDate.toISOString(),
              guests: Number(guests),
              latitude: event?.latitude ?? 0,
              longitude: event?.longitude ?? 0,
            });
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleVenueChange = (text: string) => {
    setVenue(text);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (text.trim().length > 2) {
      setIsSearching(true);
      const timeout = setTimeout(async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&countrycodes=PH&limit=5`,
            {
              headers: {
                "User-Agent": "EventEase/1.0",
              },
            }
          );
          const data = await response.json();
          setResults(data);
        } catch (error) {
          console.warn("Location search failed", error);
          setResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 500);
      setSearchTimeout(timeout);
    } else {
      setResults([]);
      setIsSearching(false);
    }
  };

  const handleSelectResult = (result: LocationResult) => {
    setVenue(result.display_name);
    setResults([]);
  };

  const handleDateChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      if (selectedDate) {
        setDate(selectedDate);
      }
      setShowDatePicker(false);
    } else {
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const handleTimeChange = (_: DateTimePickerEvent, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      if (selectedTime) {
        setTime(selectedTime);
      }
      setShowTimePicker(false);
    } else {
      if (selectedTime) {
        setTempTime(selectedTime);
      }
    }
  };

  if (!event) return null;

  const editStyles = useMemo(() => createEditEventStyles(theme), [theme]);

  return (
    <KeyboardAvoidingView
      style={editStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView contentContainerStyle={editStyles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <Text style={editStyles.header}>Edit Event</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="close" size={28} color={theme.text} />
          </TouchableOpacity>
        </View>

        <InputField
          label="Event Name"
          placeholder="Enter event name"
          value={name}
          onChangeText={setName}
          theme={theme}
          editStyles={editStyles}
        />

        <View style={{ marginBottom: 16 }}>
          <Text style={editStyles.label}>Venue</Text>
          <TextInput
            placeholder="Search for a venue..."
            onChangeText={handleVenueChange}
            style={editStyles.input}
            value={venue}
            placeholderTextColor={theme.textSecondary}
          />
          {isSearching && (
            <View style={{ paddingVertical: 12, alignItems: "center" }}>
              <ActivityIndicator size="small" color={theme.primary} />
              <Text style={{ marginTop: 8, color: theme.textSecondary, fontSize: 13 }}>Searching venues...</Text>
            </View>
          )}
          {results.length > 0 && (
            <View style={editStyles.resultsContainer}>
              {results.map((item) => (
                <TouchableOpacity
                  key={`${item.lat}-${item.lon}`}
                  style={editStyles.resultItem}
                  onPress={() => handleSelectResult(item)}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <MaterialCommunityIcons name="map-marker" size={16} color={theme.primary} style={{ marginRight: 8 }} />
                    <Text style={editStyles.resultText}>{item.display_name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={editStyles.label}>Date</Text>
          <TouchableOpacity
            onPress={() => {
              setTempDate(date);
              setShowDatePicker(true);
            }}
            style={[editStyles.input, { justifyContent: "center", paddingVertical: 16 }]}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons name="calendar" size={20} color={theme.primary} style={{ marginRight: 10 }} />
              <Text style={{ color: date ? theme.text : theme.textSecondary, fontSize: 16 }}>
                {date ? date.toDateString() : "Pick a date"}
              </Text>
            </View>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={Platform.OS === 'ios' ? (tempDate || new Date()) : (date || new Date())}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "calendar"}
              textColor={theme.primary}
              onChange={handleDateChange}
            />
          )}
          {Platform.OS === 'ios' && showDatePicker && (
            <TouchableOpacity
              onPress={() => {
                if (tempDate) setDate(tempDate);
                setShowDatePicker(false);
              }}
              style={[editStyles.input, { backgroundColor: theme.primary, marginTop: 8 }]}
            >
              <Text style={{ color: "#FFFFFF", fontWeight: "600", textAlign: "center" }}>Done</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={editStyles.label}>Time</Text>
          <TouchableOpacity
            onPress={() => {
              setTempTime(time);
              setShowTimePicker(true);
            }}
            style={[editStyles.input, { justifyContent: "center", paddingVertical: 16 }]}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons name="clock" size={20} color={theme.primary} style={{ marginRight: 10 }} />
              <Text style={{ color: time ? theme.text : theme.textSecondary, fontSize: 16 }}>
                {time ? time.toLocaleTimeString() : "Pick a time"}
              </Text>
            </View>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={Platform.OS === 'ios' ? (tempTime || new Date()) : (time || new Date())}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "clock"}
              textColor={theme.primary}
              onChange={handleTimeChange}
            />
          )}
          {Platform.OS === 'ios' && showTimePicker && (
            <TouchableOpacity
              onPress={() => {
                if (tempTime) setTime(tempTime);
                setShowTimePicker(false);
              }}
              style={[editStyles.input, { backgroundColor: theme.primary, marginTop: 8 }]}
            >
              <Text style={{ color: "#FFFFFF", fontWeight: "600", textAlign: "center" }}>Done</Text>
            </TouchableOpacity>
          )}
        </View>

        <InputField
          label="Number of Guests"
          placeholder="Enter number of guests"
          value={guests}
          onChangeText={setGuests}
          keyboardType="numeric"
          theme={theme}
          editStyles={editStyles}
        />

        <TouchableOpacity
          style={[editStyles.buttonContainer, { opacity: isFormValid() ? 1 : 0.5 }]}
          onPress={handleUpdate}
          disabled={!isFormValid()}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            <MaterialCommunityIcons name="check" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={editStyles.buttonText}>Update Event</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
