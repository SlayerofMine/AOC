import * as fsPromise from 'fs/promises';

type Coords = {
    x : number
    y : number
}

enum Direction {
    U,
    D,
    L,
    R,
    UL,
    UR,
    DR,
    DL
}

async function readInput(fileName : string) : Promise<String[][]> {
    var parsedInput: String[][] = [];
    const file = await fsPromise.open(fileName, 'r');
    for await (const line of file.readLines()) {
      let numbers = line.split('');
      parsedInput.push(numbers);
    }
    file.close();
    console.log(parsedInput)
    return parsedInput;
}

function checkNextChar(char : String, dir : Direction, coords : Coords, array : String[][]) : boolean {
    if (coords.x < 0 || coords.y < 0 || coords.x >= array.length || coords.y >= array[0].length) return false;
    if (array[coords.y][coords.x] == char) {
        switch(dir) {
            case Direction.U:
                coords.y -= 1;
                break
            case Direction.D:
                coords.y += 1;
                break 
            case Direction.L:
                coords.x -= 1;
                break
            case Direction.R:
                coords.x += 1;
                break
            case Direction.UL:
                coords.y -= 1;
                coords.x -= 1;
                break
            case Direction.DL:
                coords.y += 1;
                coords.x -= 1;
                break 
            case Direction.UR:
                coords.x += 1;
                coords.y -= 1;
                break
            case Direction.DR:
                coords.x += 1;
                coords.y += 1;
                break
        }
        switch (char) {
            case "X": 
                return checkNextChar("M", dir, coords, array)
            case "M": 
                return checkNextChar("A", dir, coords, array)
            case "A": 
                return checkNextChar("S", dir, coords, array)
            case "S": 
                return true;
        }
    }

    return false;
}

function checkNextAndPrevChar(char : String, dir : Direction, coords : Coords, array : String[][]) : boolean {
    if (coords.x-1 < 0 || coords.y-1 < 0 || coords.x+1 >= array.length || coords.y+1 >= array[0].length) return false;
    if (array[coords.y][coords.x] == char) {
        let reverseCoords : Coords = {x : coords.x, y : coords.y};
        switch(dir) {
            case Direction.U:
                coords.y -= 1;
                reverseCoords.y += 1;
                break
            case Direction.D:
                coords.y += 1;
                reverseCoords.y -= 1;
                break 
            case Direction.L:
                coords.x -= 1;
                reverseCoords.x += 1;
                break
            case Direction.R:
                coords.x += 1;
                reverseCoords.x -= 1;
                break
            case Direction.UL:
                coords.x -= 1;
                coords.y -= 1;
                reverseCoords.x += 1;
                reverseCoords.y += 1;
                break
            case Direction.DL:
                coords.x -= 1;
                coords.y += 1;
                reverseCoords.x += 1;
                reverseCoords.y -= 1;
                break 
            case Direction.UR:
                coords.x += 1;
                coords.y -= 1;
                reverseCoords.x -= 1;
                reverseCoords.y += 1;
                break
            case Direction.DR:
                coords.x += 1;
                coords.y += 1;
                reverseCoords.x -= 1;
                reverseCoords.y -= 1;
                break
        }
        if (array[coords.y][coords.x] == "S" && array[reverseCoords.y][reverseCoords.x] == "M") return true;
    }
    return false;
}



readInput("input.txt").then((data) => {
    var allUses = 0;
    var allXses = 0;
    for (let i : number = 0; i < data.length; i++) {
        for (let j = 0; j < data[0].length; j++) {
            let masCount = 0;
            for (let dir : Direction = 0; dir < 8; dir++) {
                if (checkNextChar("X", dir, {x : i, y : j}, data)) allUses++;
            }
            for (let dir : Direction = 4; dir < 8; dir++) {
                if (checkNextAndPrevChar("A", dir, {x : i, y : j}, data)) masCount++;
            }
            if (masCount >= 2) allXses++;
        }
    }
    console.log(allUses)
    console.log(allXses)
})