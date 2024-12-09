import * as fsPromise from 'fs/promises';

type Antenna = {
  frequency : String
  coords : Coords
}

type Coords = {
  x : number
  y : number
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

function getUniqueChars(array : String[][]) : String[] {
  let uniques : String[] = []
  for (let line of array) {
    for (let char of line) {
      if (!uniques.includes(char)) {
        uniques.push(char)
      }
    }
  }
  uniques = uniques.filter((item) => (item != "."))
  return uniques;
}

function getAntinodes(tower5g : Antenna, map : String[][]) : Coords[] {
  let possibleAntinodes : Coords[] = []
  
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (tower5g.coords.x == j && tower5g.coords.y == i) continue
      if (map[i][j] == tower5g.frequency) {
        let dx = j - tower5g.coords.x;
        let dy = i - tower5g.coords.y;

        let antiNode1 : Coords = {x : tower5g.coords.x - dx, y : tower5g.coords.y - dy}
        let antiNode2 : Coords = {x : tower5g.coords.x + 2*dx, y : tower5g.coords.y + 2*dy}

        if (isInbounds(antiNode1.x, antiNode1.y, map)) possibleAntinodes.push(antiNode1)
        if (isInbounds(antiNode2.x, antiNode2.y, map)) possibleAntinodes.push(antiNode2)
      }
    }
  }

  return possibleAntinodes
}

function getAllAntinodes(tower5g : Antenna, map : String[][]) : Coords[] {
  let possibleAntinodes : Coords[] = []
  
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (tower5g.coords.x == j && tower5g.coords.y == i) continue
      if (map[i][j] == tower5g.frequency) {
        let dx = j - tower5g.coords.x;
        let dy = i - tower5g.coords.y;

        let k = 1;
        while (isInbounds(tower5g.coords.x - k*dx, tower5g.coords.y - k*dy, map)) {
          let antiNode : Coords = {x : tower5g.coords.x - k*dx, y : tower5g.coords.y - k*dy}
          possibleAntinodes.push(antiNode)
          k++
        }
        k = 1;
        while (isInbounds(tower5g.coords.x + k*dx, tower5g.coords.y + k*dy, map)) {
          let antiNode : Coords = {x : tower5g.coords.x + k*dx, y : tower5g.coords.y + k*dy}
          possibleAntinodes.push(antiNode)
          k++
        }
      }
    }
  }

  return possibleAntinodes
}

function addUniqueNodes(coords1 : Coords[], coords2 : Coords[]) : Coords[] {
  let uniques : Coords[] = [...coords1]

  for (let node of coords2) {
    if (uniques.some((existingNode) => (existingNode.x == node.x && existingNode.y == node.y))) continue;
    uniques.push(node);
  }

  return uniques;
}

function isInbounds(x : number, y : number, map : String[][]) : boolean {
  return x >= 0 && y >= 0 && x < map[0].length && y < map.length
}

readInput("input.txt").then((data) => {
  let antennaTypes = getUniqueChars(data)
  let allAntinodeCoords : Coords[] = []
  let allAntinodeCoords2 : Coords[] = []
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[0].length; j++) {
      if (antennaTypes.includes(data[i][j])) {
        let nodes : Coords[] = getAntinodes({frequency : data[i][j], coords: {x:j, y:i}}, data)
        let nodes2 : Coords[] = getAllAntinodes({frequency : data[i][j], coords: {x:j, y:i}}, data)
        allAntinodeCoords = addUniqueNodes(allAntinodeCoords, nodes)
        allAntinodeCoords2 = addUniqueNodes(allAntinodeCoords2, nodes2)
      }
    }
  }
  
  
  console.log(allAntinodeCoords.length)
  console.log(allAntinodeCoords2.length)
})