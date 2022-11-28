// Question: Bill Splitter

// A group of friends went for a meal together. Each person bought and paid for a different dish to share. At the end of the day, they would want to split the bill equally between them.

// Write a program to split the bill equally between each person and display how much each person would have to pay to one another.

// Sample input:
// An array of [0, 12, 12]

// Output print:
// person 1 needs to pay person 2 $4
// person 1 needs to pay person 3 $4

import { Expense, DebitTransaction, ITransactionManager, ITransaction, GroupExpenseSharingType } from './lib';
import { CreditTransactionManager, DebitTransactionManager } from './lib';

type SumAndAverage = {
    sum: number;
    average: number;
};
export class GroupExpense {
    private _expenses: Expense[];
    private _sum: number;
    private _transactionManager: TransactionProcessManager;
    private _sharingType: GroupExpenseSharingType;
    private _average: number;

    get expenseSharingType() {
        return this._sharingType;
    }

    get expenses() {
        return this._expenses;
    }

    get sum() {
        return this._sum;
    }

    get average() {
        return this._average;
    }

    constructor(transactionManager: TransactionProcessManager) {
        this._expenses = [];
        this._sum = 0;
        this._transactionManager = transactionManager;
    }

    // Can be use to decouple sharing type/strategy
    // constructor(transactionManager: TransactionProcessManager, sharingType: GroupExpenseSharingType) {
    //     this._expenses = [];
    //     this._sum = 0;
    //     this._sharingType = sharingType;
    // this._transactionManager = transactionManager;
    // }

    public addExpense(expense: Expense): void {
        console.log(`person ${expense.paidBy} paid $${expense.amountPaid}`);
        this._expenses.push(expense);
    }

    public *debits(): Iterable<ITransaction> {
        this.createTxs();

        yield* this.getDebits();
    }

    private createTxs() {
        const sumAndAverage: SumAndAverage = this.getTotalAndAverage();

        for (const expense of this._expenses) {
            const debitOrCreditAmount = expense.amountPaid - sumAndAverage.average;
            const isDebit = debitOrCreditAmount < 0;
            this._transactionManager.create(isDebit).createTransaction(expense.paidBy, debitOrCreditAmount);
        }
    }

    private *getDebits(): Iterable<ITransaction> {
        while (this._transactionManager.hasTransaction()) {
            const debitTransaction = this._transactionManager.TakeDebit();
            const creditTransaction = this._transactionManager.TakeCredit();

            let debt = Math.min(-debitTransaction.amount, creditTransaction.amount);

            let debitTx = new DebitTransaction(debitTransaction.userId, debt);
            debitTx.creditToUserId = creditTransaction.userId;

            this._transactionManager.applyDebitAndCredit(debt);

            yield debitTx;
        }
    }

    private getTotalAndAverage() {   
        const sumAndAverage: SumAndAverage = this._expenses.reduce((prev: SumAndAverage, curr: Expense, idx) => {
            return { sum: prev.sum + curr.amountPaid, average: prev.average + (curr.amountPaid - prev.average) / (idx + 1) };
        }, { sum: 0, average: 0 });

        this._sum = sumAndAverage.sum;
        this._average = sumAndAverage.average;

        console.log("sum " + sumAndAverage.sum);
        console.log("ave " + sumAndAverage.average);
        return sumAndAverage;
    }
}

class TransactionProcessManager {
    private _debitTxManager: ITransactionManager;
    private _creditTxManager: ITransactionManager;

    constructor(debitTxCreator: ITransactionManager, creditTxCreator: ITransactionManager) {
        this._debitTxManager = debitTxCreator;
        this._creditTxManager = creditTxCreator;
    }

    TakeCredit(): ITransaction {
        return this._creditTxManager.TakeOne();
    }

    TakeDebit(): ITransaction {
        return this._debitTxManager.TakeOne();
    }

    public applyDebitAndCredit(transactionAmount: number) {
        this._debitTxManager.applyAmount(transactionAmount);
        this._creditTxManager.applyAmount(transactionAmount);
    }

    public hasTransaction(): boolean {
        return this._debitTxManager.hasTransaction() && this._creditTxManager.hasTransaction()
    }

    public create(isDebit: boolean): ITransactionManager {
        if (isDebit) {
            return this._debitTxManager;
        }
        else {
            return this._creditTxManager;
        }
    }
}

function heap_oop_split_bills(arr: number[]): GroupExpense {
    const groupExpense = new GroupExpense(new TransactionProcessManager(new DebitTransactionManager(), new CreditTransactionManager()));

    let idx = 0;
    arr.forEach(expense => {
        idx++;
        groupExpense.addExpense(new Expense(expense, idx));
    });

    for (const tx of groupExpense.debits()) {
        console.log(`person ${tx.userId} owes person ${(tx as DebitTransaction).creditToUserId} $${tx.amount}`);
    }
    
    return groupExpense;
}

// const expenses = generateData(1000, 4, 10);     
// let result: GroupExpense = heap_oop_split_bills(expenses); 
// debitSuccess(result, expenses); 
 
// function debitSuccess(result: GroupExpense, parts: number[]) {
//     let debits: DebitTransaction[] = Array.from(result.debits() as DebitTransaction[]);
//     let successfullyDebited = false;
//     successfullyDebited = parts.map((shares, idx) => checkIfAmountDebitIsCorrect(result, debits, idx, shares)).reduce(x => x);
//     return successfullyDebited;
// }

// function checkIfAmountDebitIsCorrect(result: GroupExpense, debits: DebitTransaction[], idx: number, shares: number): boolean {
//     let totalDebits = debits.filter(x => x.userId === idx + 1 && x.amount > 0, 0).map(x => x.amount).reduce((a, b) => a + b, 0);
//     // Average - Debit should be equal to the amount paid/shared 
//     return (totalDebits == 0 || result.average - totalDebits == shares);
// }

// heap_oop_split_bills([0, 12, 12]);

// heap_oop_split_bills([29, 55, 12, 3, 1])
// heap_oop_split_bills([10, 4, 4, 5, 10, 25, 35, 50, 0, 2]);