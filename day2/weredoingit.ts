import * as fsPromise from 'fs/promises'; 
import { get } from 'http';
import { parse } from 'path';
import { arrayBuffer } from 'stream/consumers';

enum Gradient {
  asc = 1,
  desc = -1,
  flat
}

async function readInput(fileName : string) : Promise<number[][]> {
  var parsedInput: number[][] = [];
  const file = await fsPromise.open(fileName, 'r');
  for await (const line of file.readLines()) {
    let numbers = line.split(' ').map(Number);
    parsedInput.push(numbers);
  }
  file.close();
  return parsedInput;
}

function getGradient(array : number[]) : Gradient {
  if (array[array.length-1] - array[0] > 0) return Gradient.asc;
  if (array[array.length-1] - array[0] < 0) return Gradient.desc;
  return Gradient.flat
}

function checkSafety(array : number[], dir : Gradient) : boolean {
  if (dir == Gradient.flat) return false;

  for (let i = 0; i < array.length-1; i++) {
    let dy = array[i+1] - array[i]
    if (Math.sign(dy) != dir) return false;
    if (Math.abs(dy) <= 0 || Math.abs(dy) > 3) return false;
  } 
  return true;
}

function checkDampenedSafety(array : number[], dir : Gradient) : boolean {
  let isSafe : boolean = false;
  const originalArr = Object.assign([], array);

  if (checkSafety(originalArr, dir)) isSafe = true;
  
  for (let i = 0; i < array.length; i++) {
    const array = Object.assign([], originalArr);
    array.splice(i, 1);
    if (checkSafety(array, dir)) isSafe = true;
  } 
  return isSafe;
}

readInput("input.txt").then(data => {
  let isSafe : number = 0;
  let isSemiSafe : number = 0;
  for (let i = 0; i < data.length; i++) {
    let dir = getGradient(data[i])
    if (checkSafety(data[i], dir)) {isSafe++;}
    if (checkDampenedSafety(data[i], dir)) {isSemiSafe++;}
  }
  console.log(isSafe);
  console.log(isSemiSafe);
})