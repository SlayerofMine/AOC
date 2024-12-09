import { read } from 'fs';
import * as fsPromise from 'fs/promises';
import { parse } from 'path';

async function readInput(fileName : string) : Promise<number[][][]> {
    var parsedInput: number[][][] = [[],[]];
    const file = await fsPromise.open(fileName, 'r');
    for await (const line of file.readLines()) {
        if (line.includes("|")) {
            let rules = line.split('|').map(Number)
            parsedInput[0].push(rules)
        }
        if (line.includes(",")) {
            let sequence = line.split(',').map(Number)
            parsedInput[1].push(sequence)
        }
    }
    file.close();
    return parsedInput;
}

function parseRules(array : number[][]) : number[][] {
    let rules : number[][] = []
    for (let i = 0; i < array.length; i++) {
        if (rules[array[i][1]]) {rules[array[i][1]].push(array[i][0])}
        else rules[array[i][1]] = [array[i][0]];
    }
    return rules;
}

function filterSequences(rules : number[][], sequences : number[][], invert : boolean) : number[][] {
    let correctSequences : number[][] = []

    for (let i = 0; i < sequences.length; i++) {
        let faulty = false;
        for (let j = 0; j < sequences[i].length && !faulty; j++) {
            let currentNumber = sequences[i][j]
            let arrayToTest = sequences[i].slice(j)

            if (!rules[currentNumber]) continue;
            if (rules[currentNumber].some((number) => arrayToTest.includes(number))) faulty = true;
            //if (rules[currentNumber].some((number) => (sequences[i].includes(number) && sequences[i].indexOf(number) > j))) faulty = true;
                
        }
        if (!faulty && !invert) correctSequences.push(sequences[i])
        if (faulty && invert) correctSequences.push(sequences[i])
    }

    return correctSequences

}

function fixSequences(rules : number[][], sequences : number[][]) : number[][] {
    for (let sequence of sequences) {
        for (let i = 0; i < sequence.length; i++) {
            let currentNumber = sequence[i];
            let maxWrongIdx = i;
            for (let j = i+1; j < sequence.length; j++) {
                if (rules[currentNumber].includes(sequence[j])) maxWrongIdx = j;
            }
            let temp = sequence[i]
            sequence[i] = sequence[maxWrongIdx]
            sequence[maxWrongIdx] = temp
            if (maxWrongIdx != i) i--;
        }
    }

    return sequences;
}

readInput("input.txt").then((data) => {
    let comesAfterRules = parseRules(data[0]);
    let sequences = data[1];
    
    let correctSequences = filterSequences(comesAfterRules, sequences, false)
    let wrongSequences = filterSequences(comesAfterRules, sequences, true)

    let fixedSequences = fixSequences(comesAfterRules, wrongSequences)

    console.log(fixedSequences)

    


    //5561 < Answer < 6498
    let correctSum = 0;
    let correctedSum = 0;

    for (let sequence of correctSequences) {
        correctSum += sequence[Math.round((sequence.length-1)/2)]
    }

    for (let sequence of fixedSequences) {
      correctedSum += sequence[Math.round((sequence.length-1)/2)]
    }

    
    console.log(correctSum);
    console.log(correctedSum);
})