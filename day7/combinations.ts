import { all } from 'axios';
import { read } from 'fs';
import * as fsPromise from 'fs/promises';
import { parse } from 'path';

async function readInput(fileName : string) : Promise<number[][]> {
  var parsedInput: number[][] = [];
  const file = await fsPromise.open(fileName, 'r');
  for await (const line of file.readLines()) {
    let step1 = line.split(': ')
    let step2 = step1[1].split(' ')
    let numbers = [...[step1[0]].map(Number), ...step2.map(Number)]
    parsedInput.push(numbers);
  }
  file.close();
  return parsedInput;
}

function generateCombinations(n : number, base : number) : number[][] {
  let combinations : number[][] = []
  for (let i = 0; i < Math.pow(base, n); i++) {
    const binaryString = (i >>> 0).toString(base).padStart(n, '0');
    combinations.push(binaryString.split('').map(Number))
  }
  return combinations
}

function getPossibleSolutions(equations : number[][], allowConcat : boolean) : number[] {
  let realSolutions : number[] = []
  let base = allowConcat ? 3 : 2
  for (let equation of equations) {
    let combinations = generateCombinations(equation.length - 2, base);
    let isPossible = false
    for (let comb of combinations) {
      if (isPossible) continue
      let testEquation = [...equation]
      for (let i = 1; i < testEquation.length-1; i++) {
        if (comb[i-1] == 0) {
          testEquation[i+1] = testEquation[i] + testEquation[i+1]
        } else if (comb[i-1] == 1) {
          testEquation[i+1] = testEquation[i] * testEquation[i+1]
        } else {
          testEquation[i+1] = [testEquation[i].toString().concat(testEquation[i+1].toString())].map(Number)[0]
        }
      }
      if (testEquation[testEquation.length-1] == testEquation[0]) isPossible = true;
    }
    if (isPossible) realSolutions.push(equation[0])
  }
  return realSolutions;
}

readInput("input.txt").then((data) => {
  let solutions = getPossibleSolutions(data, false);
  console.log(solutions)
  let sum = solutions.reduce((total, number) => total + number)
  //Answer > 1988201
  console.log(sum)

  let concatSolutions = getPossibleSolutions(data, true);
  let concatSum = concatSolutions.reduce((total, number) => total + number)
  console.log(concatSum)
})