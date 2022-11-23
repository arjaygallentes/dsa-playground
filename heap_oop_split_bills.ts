// Question: Bill Splitter

// A group of friends went for a meal together. Each person bought and paid for a different dish to share. At the end of the day, they would want to split the bill equally between them.

// Write a program to split the bill equally between each person and display how much each person would have to pay to one another.

// Sample input:
// An array of [0, 12, 12]

// Output print:
// person 1 needs to pay person 2 $4
// person 1 needs to pay person 3 $4

// import { two_pointers_split_bills, calculateGroupBillShares } from "./mod_two_pointers_split_bills"
// import { using_heap_old_version } from "./mod_using_heap_oldversion"
import { Expense, Transaction, DebitTransaction, CreditTransaction, NullTransaction, AccountBalance, ITransactionManager, AccountBalanceRepository, ITransaction } from './model';
import { CreditTransactionManager, DebitTransactionManager } from './lib';

class GroupExpense {
    private _expenses: Expense[];
    private _sum: number;
    private _transactionManager: TransactionProcessManager;
    private _processedTransactions: Transaction[] = [];

    get expenses() {
        return this._expenses;
    }

    get sum() {
        return this._sum;
    }

    get average() {
        return this.sum / this._expenses.length;
    }

    constructor(transactionManager: TransactionProcessManager) {
        this._expenses = [];
        this._sum = 0;
        this._transactionManager = transactionManager;
    }

    public addExpense(expense: Expense): void {
        this._sum += expense.amountPaid;

        this._expenses.push(expense);
    }

    public createTransactions(): DebitTransaction[] {
        console.log("sum is: " + this.sum);
        console.log("average is: " + this.average);

        this._expenses.forEach(expense => {
            const debitOrCreditAmount = expense.amountPaid - this.average;
            const isDebit = debitOrCreditAmount < 0;

            console.log(`person ${expense.paidBy} paid $${expense.amountPaid}`);
            this._transactionManager.create(isDebit).createTransaction(expense.paidBy, debitOrCreditAmount)
        });

        console.log(`\ntransaction started.`);
        return this.createOptimized();
    }

    private createOptimized(): DebitTransaction[]  {
        let processedTxs: DebitTransaction[] = [];
        while (this._transactionManager.hasTransaction()) {
            const debitTransaction = this._transactionManager.TakeDebit();
            const creditTransaction = this._transactionManager.TakeCredit();

            let debt = Math.min(-debitTransaction.amount, creditTransaction.amount);

            const tx = debitTransaction as DebitTransaction;
            tx.creditToUserId = creditTransaction.userId;
            this.AddToTransactionCompleted(processedTxs, tx, tx.creditToUserId);
            
            this._transactionManager.applyDebitOrCredit(debt);
        }

        processedTxs.forEach(tx => {
            console.log(`person ${tx.userId} owes person ${(tx as DebitTransaction).creditToUserId} $${tx.amount}`);
        });

        return processedTxs;

        // console.log(`transaction completed. \n`);
    }

    private AddToTransactionCompleted(txs: DebitTransaction[], tx: DebitTransaction, creditTo: number) {
        let debitTx = new DebitTransaction(tx.userId, tx.amount);
        debitTx.creditToUserId = creditTo;

        // console.log(`person ${tx.userId} owes person ${tx.creditToUserId} $${tx.amount}`);
        txs.push(debitTx); 
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

    public applyDebitOrCredit(transactionAmount: number) {
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

function heap_oop_split_bills(arr: number[]) {
    const groupExpense = new GroupExpense(new TransactionProcessManager(new DebitTransactionManager(), new CreditTransactionManager()));

    let idx = 0;
    arr.forEach(expense => {
        idx++;
        groupExpense.addExpense(new Expense(expense, idx, 0));
    });

    groupExpense.createTransactions();
}

heap_oop_split_bills([0, 12, 12]);