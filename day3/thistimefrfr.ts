import * as fsPromise from 'fs/promises';

const regex = /mul\(\d?\d?\d?,\d?\d?\d?\)/gm;
const funcRegex = /(?<=\D)\d+/gm
const condRegex = /mul\(\d?\d?\d?,\d?\d?\d?\)|do\(\)|don\'t\(\)/gm;

async function readInput(fileName : string) : Promise<String[]> {
  var parsedInput: String[] = [];
  const file = await fsPromise.open(fileName, 'r');
  for await (const line of file.readLines()) {
    parsedInput.push(line);
  }
  
  file.close();
  return parsedInput;
}


function matchMult(array : String[]) : number[][] {
  let numbers : number[][] = [];
  for (let i = 0; i < array.length; i++) {
    console.log(array[i])
    let matches = array[i].match(regex);
    console.log(matches)
    if (matches) {
      for (const match of matches) {
        const matchedNumbers = match.match(funcRegex)?.map(Number);
        if (matchedNumbers) {
          numbers.push(matchedNumbers);
        }
      }
    }
  }
  return numbers;
}

function matchConditionalMult(array : String[]) : number[][] {
  let numbers : number[][] = [];
  let condition : boolean = true;
  for (let i = 0; i < array.length; i++) {
    let matches = array[i].match(condRegex);
    if (matches) for (let match of matches) {
      if (match.startsWith("do(")) {condition = true; continue;}
      if (match.startsWith("don't")) {condition = false; continue;}
      if (condition) {
        const matchedNumbers = match.match(funcRegex)?.map(Number);
        if (matchedNumbers) numbers.push(matchedNumbers)
      }
    }
  }
  return numbers;

}

readInput("input.txt").then(data => {
    let sum : number = 0;
    let conditionalSum = 0;

    let numbers = matchMult(data);
    let someNumbers = matchConditionalMult(data);

    numbers.forEach((pair) => sum += pair[0] * pair[1])
    someNumbers.forEach((pair) => conditionalSum += pair[0] * pair[1])


    console.log(sum)
    console.log(conditionalSum)
  }
)