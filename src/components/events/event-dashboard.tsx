import type { Event } from '@/lib/types';
import { ParticipantsCard } from '@/components/participants/participants-card';
import { ExpensesCard } from '@/components/expenses/expenses-card';
import { SummaryCard } from '@/components/summary/summary-card';

interface EventDashboardProps {
  event: Event;
}

export function EventDashboard({ event }: EventDashboardProps) {
  return (
    <div className="w-full max-w-7xl space-y-6">
      <h1 className="text-3xl md:text-4xl font-bold font-headline text-center mb-8">
        {event.name}
      </h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-1 space-y-6">
          <ParticipantsCard eventId={event.id} participants={event.participants} />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <ExpensesCard 
            eventId={event.id}
            eventName={event.name}
            participants={event.participants} 
            expenses={event.expenses} 
          />
        </div>
      </div>
      <SummaryCard participants={event.participants} expenses={event.expenses} />
    </div>
  );
}
