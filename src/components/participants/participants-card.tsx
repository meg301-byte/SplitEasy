"use client";

import * as React from 'react';
import { useEvents } from '@/context/events-context';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserPlus } from 'lucide-react';
import type { Participant } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface ParticipantsCardProps {
  eventId: string;
  participants: Participant[];
}

export function ParticipantsCard({
  eventId,
  participants,
}: ParticipantsCardProps) {
  const { addParticipant } = useEvents();
  const [newParticipantName, setNewParticipantName] = React.useState('');
  const { toast } = useToast();

  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (newParticipantName.trim()) {
      const result = addParticipant(eventId, newParticipantName.trim());
      if (result) {
        setNewParticipantName('');
        toast({
          title: "Participant Added",
          description: `${result.name} has been added to the event.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Participant Exists",
          description: `${newParticipantName.trim()} is already in the event.`,
        });
      }
    }
  };

  const getInitials = (name: string) => {
    const names = name.split(' ');
    const initials = names.map((n) => n[0]).join('');
    return initials.toUpperCase().slice(0, 2);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <UserPlus /> Participants
        </CardTitle>
        <CardDescription>
          Add and view people in this event.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddParticipant} className="flex gap-2 mb-4">
          <Input
            placeholder="e.g., John Doe"
            value={newParticipantName}
            onChange={(e) => setNewParticipantName(e.target.value)}
          />
          <Button type="submit">Add</Button>
        </form>
        <div className="space-y-3">
          {participants.length > 0 ? (
            participants.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-accent text-accent-foreground font-semibold">
                    {getInitials(p.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{p.name}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No participants yet. Add someone to get started!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
