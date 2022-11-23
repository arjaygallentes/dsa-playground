
export class AccountBalance {
    private _userId: number;
    private _transactions: ITransaction[];

    constructor(userId: number) {
        this._userId = userId;
        this._transactions = [];
    }

    /**
     * AddTransaction
     */
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

export interface ITransaction
{
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

    constructor(amountPaid: number, userId: number, amountToPay: number) {
        this._amountPaid = amountPaid;
        this._paidBy = userId;
        this._amountToPay = amountToPay;
    }
}

export interface ITransactionManager {
    createTransaction(userId: number, amount: number): ITransaction;
    hasTransaction(): boolean;
    applyAmount(transactionAmount: number): void;
    TakeOne(): ITransaction;
}