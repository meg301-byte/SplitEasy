import Link from 'next/link';
import type { Event } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Users, Receipt, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const totalExpenses = event.expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return (
    <Link href={`/events/${event.id}`} className="block transition-transform hover:scale-105">
      <Card className="flex h-full flex-col justify-between hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="font-headline truncate">{event.name}</CardTitle>
          <CardDescription>
            {event.participants.length} participants
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{event.participants.length} People</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Receipt className="h-4 w-4" />
              <span>{formatCurrency(totalExpenses)} Total</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="flex items-center text-sm font-semibold text-primary">
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
}
