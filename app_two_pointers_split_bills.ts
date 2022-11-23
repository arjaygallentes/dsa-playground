function two_pointers_split_bills(bills: number[]): void {
    console.log(`no. of persons ${bills.length}`);

    const billShares = calculateGroupBillShares(bills);

    // Use sliding window or two pointer pattern to iterate
    let left = 0;
    let right = bills.length - 1;
    let debt;

    while (left < right) {
        debt = Math.min(-(billShares[left][1]), billShares[right][1]);
        billShares[left][1] += debt;
        billShares[right][1] -= debt;

        console.log(`person ${billShares[left][0]} owes person ${billShares[right][0]} $${debt}`);
        if (billShares[left][1] === 0) {
            left++;
        }

        if (billShares[right][1] === 0) {
            right--;
        }
    }
}

function calculateGroupBillShares(billsPaid: number[]): number[][] {

    // get total
    let sum: number = billsPaid.reduce((x, y) => x + y);

    // get average
    let averageBillToPay = sum / billsPaid.length;

    console.log("total is: " + sum);
    console.log("average is: " + averageBillToPay);

    return billsPaid
        .map((amountPaid, index) => [index + 1, amountPaid - averageBillToPay])
        .sort((a, b) => a[1] - b[1]);
}

two_pointers_split_bills([0, 12, 12]);
// two_pointers_split_bills([10, 4, 4, 5, 10, 25, 35, 50, 0, 2]);
// two_pointers_split_bills([10, 4, 4, 5, 10, 25, 35, 50, 0, 2, 1, 0, 100, 65, 2, 10, 11, 15, 20, 100, 35, 20, 12, 10, 1]);