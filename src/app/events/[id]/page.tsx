"use client";

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEvents } from '@/context/events-context';
import { EventDashboard } from '@/components/events/event-dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function EventPage() {
  const params = useParams();
  const router = useRouter();
  const { getEventById, loading } = useEvents();
  const eventId = typeof params.id === 'string' ? params.id : '';
  const event = getEventById(eventId);

  if (loading) {
    return (
      <div className="w-full max-w-6xl space-y-6">
        <Skeleton className="h-10 w-1/2" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full lg:col-span-2" />
          <Skeleton className="h-80 w-full lg:col-span-3" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-1 items-center justify-center text-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Event Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              The event you are looking for does not exist or may have been deleted.
            </p>
            <Button asChild>
              <Link href="/">Go Back to Events</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <EventDashboard event={event} />;
}
