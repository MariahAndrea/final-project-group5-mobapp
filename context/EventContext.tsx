import React, { createContext, useState, ReactNode } from "react";
import { Event } from "../types/Event";

type EventContextType = {
  events: Event[];
  addEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;
};

export const EventContext = createContext<EventContextType>(
  {} as EventContextType
);

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[]>([]);

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

  return (
    <EventContext.Provider
      value={{ events, addEvent, updateEvent, deleteEvent }}
    >
      {children}
    </EventContext.Provider>
  );
};