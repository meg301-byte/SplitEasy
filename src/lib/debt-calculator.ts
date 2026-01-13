import type { Participant, Expense, Transaction } from './types';

export function calculateBalances(
  participants: Participant[],
  expenses: Expense[]
): Map<string, number> {
  const balances = new Map<string, number>(
    participants.map((p) => [p.id, 0])
  );

  for (const expense of expenses) {
    if (!expense.payerId || expense.amount <= 0 || expense.participantIds.length === 0) {
      continue;
    }

    // Payer gets credited
    balances.set(
      expense.payerId,
      (balances.get(expense.payerId) || 0) + expense.amount
    );

    // Participants get debited
    const share = expense.amount / expense.participantIds.length;
    for (const participantId of expense.participantIds) {
      balances.set(
        participantId,
        (balances.get(participantId) || 0) - share
      );
    }
  }

  return balances;
}

export function simplifyDebts(balances: Map<string, number>): Transaction[] {
  const threshold = 0.01;
  const sortedBalances = Array.from(balances.entries())
    .map(([personId, balance]) => ({ personId, balance }))
    .filter((p) => Math.abs(p.balance) > threshold);

  const debtors = sortedBalances
    .filter((p) => p.balance < 0)
    .sort((a, b) => a.balance - b.balance);
  const creditors = sortedBalances
    .filter((p) => p.balance > 0)
    .sort((a, b) => b.balance - a.balance);

  const transactions: Transaction[] = [];

  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];
    const amountToSettle = Math.min(-debtor.balance, creditor.balance);

    if (amountToSettle > threshold) {
        transactions.push({
            from: debtor.personId,
            to: creditor.personId,
            amount: amountToSettle,
        });

        debtor.balance += amountToSettle;
        creditor.balance -= amountToSettle;
    }

    if (Math.abs(debtor.balance) < threshold) {
      debtorIndex++;
    }
    if (Math.abs(creditor.balance) < threshold) {
      creditorIndex++;
    }
  }

  return transactions;
}
