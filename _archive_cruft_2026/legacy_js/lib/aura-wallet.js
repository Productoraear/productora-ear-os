class ImmutableLedger {
    transactions = [];
    addTransaction(transaction) {
        this.transactions.push({ ...transaction });
    }
    getTransactions() {
        return [...this.transactions];
    }
}
export default new ImmutableLedger();
