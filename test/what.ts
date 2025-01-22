/*
1
2 2
3 4 3
4 6 6 4
5 8 9 8 5


*/

import { fileURLToPath } from "url";

function generateSieve(n : number) : number[][] {
    let sieve : number[][] = [];
    for (let i = 1; i <= n+1; i++) {
        for (let j = 1; j+i <= n+1; j++) {
            if (typeof sieve[j+i] === 'undefined') sieve[j+i] = [];
            sieve[j+i].push(i*j);
        }
    }

    return sieve.slice(2)
}

function generatefilteredSieve(n : number) : number[][] {
    let sieve = generateSieve(n);
    for (let i = n; i > 0; i--) {
        let isPrime = !primeCheck.some((row, idx) => (row.indexOf(i) != -1 && idx+1 < i))
        
        if (!isPrime) {
            sieve = sieve.map((row) => (row.filter((_, idx) => idx !== i-1)))
            sieve.splice(i-1, 1)
        }
    }


    return sieve;
}

function printSieveAligned(sieve : number[][]) : string {
    //dynamic padding for max number
    let max = Math.max(...sieve.map((row) => Math.max(...row)))
    let pad = max.toString().length

    let sieveStr = sieve.map((row) => row.map((num) => num.toString().padStart(pad)).join(" ")).join("\n")
    console.log(sieveStr)
    return sieveStr;
}


let n = 25;

let primeCheck = generateSieve(n);

for (let i = 1; i <= n; i++) {
    let isPrime = !primeCheck.some((row, idx) => (row.includes(i) && idx+1 < i))
}

let filteredSieve = generatefilteredSieve(n)

// for (let zahl of filteredSieve) {
//     console.log(zahl)
// }

printSieveAligned(primeCheck)

