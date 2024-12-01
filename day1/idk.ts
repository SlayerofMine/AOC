import * as fsPromise from 'fs/promises'; 

async function readInput(fileName : string) : Promise<number[][]> {
  var parsedInput: number[][] = [[],[]];
  const file = await fsPromise.open(fileName, 'r');
  for await (const line of file.readLines()) {
    let numbers = line.split('   ');
    parsedInput[0].push(Number(numbers[0]));
    parsedInput[1].push(Number(numbers[1]));
  }
  file.close();
  return parsedInput;
}

function sortArray(array : number[]) : number[] {
  return array.sort((a, b) => a - b);
}

function countAppearance(array : number[]) : number[] {
  var appearances : number[] = []
  for (const num of array) {
    appearances[num] = appearances[num] ? appearances[num] + 1 : 1
  }
  return appearances;
}

readInput('./input.txt').then((data) => {
  var diff : number = 0;
  var countDiff : number = 0;

  data.forEach((array, idx) => {
    data[idx] = sortArray(array);
  });
  
  for (let i = 0; i < data[0].length; i++) {
    diff += Math.abs(data[0][i] - data[1][i]);
  }
  var appearances = countAppearance(data[1]);
  for (let i = 0; i < data[0].length; i++) {
    countDiff += appearances[data[0][i]] ? data[0][i] * appearances[data[0][i]] : 0;
  }
  
  console.log(diff);
  console.log(countDiff);
});


