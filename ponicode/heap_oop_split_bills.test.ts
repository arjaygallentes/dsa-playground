import rewire from "rewire"
import { DebitTransaction, AccountBalanceRepository, AccountBalance, generateData } from '../lib';
import { GroupExpense } from "../heap_oop_split_bills";
const heap_oop_split_billsFile = rewire("../built/src/heap_oop_split_bills")
const heap_oop_split_bills = heap_oop_split_billsFile.__get__("heap_oop_split_bills")
// @ponicode
describe("heap_oop_split_bills", () => {
    test("1", () => {
        const expenses = generateData(24, 3);
        let result: GroupExpense = heap_oop_split_bills(expenses); 
        expect(debitSuccess(result, expenses)).toBe(true);
    })

    test("2", () => {
        const expenses = generateData(100, 5);
        let result: GroupExpense = heap_oop_split_bills(expenses); 
        expect(debitSuccess(result, expenses)).toBe(true);
    })

    test("3", () => {
        const expenses = generateData(1000, 5, 0); 
        let result: GroupExpense = heap_oop_split_bills(expenses); 
        expect(debitSuccess(result, expenses)).toBe(true);
    })

    test("4", () => {
        const expenses = generateData(1000, 10, 10); 
        let result: GroupExpense = heap_oop_split_bills(expenses); 
        expect(debitSuccess(result, expenses)).toBe(true);
    })

    test("5", () => {
        const expenses = generateData(100, 3); 
        let result: GroupExpense = heap_oop_split_bills(expenses); 
        expect(debitSuccess(result, expenses)).toBe(true);
    })
})

function debitSuccess(result: GroupExpense, parts: number[]) {
    let debits: DebitTransaction[] = Array.from(result.debits() as DebitTransaction[]);
    let successfullyDebited = false;
    successfullyDebited = parts.map((shares, idx) => checkIfAmountDebitIsCorrect(result, debits, idx, shares)).reduce(x => x);
    return successfullyDebited;
}

function checkIfAmountDebitIsCorrect(result: GroupExpense, debits: DebitTransaction[], idx: number, shares: number): boolean {
    let totalDebits = debits.filter(x => x.userId === idx + 1 && x.amount > 0, 0).map(x => x.amount).reduce((a, b) => a + b, 0);
    // Average - Debit should be equal to the amount paid/shared 
    return (totalDebits === 0 || result.average - totalDebits == shares);
}
// heap_oop_split_bills([10, 4, 4, 5, 10, 25, 35, 50, 0, 2, 1, 0, 100, 65, 2, 10, 11, 15, 20, 100, 35, 20, 12, 10, 1]);
// heap_oop_split_bills([10, 4, 4, 5, 10, 25, 35, 50, 0, 2]);
// heap_oop_split_bills([0, 12, 12]);
// heap_oop_split_bills([400, 1000, 100, 900]);
// heap_oop_split_bills([2, 8, 8]);
// heap_oop_split_bills([0, 20, 4, 24]);  
