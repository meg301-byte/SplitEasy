export interface Participant {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  payerId: string;
  participantIds: string[];
}

export interface Event {
  id: string;
  name: string;
  participants: Participant[];
  expenses: Expense[];
}

export interface Transaction {
  from: string;
  to: string;
  amount: number;
}
