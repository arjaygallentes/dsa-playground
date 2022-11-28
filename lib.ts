import { PriorityQueue } from 'js-sdsl';

// const DebtTransctionPriorityComparator = (a: ITransaction, b: ITransaction) => a.amount - b.amount; // priority by highest debt
// const CreditTransactionPriorityComparator = (a: ITransaction, b: ITransaction) => b.amount - a.amount; // priority by highest credit

export class DebitTransactionManager implements ITransactionManager {
    private _transactions: PriorityQueue<ITransaction>;
    private _tx!: ITransaction;

    constructor() {
        this._transactions = new PriorityQueue([], (a: ITransaction, b: ITransaction) => a.amount - b.amount);
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
        return !this._transactions.empty();
    }

    public createTransaction(userId: number, debitAmount: number): Transaction {
        const transaction = new DebitTransaction(userId, debitAmount);
        this._transactions.push(transaction);
        return transaction;
    }
}

export class CreditTransactionManager implements ITransactionManager {
    private _transactions: PriorityQueue<ITransaction>;
    private _tx!: ITransaction;

    constructor() {
        this._transactions = new PriorityQueue([], (a: ITransaction, b: ITransaction) => b.amount - a.amount);
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
        return !this._transactions.empty();
    }

    public createTransaction(userId: number, creditAmount: number): Transaction {
        const transaction = new CreditTransaction(userId, creditAmount);
        this._transactions.push(transaction);
        return transaction;
    }
}


export class AccountBalance {
    private _userId: number;
    private _transactions: ITransaction[];

    constructor(userId: number) {
        this._userId = userId;
        this._transactions = [];
    }

    public AddTransaction(transaction: ITransaction) {
        this._transactions.push(transaction);
    }
}

export class AccountBalanceRepository {

    private readonly _accountBalances: Map<number, AccountBalance>
    constructor() {
        this._accountBalances = new Map<number, AccountBalance>();
    }

    public Get(userId: number) {
        return this._accountBalances.get(userId) ?? new AccountBalance(userId);
    }
}

export interface ITransaction {
    amount: number;
    readonly userId: number;
    Apply(transactionAmount: number): void;
}

export abstract class Transaction implements ITransaction {
    protected _amount: number;
    private _userId: number;

    get amount() {
        return this._amount;
    }

    set amount(amount: number) {
        this._amount = amount;
    }

    public get userId(): number {
        return this._userId;
    }

    constructor(userId: number, amount: number) {
        this._userId = userId;
        this._amount = amount;
    }

    abstract Apply(transactionAmount: number): void;
}

export class DebitTransaction extends Transaction {
    private _creditToUserId: number;

    get creditToUserId() {
        return this._creditToUserId;
    }

    set creditToUserId(creditToUserId: number) {
        this._creditToUserId = creditToUserId;
    }

    constructor(userId: number, amount: number) {
        super(userId, amount);
    }

    public Apply(debitAmount: number): void {
        this._amount += debitAmount;
    }
}

export class CreditTransaction extends Transaction {
    constructor(userId: number, netAmount: number) {
        super(userId, netAmount);
    }

    public Apply(creditAmount: number): void {
        this._amount -= creditAmount;
    }
}

// Null object pattern
export class NullTransaction extends Transaction {
    constructor() {
        super(0, 0);
    }

    public Apply(creditAmount: number): void {
        // Do nothing
    }
}

export class TransactionManager {
    constructor() {
    }
}

export class Expense {
    private readonly _amountPaid: number;
    private readonly _paidBy: number;
    private _amountToPay: number;

    get amountPaid() {
        return this._amountPaid;
    }

    get paidBy() {
        return this._paidBy;
    }

    get amount() {
        return this._amountToPay;
    }

    public set amount(netChange: number) {
        this._amountToPay = netChange;
    }

    constructor(amountPaid: number, userId: number) {
        this._amountPaid = amountPaid;
        this._paidBy = userId;
    }
}

export interface ITransactionManager {
    createTransaction(userId: number, amount: number): ITransaction;
    hasTransaction(): boolean;
    applyAmount(transactionAmount: number): void;
    TakeOne(): ITransaction;
}

export enum GroupExpenseSharingType {
    SplitEqualByAverage = 1
}

export function generateData(numberToSplit: number, numOfSplits: number, minNumber: number | undefined = undefined) {
    const iterations = numOfSplits;
    const parts = [];

    // we'll use this to store what's left on each iteration
    let remainder = numberToSplit; let part = minNumber;

    for (let i = 1; i <= iterations; i += 1) {
        // if it's the last iteration, we should just use whatever
        // is left after removing all the other random numbers
        // from total
        if (i === iterations) {
            parts.push(remainder);
            break;
        }

        if (i === 1) {
            part = minNumber ?? Math.round(Math.random() * remainder);
        }
        else {
            // every time we loop, a random number is created.
            // on the first iteration, the remainder is still total
            part = Math.round(Math.random() * remainder);
        }

        parts.push(part);

        // we must store how much is left after our random numbers
        // are deducted from our total. we will use the lower number
        // to calculate the next random number
        remainder -= part;
    }
    return parts;
}