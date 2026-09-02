interface TransactionAtom {
  id: string;
  amount: number;
  date: Date;
  description: string;
}

class ImmutableLedger {
  private transactions: TransactionAtom[] = [];

  addTransaction(transaction: TransactionAtom): void {
    this.transactions.push({ ...transaction });
  }

  getTransactions(): TransactionAtom[] {
    return [...this.transactions];
  }
}

const ledger = new ImmutableLedger();

export function isVerified(artistId: string): boolean {
  // Implement the logic to check if an artist is verified
  return true; // Placeholder implementation
}

export function transacciones_exitosas(artistId: string): number {
  // Implement the logic to count successful transactions for an artist
  const transactions = ledger.getTransactions().filter(transaction => transaction.description.includes(artistId));
  return transactions.length;
}

export function clicks_en_landings(artistId: string): number {
  // Implement the logic to count landing clicks for an artist
  return Math.floor(Math.random() * 100); // Placeholder implementation
}

export default ledger;
