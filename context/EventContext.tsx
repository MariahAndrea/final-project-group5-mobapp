import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { Alert } from "react-native";
import { Event } from "../types/Event";
import { AuthContext } from "./AuthContext";

const EVENTS_KEY = "eventease.events";

const getDateKey = (value: string) => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const eventsOverlap = (first: Event, second: Event) => {
  if (getDateKey(first.date) !== getDateKey(second.date)) return false;
  if (first.venue.trim().toLowerCase() !== second.venue.trim().toLowerCase()) return false;

  const firstStart = new Date(first.date).getTime();
  const firstEnd = new Date(first.endTime).getTime();
  const secondStart = new Date(second.date).getTime();
  const secondEnd = new Date(second.endTime).getTime();

  return firstStart < secondEnd && firstEnd > secondStart;
};

type EventContextType = {
  events: Event[];
  visibleEvents: Event[];
  addEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;
  updateEventStatus: (id: string, status: Event["status"]) => void;
  deleteEventsForUser: (userId: string) => void;
};

export const EventContext = createContext<EventContextType>(
  {} as EventContextType
);

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const hydrate = async () => {
      const storedEvents = await AsyncStorage.getItem(EVENTS_KEY);
      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      }
      setHasHydrated(true);
    };

    hydrate();
  }, []);

  useEffect(() => {
    if (hasHydrated) {
      AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    }
  }, [events, hasHydrated]);

  const visibleEvents = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === "admin") return events;
    return events.filter((event) => event.userId === currentUser.id);
  }, [events, currentUser]);

  const addEvent = (event: Event) => {
    setEvents((prev) => [...prev, event]);
  };

  const updateEvent = (updatedEvent: Event) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
    );
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const updateEventStatus = (id: string, status: Event["status"]) => {
    if (status === "confirmed") {
      const target = events.find((event) => event.id === id);
      const conflict = target
        ? events.find(
            (event) =>
              event.id !== id &&
              event.status === "confirmed" &&
              eventsOverlap(target, event)
          )
        : null;

      if (conflict) {
        Alert.alert("Date Unavailable", `This venue and time are already confirmed for "${conflict.name}".`);
        return;
      }
    }

    setEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...event, status } : event))
    );
  };

  const deleteEventsForUser = (userId: string) => {
    setEvents((prev) => prev.filter((event) => event.userId !== userId));
  };

  return (
    <EventContext.Provider
      value={{ events, visibleEvents, addEvent, updateEvent, deleteEvent, updateEventStatus, deleteEventsForUser }}
    >
      {children}
    </EventContext.Provider>
  );
};
