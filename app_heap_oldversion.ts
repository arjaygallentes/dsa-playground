import { Expense } from './lib';
import { PriorityQueue } from 'js-sdsl';

let debtQ: PriorityQueue<Expense>;
let creditQ: PriorityQueue<Expense>;

function using_heap_old_version(expenses: Array<number>): void {
    console.log(`no. of persons ${expenses.length}`);

    // get total
    let sum: number = expenses.reduce((x, y) => x + y); 

    // get average
    let averageBillToPay = sum / expenses.length;

    // Add index
    let arrIndexed = expenses.map((e, idx) => [idx + 1, e]);

    creditQ = new PriorityQueue<Expense>(arrIndexed.filter(x => (x[1] - averageBillToPay) > 0)
        .map(e => {
            const expense = new Expense(e[1], e[0]);
            expense.amount = e[1] - averageBillToPay;
        return expense;
    }, (a: Expense, b: Expense) => b.amount - a.amount));

    debtQ = new PriorityQueue<Expense>(arrIndexed.filter(x => (x[1] - averageBillToPay) < 0)
        .map(e => {
            const expense = new Expense(e[1], e[0]);
            expense.amount = e[1] - averageBillToPay;
        return expense;
    }, (a: Expense, b: Expense) => a.amount - b.amount));

    while (!debtQ.empty() && !creditQ.empty()) {
        const debit = debtQ.pop();
        const credit = creditQ.pop();
        if (debit && credit) {
            const debitAmount = debit.amount;
            const creditAmount = credit.amount;

            let netChangeAmount = Math.min(-debitAmount, creditAmount);

            console.log(`person ${debit.paidBy} owes person ${credit.paidBy} $${netChangeAmount}`);

            debit.amount += netChangeAmount;
            credit.amount -= netChangeAmount;

            if (debit.amount !== 0) { 
                debtQ.push(debit); 
            }

            if (credit.amount !== 0) {
                creditQ.push(credit);
            }
        }
    }
}

// using_heap_old_version([0, 12, 12]);
// using_heap_old_version([10, 4, 4, 5, 10, 25, 35, 50, 0, 2]);