import rewire from "rewire"
const heap_oop_split_billsFile = rewire("../built/src/heap_oop_split_bills")
const heap_oop_split_bills = heap_oop_split_billsFile.__get__("heap_oop_split_bills")
// @ponicode
describe("heap_oop_split_bills", () => {
    test("1", () => {
        let result: any = heap_oop_split_bills([0, 12, 12])
        expect(result).toBe(undefined)
    })

    test("2", () => {
        let result: any = heap_oop_split_bills([2, 8, 8])
        expect(result).toBe(undefined)
    })

    test("3", () => {
        let result: any = heap_oop_split_bills([10, 4, 4, 5, 10, 25, 35, 50, 0, 2])
        expect(result).toBe(undefined)
    })
})


// heap_oop_split_bills([10, 4, 4, 5, 10, 25, 35, 50, 0, 2, 1, 0, 100, 65, 2, 10, 11, 15, 20, 100, 35, 20, 12, 10, 1]);
// heap_oop_split_bills([10, 4, 4, 5, 10, 25, 35, 50, 0, 2]);
// heap_oop_split_bills([0, 12, 12]);

// splitBills([400, 1000, 100, 900]);
// splitBills([10, 4, 4, 5, 10, 25, 35, 50, 0, 2]);
// splitBill([0, 12, 12]);
// splitBill([2, 8, 8]);
// splitBill([0, 20, 4, 24]);  
