import { deepEqual, equal } from 'assert';
import { Dir, read } from 'fs';
import * as fsPromise from 'fs/promises';
import { off } from 'process';

type Security = {
    x : number
    y : number
    dir : Direction
}

enum Direction {
    U,
    R,
    D,
    L
}

function getSecutity(lab : String[][]) {
    let officer : Security = {x : -1, y : -1, dir : 0}
    for (let i = 0; i < lab.length; i++) {
        for (let j = 0; j < lab[0].length; j++) {
            switch (lab[i][j]) {
                case "^":
                    officer.dir = 0;
                    break
                case ">":
                    officer.dir = 1;
                    break
                case "v":
                    officer.dir = 2;
                    break
                case "<":
                    officer.dir = 3;
                    break
                default:
                    continue;
            }
            officer.x = j;
            officer.y = i;
        }
    }
    return officer;
}

function stepTurn(lab : String[][], tutel : Security) : String[][] {
    lab[tutel.y][tutel.x] = "X";
    let prevLocation : Security = {x : tutel.x, y : tutel.y, dir : tutel.dir}
    switch (tutel.dir) {
        case Direction.U:
            tutel.y += -1
            break
        case Direction.R:
            tutel.x += 1
            break
        case Direction.D:
            tutel.y += 1
            break
        case Direction.L:
            tutel.x += -1
            break
    }
    if (tutel.x < 0 || tutel.y < 0 || tutel.x >= lab[0].length || tutel.y >= lab.length) {
        return lab;
    }
    if (lab[tutel.y][tutel.x] == "#") {
        tutel.dir = (tutel.dir + 1) % 4
        tutel.x = prevLocation.x
        tutel.y = prevLocation.y
    }
    switch (tutel.dir) {
        case Direction.U:
            lab[tutel.y][tutel.x] = "^"
            break
        case Direction.R:
            lab[tutel.y][tutel.x] = ">"
            break
        case Direction.D:
            lab[tutel.y][tutel.x] = "v"
            break
        case Direction.L:
            lab[tutel.y][tutel.x] = "<"
            break
    }
    return lab;
}

function countTiles(lab : String[][]) : number {
    let tiles = 0
    for (let line of lab) {
        for (let char of line) {
            if (char == "X") tiles++
        }
    }
    return tiles;
}

function checkLoop(lab : String[][], tutel : Security) {
    let securityFound = (tutel.x != -1);
    let takenSteps : Security[] = [];
    while (securityFound) {
        takenSteps.push({x : tutel.x, y : tutel.y, dir : tutel.dir});
        lab = stepTurn(lab, tutel);
        tutel = getSecutity(lab);
        if (tutel.x == -1) securityFound = false;
        for (let step of takenSteps) {
            if (step.x == tutel.x && step.y == tutel.y && step.dir == tutel.dir) {
                return true;
            }
        }
    }
    return false
}

async function readInput(fileName : string) : Promise<String[][]> {
    var parsedInput: String[][] = [];
    const file = await fsPromise.open(fileName, 'r');
    for await (const line of file.readLines()) {
      let chars = line.split('');
      parsedInput.push(chars);
    }
    file.close();
    return parsedInput;
}

readInput("input.txt").then((data) => {
    let securityFound = true;
    let lab = data.map(arr => arr.slice());
    let security = getSecutity(lab);
    console.log(security)

    while (securityFound) {
        lab = stepTurn(lab, security);
        security = getSecutity(lab);
        if (security.x == -1) securityFound = false;
    }

    
    let uniqueTiles = countTiles(lab);
    console.log(uniqueTiles)


    
    let loopPossibilities = 0;
    let cycles = 0;
    
    for (let i = 0; i < lab.length; i++) {
        for (let j = 0; j < lab[0].length; j++){
            if (lab[i][j] == "X") {
                let lab2 = data.map(arr => arr.slice());
                lab2[i][j] = "#"
                let security2 = getSecutity(lab2);
                if (checkLoop(lab2, security2)) loopPossibilities++;
                console.log("%d     %d/%d", loopPossibilities, ++cycles, uniqueTiles)
            }
        }
    }
    
    console.log(loopPossibilities)

})