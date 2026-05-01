import { Platform, View, Text, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Alert, ActivityIndicator } from "react-native";
import { useState, useContext, useMemo } from "react";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { EventContext } from "../context/EventContext";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { createCreateEventStyles } from "../styles/CreateEventStyles";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

type LocationResult = {
  display_name: string;
  lat: string;
  lon: string;
};

const InputField = ({ label, placeholder, value, onChangeText, keyboardType = "default", theme, createStyles }: any) => (
  <View style={{ marginBottom: 16 }}>
    {label && <Text style={createStyles.label}>{label}</Text>}
    <TextInput
      placeholder={placeholder}
      onChangeText={onChangeText}
      style={createStyles.input}
      value={value}
      keyboardType={keyboardType}
      placeholderTextColor={theme.textSecondary}
    />
  </View>
);

export default function CreateEventScreen({ navigation }: any) {
  const { events, addEvent } = useContext(EventContext);
  const { currentUser } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const [name, setName] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [guests, setGuests] = useState("");
  const [description, setDescription] = useState("");
  const [results, setResults] = useState<LocationResult[]>([]);
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(null);
  const [tempTime, setTempTime] = useState<Date | null>(null);
  const [tempEndTime, setTempEndTime] = useState<Date | null>(null);

  const createStyles = useMemo(() => createCreateEventStyles(theme), [theme]);

  const getDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleEndDateChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      if (selectedDate) {
        setEndDate(selectedDate);
      }
      setShowEndDatePicker(false);
    } else {
      if (selectedDate) {
        setTempEndDate(selectedDate);
      }
    }
  };

  const checkForOverlappingEvents = (eventDate: Date, eventEndTime: Date) => {
    return events.filter((existingEvent) => {
      if (existingEvent.status !== "confirmed") {
        return false;
      }

      const existingDate = new Date(existingEvent.date);
      const existingEndTime = existingEvent.endTime ? new Date(existingEvent.endTime) : null;

      // Check if dates match using a more reliable format
      if (getDateString(existingDate) !== getDateString(eventDate)) {
        return false;
      }

      if (existingEvent.venue.trim().toLowerCase() !== venue.trim().toLowerCase()) {
        return false;
      }

      // Check for time overlap
      const eventStart = eventDate.getTime();
      const eventEnd = eventEndTime.getTime();
      const existingStart = existingDate.getTime();
      const existingEnd = existingEndTime ? existingEndTime.getTime() : existingStart + (60 * 60 * 1000); // Default 1 hour if no end time

      // Check if time ranges overlap
      return (eventStart < existingEnd && eventEnd > existingStart);
    });
  };

  const isFormValid = () => {
    return (
      name.trim().length > 0 &&
      venue.trim().length > 0 &&
      date !== null &&
      endDate !== null &&
      time !== null &&
      endTime !== null &&
      guests.trim().length > 0 &&
      !isNaN(Number(guests)) &&
      Number(guests) > 0
    );
  };

  const handleCreate = () => {
    if (!isFormValid()) {
      Alert.alert("Invalid Input", "Please fill in all fields correctly before saving the event.");
      return;
    }

    const eventDate = new Date(date!);
    if (time) {
      eventDate.setHours(time.getHours(), time.getMinutes());
    }

    // Create proper end time with correct date
    const eventEndTime = new Date(endDate!); 
    eventEndTime.setHours(endTime!.getHours(), endTime!.getMinutes());

    if (eventEndTime <= eventDate) {
      Alert.alert("Invalid Time", "End time must be later than the start time.");
      return;
    }

    // Check for overlapping events
    const overlappingEvents = checkForOverlappingEvents(eventDate, eventEndTime);
    if (overlappingEvents.length > 0) {
      const eventNames = overlappingEvents.map(e => e.name).join(", ");
      Alert.alert(
        "Overlapping Events Not Allowed",
        `This venue is unavailable during that time because it overlaps with: ${eventNames}`
      );
      return;
    }

    proceedWithCreate(eventDate, eventEndTime);
  };

  const proceedWithCreate = (eventDate: Date, eventEndTime: Date) => {
    const endTimeString = endTime ? endTime.toLocaleTimeString("en-US", {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }) : null;

    Alert.alert(
      "Confirm Event Details",
      `Event: ${name}\nVenue: ${venue}\nStart: ${eventDate.toDateString()} ${eventDate.toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit', hour12: true })}\nEnd: ${eventEndTime.toDateString()} ${endTimeString}\nGuests: ${guests}${description ? 
        `\nDescription: ${description}` : ''}
      \nAre these details correct?`,
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Save",
          onPress: () => {
            addEvent({
              id: Date.now().toString(),
              userId: currentUser?.id || "guest",
              userName: currentUser?.name || "Guest",
              name,
              venue,
              date: eventDate.toISOString(),
              guests: Number(guests),
              latitude: 0,
              longitude: 0,
              description: description.trim() || undefined,
              endTime: eventEndTime.toISOString(),
              status: "pending",
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

  const getPickerDefault = () => new Date();

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

  const handleEndTimeChange = (_: DateTimePickerEvent, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      if (selectedTime) {
        setEndTime(selectedTime);
      }
      setShowEndTimePicker(false);
    } else {
      if (selectedTime) {
        setTempEndTime(selectedTime);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={createStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView contentContainerStyle={createStyles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <Text style={createStyles.header}>Create Event</Text>
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
          createStyles={createStyles}
        />

        <InputField
          label="Description (Optional)"
          placeholder="Enter event description"
          value={description}
          onChangeText={setDescription}
          theme={theme}
          createStyles={createStyles}
        />

        <View style={{ marginBottom: 16}}>
          <Text style={createStyles.label}>Venue</Text>

          <View style={[
            createStyles.input, 
              { 
                flexDirection: 'row', 
                alignItems: 'center', 
                paddingVertical: 2,
              }
            ]}>
              <MaterialCommunityIcons 
                name="map-marker-outline" 
                size={20} 
                color={theme.primary} 
                style={{ marginRight: 8 }} 
              />
            <TextInput
              placeholder="Search for a venue..."
              onChangeText={handleVenueChange}
              value={venue}
              placeholderTextColor={theme.textSecondary}
              style={{
                flex: 1,
                height: 48,
                color: theme.text,
                fontSize: 16,
              }}
            />
            </View>
            {isSearching && (
              <View style={{ paddingVertical: 12, alignItems: "center" }}>
                <ActivityIndicator size="small" color={theme.primary} />
                <Text style={{ color: theme.textSecondary, fontSize: 13 }}>Searching venues...</Text>
              </View>
            )}
            {results.length > 0 && (
              <View style={createStyles.resultsContainer}>
                {results.map((item) => (
                  <TouchableOpacity
                    key={`${item.lat}-${item.lon}`}
                    style={createStyles.resultItem}
                    onPress={() => handleSelectResult(item)}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <MaterialCommunityIcons name="map-marker" size={16} color={theme.primary} style={{ marginRight: 8 }} />
                      <Text style={createStyles.resultText}>{item.display_name}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={createStyles.label}>Start Date</Text>
          <TouchableOpacity
            onPress={() => {
              setTempDate(date || getPickerDefault());
              setShowDatePicker(true);
            }}
            style={[createStyles.input, { justifyContent: "center", paddingVertical: 16 }]}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons name="calendar" size={20} color={theme.primary} style={{ marginRight: 10 }} />
              <Text style={{ color: date ? theme.text : theme.textSecondary, fontSize: 16 }}>
                {date ? date.toDateString() : "Pick start date"}
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
                setDate(tempDate || getPickerDefault());
                setShowDatePicker(false);
              }}
              style={[createStyles.input, { backgroundColor: theme.primary, marginTop: 8 }]}
            >
              <Text style={{ color: "#FFFFFF", fontWeight: "600", textAlign: "center" }}>Done</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={createStyles.label}>End Date</Text>
          <TouchableOpacity
            onPress={() => {
              setTempEndDate(endDate || date || getPickerDefault());
              setShowEndDatePicker(true);
            }}
            style={[createStyles.input, { justifyContent: "center", paddingVertical: 16 }]}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons name="calendar-range" size={20} color={theme.primary} style={{ marginRight: 10 }} />
              <Text style={{ color: endDate ? theme.text : theme.textSecondary, fontSize: 16 }}>
                {endDate ? endDate.toDateString() : "Pick end date"}
              </Text>
            </View>
          </TouchableOpacity>

          {showEndDatePicker && (
            <DateTimePicker
              value={Platform.OS === 'ios' ? (tempEndDate || new Date()) : (endDate || new Date())}
              mode="date"
              minimumDate={date || new Date()} 
              display={Platform.OS === "ios" ? "spinner" : "calendar"}
              onChange={handleEndDateChange}
            />
          )}

          {Platform.OS === 'ios' && showEndDatePicker && (
            <TouchableOpacity
              onPress={() => {
                setEndDate(tempEndDate || date || getPickerDefault());
                setShowEndDatePicker(false);
              }}
              style={[createStyles.input, { backgroundColor: theme.primary, marginTop: 8 }]}
            >
              <Text style={{ color: "#FFFFFF", fontWeight: "600", textAlign: "center" }}>Done</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={createStyles.label}>Time</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <TouchableOpacity
              onPress={() => {
                setTempTime(time || getPickerDefault());
                setShowTimePicker(true);
              }}
              style={[createStyles.input, { flex: 1, marginRight: 8, justifyContent: "center", paddingVertical: 16 }]}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons name="clock" size={20} color={theme.primary} style={{ marginRight: 10 }} />
                <Text style={{ color: time ? theme.text : theme.textSecondary, fontSize: 16 }}>
                  {time ? time.toLocaleTimeString("en-US", {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  }) : "Start time"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                const defaultEndTime = new Date();
                defaultEndTime.setHours(defaultEndTime.getHours() + 1);
                setTempEndTime(endTime || defaultEndTime);
                setShowEndTimePicker(true);
              }}
              style={[createStyles.input, { flex: 1, marginLeft: 8, justifyContent: "center", paddingVertical: 16 }]}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons name="clock-outline" size={20} color={theme.primary} style={{ marginRight: 10 }} />
                <Text style={{ color: endTime ? theme.text : theme.textSecondary, fontSize: 16 }}>
                  {endTime ? endTime.toLocaleTimeString("en-US", {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  }) : "End time"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
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
                setTime(tempTime || getPickerDefault());
                setShowTimePicker(false);
              }}
              style={[createStyles.input, { backgroundColor: theme.primary, marginTop: 8 }]}
            >
              <Text style={{ color: "#FFFFFF", fontWeight: "600", textAlign: "center" }}>Done</Text>
            </TouchableOpacity>
          )}
          {showEndTimePicker && (
            <DateTimePicker
              value={Platform.OS === 'ios' ? (tempEndTime || new Date()) : (endTime || new Date())}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "clock"}
              textColor={theme.primary}
              onChange={handleEndTimeChange}
            />
          )}
          {Platform.OS === 'ios' && showEndTimePicker && (
            <TouchableOpacity
              onPress={() => {
                const defaultEndTime = new Date();
                defaultEndTime.setHours(defaultEndTime.getHours() + 1);
                setEndTime(tempEndTime || defaultEndTime);
                setShowEndTimePicker(false);
              }}
              style={[createStyles.input, { backgroundColor: theme.primary, marginTop: 8 }]}
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
          createStyles={createStyles}
        />

        <TouchableOpacity
          style={[createStyles.buttonContainer, { opacity: isFormValid() ? 1 : 0.5 }]}
          onPress={handleCreate}
          disabled={!isFormValid()}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            <MaterialCommunityIcons name="check" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={createStyles.buttonText}>Create Event</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
