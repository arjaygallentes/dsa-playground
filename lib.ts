import { Expense, Transaction, DebitTransaction, CreditTransaction, NullTransaction, AccountBalance, ITransactionManager, AccountBalanceRepository, ITransaction } from './model';


const DebtTransctionPriorityComparator = (a: ITransaction, b: ITransaction) => a.amount - b.amount; // priority by highest debt
const CreditTransactionPriorityComparator = (a: ITransaction, b: ITransaction) => b.amount - a.amount; // priority by highest credit

import Heap from 'heap-js';

export class DebitTransactionManager implements ITransactionManager {
    private _transactions: Heap<ITransaction>;
    private _tx!: ITransaction;

    constructor() {
        this._transactions = new Heap(DebtTransctionPriorityComparator);
        this._transactions._applyLimit();
    }

    public TakeOne(): ITransaction {
        this._tx = this._transactions.pop() ?? new NullTransaction();
        return this._tx
    }

    public applyAmount(transactionAmount: number): void {
        transactionAmount //?

        this._tx.Apply(transactionAmount);

        transactionAmount //?
        if (this._tx.amount !== 0) {
            this._transactions.push(this._tx);
        }
    }

    public hasTransaction(): boolean {
        return !this._transactions.isEmpty();
    }

    public createTransaction(userId: number, debitAmount: number): Transaction {
        const transaction = new DebitTransaction(userId, debitAmount);
        this._transactions.push(transaction);
        return transaction;
    }
}

export class CreditTransactionManager implements ITransactionManager {
    private _transactions: Heap<ITransaction>;
    private _tx!: ITransaction;

    constructor() {
        this._transactions = new Heap(CreditTransactionPriorityComparator);
        this._transactions._applyLimit();
    }

    public TakeOne(): ITransaction {
        this._tx = this._transactions.pop() ?? new NullTransaction();
        return this._tx
    }

    public applyAmount(transactionAmount: number): void {
        this._tx.Apply(transactionAmount);

        if (this._tx.amount !== 0) {
            this._transactions.push(this._tx);
        }
    }

    public hasTransaction(): boolean {
        return !this._transactions.isEmpty();
    }

    public createTransaction(userId: number, creditAmount: number): Transaction {
        const transaction = new CreditTransaction(userId, creditAmount);
        this._transactions.push(transaction);
        return transaction;
    }
}