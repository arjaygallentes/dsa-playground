import Heap from 'heap-js';
import { Expense } from "./model";

const DebtPriorityComparator = (a: Expense, b: Expense) => a.amount - b.amount; // priority by highest debt
const CreditPriorityComparator = (a: Expense, b: Expense) => b.amount - a.amount; // priority by highest credit

let _minHeapDebt: Heap<Expense> = new Heap(DebtPriorityComparator);
let _maxHeapCredit: Heap<Expense> = new Heap(CreditPriorityComparator);

function using_heap_old_version(expenses: Array<number>): void {
    console.log(`no. of persons ${expenses.length}`);

    // get total
    let sum: number = expenses.reduce((x, y) => x + y);

    // get average
    let averageBillToPay = sum / expenses.length;

    let idx: number = 0;
    expenses.forEach(bill => {
        const netChangeAmount = bill - averageBillToPay;

        if (netChangeAmount > 0) {
            _maxHeapCredit.push(new Expense(bill, (idx + 1), netChangeAmount));
        } else if (netChangeAmount < 0) {
            _minHeapDebt.push(new Expense(bill, (idx + 1), netChangeAmount));
        }

        idx++;
    });

    while (!_minHeapDebt.isEmpty() && !_maxHeapCredit.isEmpty()) {
        const debit = _minHeapDebt.pop();
        const credit = _maxHeapCredit.pop();

        if (debit && credit) {
            const debitAmount = debit.amount;
            const creditAmount = credit.amount;

            let netChangeAmount = Math.min(-debitAmount, creditAmount);

            console.log(`person ${debit.paidBy} owes person ${credit.paidBy} $${netChangeAmount}`);

            debit.amount += netChangeAmount;
            credit.amount -= netChangeAmount;

            if (debitAmount !== 0) {
                _minHeapDebt.add(debit);
            }

            if (credit.amount !== 0) {
                _maxHeapCredit.add(credit);
            }
        }
    }
}

// using_heap_old_version([10, 4, 4, 5, 10, 25, 35, 50, 0, 2]);