import { useContext, useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { EventContext } from "../context/EventContext";
import { ThemeContext } from "../context/ThemeContext";
import { Event } from "../types/Event";
import { createCalendarStyles } from "../styles/CalendarScreenStyles";
import { getStatusColor } from "../styles/statusColors";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getMonthDays = (monthDate: Date) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];

  for (let i = 0; i < firstDay.getDay(); i += 1) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(new Date(year, month, day));
  }

  while (days.length % 7 !== 0) {
    days.push(null);
  }

  return days;
};

const sortEventsByTime = (events: Event[]) =>
  [...events].sort(
    (first, second) =>
      new Date(first.date).getTime() - new Date(second.date).getTime()
  );

export default function CalendarScreen({ navigation }: any) {
  const { visibleEvents } = useContext(EventContext);
  const { theme } = useContext(ThemeContext);
  const calendarStyles = useMemo(() => createCalendarStyles(theme), [theme]);
  const calendarEvents = useMemo(
    () => visibleEvents.filter((event) => event.status !== "cancelled"),
    [visibleEvents]
  );
  const todayKey = getDateKey(new Date());

  const [visibleMonth, setVisibleMonth] = useState(() => new Date());
  const [selectedDateKey, setSelectedDateKey] = useState(todayKey);

  const eventsByDate = useMemo(() => {
    return calendarEvents.reduce<Record<string, Event[]>>((groups, event) => {
      const key = getDateKey(new Date(event.date));
      groups[key] = groups[key] ? [...groups[key], event] : [event];
      return groups;
    }, {});
  }, [calendarEvents]);

  const calendarDays = useMemo(
    () => getMonthDays(visibleMonth),
    [visibleMonth]
  );

  const selectedEvents = sortEventsByTime(eventsByDate[selectedDateKey] || []);
  const selectedDate = new Date(`${selectedDateKey}T00:00:00`);
  const monthLabel = visibleMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const moveMonth = (offset: number) => {
    setVisibleMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() + offset, 1)
    );
  };

  const goToToday = () => {
    const now = new Date();
    setVisibleMonth(now);
    setSelectedDateKey(getDateKey(now));
  };

  return (
    <View style={calendarStyles.container}>
      <View style={calendarStyles.header}>
        <View>
          <Text style={calendarStyles.headerTitle}>Calendar</Text>
          <Text style={calendarStyles.headerSubtitle}>
            {calendarEvents.length} {calendarEvents.length === 1 ? "booking" : "bookings"} tracked
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={calendarStyles.content}>
        <View style={calendarStyles.monthBar}>
          <TouchableOpacity
            style={calendarStyles.iconButton}
            onPress={() => moveMonth(-1)}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={24}
              color={theme.primary}
            />
          </TouchableOpacity>
          <View style={calendarStyles.monthTitleContainer}>
            <Text style={calendarStyles.monthTitle}>{monthLabel}</Text>
            <TouchableOpacity onPress={goToToday}>
              <Text style={calendarStyles.todayLink}>Today</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={calendarStyles.iconButton}
            onPress={() => moveMonth(1)}
          >
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={theme.primary}
            />
          </TouchableOpacity>
        </View>

        <View style={calendarStyles.calendarCard}>
          <View style={calendarStyles.weekRow}>
            {weekDays.map((day) => (
              <Text key={day} style={calendarStyles.weekDay}>
                {day}
              </Text>
            ))}
          </View>

          <View style={calendarStyles.daysGrid}>
            {calendarDays.map((day, index) => {
              const key = day ? getDateKey(day) : `empty-${index}`;
              const dayEvents = day ? eventsByDate[getDateKey(day)] || [] : [];
              const hasConfirmed = dayEvents.some((event) => event.status === "confirmed");
              const isSelected = day ? getDateKey(day) === selectedDateKey : false;
              const isToday = day ? getDateKey(day) === todayKey : false;

              return (
                <TouchableOpacity
                  key={key}
                  style={[
                    calendarStyles.dayCell,
                    isSelected && calendarStyles.selectedDayCell,
                    hasConfirmed && !isSelected && calendarStyles.unavailableDayCell,
                    !day && calendarStyles.emptyDayCell,
                  ]}
                  disabled={!day}
                  onPress={() => day && setSelectedDateKey(getDateKey(day))}
                  activeOpacity={0.75}
                >
                  {day && (
                    <>
                      <Text
                        style={[
                          calendarStyles.dayText,
                          isSelected && calendarStyles.selectedDayText,
                          isToday && !isSelected && calendarStyles.todayText,
                        ]}
                      >
                        {day.getDate()}
                      </Text>
                      {dayEvents.length > 0 && (
                        <View style={calendarStyles.eventDots}>
                          {dayEvents.slice(0, 3).map((event) => (
                            <View
                              key={event.id}
                              style={[
                                calendarStyles.eventDot,
                                { backgroundColor: getStatusColor(event.status) },
                                isSelected && calendarStyles.selectedEventDot,
                              ]}
                            />
                          ))}
                        </View>
                      )}
                    </>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={calendarStyles.agendaHeader}>
          <View>
            <Text style={calendarStyles.agendaTitle}>
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </Text>
            <Text style={calendarStyles.agendaSubtitle}>
              {selectedEvents.length}{" "}
              {selectedEvents.length === 1 ? "booking" : "bookings"}
            </Text>
          </View>
          <TouchableOpacity
            style={calendarStyles.addButton}
            onPress={() => navigation.navigate("Create")}
          >
            <MaterialCommunityIcons name="plus" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {selectedEvents.length === 0 ? (
          <View style={calendarStyles.emptyState}>
            <MaterialCommunityIcons
              name="calendar-blank"
              size={42}
              color={theme.textSecondary}
            />
            <Text style={calendarStyles.emptyText}>No events on this day</Text>
          </View>
        ) : (
          selectedEvents.map((event) => {
            const eventDate = new Date(event.date);
            return (
              <TouchableOpacity
                key={event.id}
                style={calendarStyles.agendaItem}
                onPress={() => navigation.navigate("Details", { id: event.id })}
                activeOpacity={0.8}
              >
                <View style={[calendarStyles.timePill, { backgroundColor: getStatusColor(event.status) }]}>
                  <Text style={calendarStyles.timeText}>
                    {eventDate.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {event.endTime && ` - ${new Date(event.endTime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`}
                  </Text>
                </View>
                <View style={calendarStyles.eventInfo}>
                  <Text style={calendarStyles.eventTitle}>{event.name}</Text>
                  <Text style={calendarStyles.eventVenue} numberOfLines={2}>
                    {event.venue} - {event.status}
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={22}
                  color={theme.textSecondary}
                />
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
