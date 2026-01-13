"use client";

import * as React from 'react';
import { useEvents } from '@/context/events-context';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EventCard } from '@/components/events/event-card';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { events, addEvent } = useEvents();
  const [eventName, setEventName] = React.useState('');
  const router = useRouter();

  const handleCreateEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (eventName.trim()) {
      const newEvent = addEvent(eventName.trim());
      setEventName('');
      router.push(`/events/${newEvent.id}`);
    }
  };

  if (events.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Card className="w-full max-w-md text-center shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold font-headline">
              Welcome to SplitEasy
            </CardTitle>
            <CardDescription className="text-lg">
              Create a new event to start splitting bills.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="event-name" className="sr-only">
                  Event Name
                </Label>
                <Input
                  id="event-name"
                  placeholder="e.g., Weekend Camping Trip"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  required
                  className="text-center"
                />
              </div>
              <Button type="submit" size="lg" className="w-full">
                <PlusCircle />
                Create Event
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Your Events</h1>
        {/* TODO: Add a dialog to create a new event here */}
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
         <Card className="flex items-center justify-center border-2 border-dashed bg-accent">
            <form onSubmit={handleCreateEvent} className="w-full p-4 space-y-2">
              <Label htmlFor="new-event-name" className="text-sm font-medium text-center block">New Event</Label>
              <Input 
                id="new-event-name" 
                placeholder="Event Name"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
              <Button type="submit" className="w-full" variant="ghost">
                <PlusCircle className="mr-2 h-4 w-4" /> Create
              </Button>
            </form>
        </Card>
      </div>
    </div>
  );
}
