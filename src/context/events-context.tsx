"use client";

import * as React from 'react';
import type { Event, Participant, Expense } from '@/lib/types';

interface EventsContextType {
  events: Event[];
  loading: boolean;
  addEvent: (name: string) => Event;
  getEventById: (id: string) => Event | undefined;
  addParticipant: (eventId: string, name: string) => Participant | undefined;
  addExpense: (
    eventId: string,
    expense: Omit<Expense, 'id'>
  ) => Expense | undefined;
}

const EventsContext = React.createContext<EventsContextType | undefined>(
  undefined
);

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    try {
      const storedEvents = localStorage.getItem('split-easy-events');
      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      }
    } catch (error) {
      console.error('Failed to parse events from localStorage', error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem('split-easy-events', JSON.stringify(events));
      } catch (error) {
        console.error('Failed to save events to localStorage', error);
      }
    }
  }, [events, loading]);

  const addEvent = (name: string): Event => {
    const newEvent: Event = {
      id: generateId(),
      name,
      participants: [],
      expenses: [],
    };
    setEvents((prevEvents) => [...prevEvents, newEvent]);
    return newEvent;
  };

  const getEventById = (id: string): Event | undefined => {
    return events.find((event) => event.id === id);
  };

  const addParticipant = (eventId: string, name: string): Participant | undefined => {
    let newParticipant: Participant | undefined;
    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id === eventId) {
          if (event.participants.some(p => p.name.toLowerCase() === name.toLowerCase())) {
             return event;
          }
          newParticipant = { id: generateId(), name };
          return {
            ...event,
            participants: [...event.participants, newParticipant],
          };
        }
        return event;
      })
    );
    return newParticipant;
  };

  const addExpense = (
    eventId: string,
    expenseData: Omit<Expense, 'id'>
  ): Expense | undefined => {
    let newExpense: Expense | undefined;
    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id === eventId) {
          newExpense = { ...expenseData, id: generateId() };
          return {
            ...event,
            expenses: [...event.expenses, newExpense],
          };
        }
        return event;
      })
    );
    return newExpense;
  };

  return (
    <EventsContext.Provider
      value={{
        events,
        loading,
        addEvent,
        getEventById,
        addParticipant,
        addExpense,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
}

export const useEvents = () => {
  const context = React.useContext(EventsContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};
