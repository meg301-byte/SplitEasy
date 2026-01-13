"use client";

import * as React from 'react';
import { useEvents } from '@/context/events-context';
import type { Participant, Expense } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Receipt, PlusCircle, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { suggestExpenses } from '@/ai/flows/suggest-expenses-flow';
import { Badge } from '@/components/ui/badge';

interface ExpensesCardProps {
  eventId: string;
  eventName: string;
  participants: Participant[];
  expenses: Expense[];
}

export function ExpensesCard({ eventId, eventName, participants, expenses }: ExpensesCardProps) {
  const { addExpense } = useEvents();
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  
  const [description, setDescription] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [payerId, setPayerId] = React.useState<string | undefined>();
  const [selectedParticipants, setSelectedParticipants] = React.useState<string[]>([]);
  
  const [aiSuggestions, setAiSuggestions] = React.useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = React.useState(false);
  
  React.useEffect(() => {
    if(participants.length > 0) {
      setSelectedParticipants(participants.map(p => p.id));
    }
  }, [participants]);

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setPayerId(undefined);
    setSelectedParticipants(participants.map(p => p.id));
  };

  const handleSuggestionClick = (suggestion: string) => {
    setDescription(suggestion);
    setOpen(true);
  };
  
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !payerId || selectedParticipants.length === 0) {
      toast({ variant: "destructive", title: "Missing fields", description: "Please fill out all fields."});
      return;
    }
    const newExpense = addExpense(eventId, {
      description,
      amount: parseFloat(amount),
      payerId,
      participantIds: selectedParticipants,
    });
    if (newExpense) {
      toast({ title: "Expense added", description: `${newExpense.description} has been recorded.` });
      resetForm();
      setOpen(false);
    }
  };

  const handleAiSuggest = async () => {
    setIsSuggesting(true);
    try {
      const result = await suggestExpenses({
        eventName,
        participants: participants.map(p => p.name),
      });
      setAiSuggestions(result.suggestions);
    } catch (error) {
      console.error('AI suggestion failed:', error);
      toast({
        variant: 'destructive',
        title: 'AI Suggestion Failed',
        description: 'Could not generate expense suggestions at this time.',
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  const getParticipantName = (id: string) => participants.find(p => p.id === id)?.name || 'N/A';
  
  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline flex items-center gap-2"><Receipt /> Expenses</CardTitle>
          <CardDescription>Record and view all shared expenses.</CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAiSuggest}
          disabled={isSuggesting || participants.length === 0}
        >
          {isSuggesting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          AI Suggest
        </Button>
      </CardHeader>
      <CardContent>
        {aiSuggestions.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              AI Suggestions
            </h4>
            <div className="flex flex-wrap gap-2">
              {aiSuggestions.map((suggestion, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {expenses.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Paid By</TableHead>
                <TableHead>Split With</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.description}</TableCell>
                  <TableCell>{formatCurrency(expense.amount)}</TableCell>
                  <TableCell>{getParticipantName(expense.payerId)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {expense.participantIds.map(getParticipantName).join(', ')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No expenses recorded yet.</p>
            <p className="text-sm">Add an expense or use AI Suggest to get started!</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button disabled={participants.length === 0} className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddExpense} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Input id="description" value={description} onChange={e => setDescription(e.target.value)} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">Amount</Label>
                <Input id="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="payer" className="text-right">Paid By</Label>
                <Select onValueChange={setPayerId} value={payerId}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a participant" />
                  </SelectTrigger>
                  <SelectContent>
                    {participants.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                 <Label className="text-right pt-2">Split With</Label>
                 <div className="col-span-3 space-y-2">
                   {participants.map(p => (
                     <div key={p.id} className="flex items-center gap-2">
                       <Checkbox 
                         id={`participant-${p.id}`}
                         checked={selectedParticipants.includes(p.id)}
                         onCheckedChange={checked => {
                           setSelectedParticipants(prev => checked ? [...prev, p.id] : prev.filter(id => id !== p.id))
                         }}
                       />
                       <Label htmlFor={`participant-${p.id}`}>{p.name}</Label>
                     </div>
                   ))}
                 </div>
              </div>
               <DialogFooter>
                 <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                 <Button type="submit">Add Expense</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {participants.length === 0 && <p className="text-sm text-destructive ml-4">Please add participants before adding expenses.</p>}
      </CardFooter>
    </Card>
  );
}
