"use client";

import * as React from 'react';
import { calculateBalances, simplifyDebts } from '@/lib/debt-calculator';
import type { Participant, Expense, Transaction } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Scale, Landmark, ArrowRight } from 'lucide-react';

interface SummaryCardProps {
  participants: Participant[];
  expenses: Expense[];
}

export function SummaryCard({ participants, expenses }: SummaryCardProps) {
  const [balances, setBalances] = React.useState<Map<string, number>>(new Map());
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);

  React.useEffect(() => {
    if (participants.length > 0) {
      const calculatedBalances = calculateBalances(participants, expenses);
      setBalances(calculatedBalances);
      const simplifiedTransactions = simplifyDebts(calculatedBalances);
      setTransactions(simplifiedTransactions);
    } else {
      setBalances(new Map());
      setTransactions([]);
    }
  }, [participants, expenses]);

  const getParticipantName = (id: string) =>
    participants.find((p) => p.id === id)?.name || 'N/A';

  const hasDebts = Array.from(balances.values()).some(val => Math.abs(val) > 0.01);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Scale />
          Summary
        </CardTitle>
        <CardDescription>
          An overview of balances and how to settle up.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasDebts ? (
             <div className="text-center py-8 text-muted-foreground">
                <p className="font-medium">All settled up!</p>
                <p className="text-sm">There are no outstanding balances.</p>
            </div>
        ) : (
          <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="font-semibold">
                Final Balances
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {participants.map((p) => {
                    const balance = balances.get(p.id) || 0;
                    if (Math.abs(balance) < 0.01) return null;
                    const isOwed = balance > 0;
                    return (
                      <div
                        key={p.id}
                        className={`flex justify-between items-center p-2 rounded-md ${
                          isOwed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                        }`}
                      >
                        <span className="font-medium">{p.name}</span>
                        <span
                          className={`font-semibold ${
                            isOwed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {isOwed ? 'is owed' : 'owes'} {formatCurrency(Math.abs(balance))}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="font-semibold">
                <Landmark className="mr-2 h-4 w-4" /> Settlement Plan
              </AccordionTrigger>
              <AccordionContent>
                {transactions.length > 0 ? (
                  <div className="space-y-3">
                    {transactions.map((t, index) => (
                      <div key={index} className="flex items-center justify-center text-center gap-2 p-3 bg-accent rounded-lg">
                          <span className="font-medium">{getParticipantName(t.from)}</span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground"/>
                          <span className="font-medium">{getParticipantName(t.to)}</span>
                          <span className="font-bold text-primary ml-2">{formatCurrency(t.amount)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Everyone is settled up!
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
