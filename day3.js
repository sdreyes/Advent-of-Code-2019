/*
--- Day 3: Crossed Wires ---
The gravity assist was successful, and you're well on your way to the Venus refuelling station. During the rush back on Earth, the fuel management system wasn't completely installed, so that's next on the priority list.

Opening the front panel reveals a jumble of wires. Specifically, two wires are connected to a central port and extend outward on a grid. You trace the path each wire takes as it leaves the central port, one wire per line of text (your puzzle input).

The wires twist and turn, but the two wires occasionally cross paths. To fix the circuit, you need to find the intersection point closest to the central port. Because the wires are on a grid, use the Manhattan distance for this measurement. While the wires do technically cross right at the central port where they both start, this point does not count, nor does a wire count as crossing with itself.

For example, if the first wire's path is R8,U5,L5,D3, then starting from the central port (o), it goes right 8, up 5, left 5, and finally down 3:

...........
...........
...........
....+----+.
....|....|.
....|....|.
....|....|.
.........|.
.o-------+.
...........
Then, if the second wire's path is U7,R6,D4,L4, it goes up 7, right 6, down 4, and left 4:

...........
.+-----+...
.|.....|...
.|..+--X-+.
.|..|..|.|.
.|.-X--+.|.
.|..|....|.
.|.......|.
.o-------+.
...........
These wires cross at two locations (marked X), but the lower-left one is closer to the central port: its distance is 3 + 3 = 6.

Here are a few more examples:

R75,D30,R83,U83,L12,D49,R71,U7,L72
U62,R66,U55,R34,D71,R55,D58,R83 = distance 159
R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
U98,R91,D20,R16,D67,R40,U7,R15,U6,R7 = distance 135
What is the Manhattan distance from the central port to the closest intersection?
*/

const fs = require("fs");

const readFile = function(filepath) {
  if (!fs.existsSync(filepath)) throw ("File not found");
  const data = fs.readFileSync(filepath, "utf8");
  return data;
};

const getWirePaths = function(filepath) {
  const unparsedWirePaths = readFile(filepath).split("\n");
  const parsedWirePaths = [];
  for (const path of unparsedWirePaths) {
    parsedWirePaths.push(path.split(","));
  }
  return parsedWirePaths;
};

const manhattan = function(point1, point2) {
  return Math.abs(point1.x-point2.x) + Math.abs(point1.y-point2.y)
}

const compareWirePaths = function(filepath) {
  const wirePaths = getWirePaths(filepath);
  // Array of two arrays to store coordinates of the start and end of each wire's segments
  let segments = [[],[]];
  let letter;
  let distance;
  // For the lenth of the list of wirepaths (in this case, 2 wires)
  for (let i = 0; i < wirePaths.length; i++) {
    // Objects to store coordinates of the start and end of each segment
    let position = {x: 0, y: 0};
    let nextPosition = {...position};
    // For each "direction" of the wirepath
    for (const direction of wirePaths[i]) {
      // get the direction and the distance it's moving
      letter = direction[0];
      distance = parseInt(direction.match(/\d+/g));
      // Depending on the direction it's moving, add or subtract the distance to find the next coordinates of the wire
      switch(letter) {
        case "U":
          nextPosition.y += distance;
          break;
        case "D":
          nextPosition.y -= distance;
          break;
        case "L":
          nextPosition.x -= distance;
          break;
        case "R":
          nextPosition.x += distance;
          break;
        default:
          throw "Invalid command.";
      };
      // Add the start and end coordinates to the array of wire segments
      segments[i].push({
        from: {...position},
        to: {...nextPosition}
      });
      // Reset the start position to the current value of nextPosition to prepare for the next iteration
      position = {...nextPosition};
    };
  };
  // console.log(JSON.stringify(segments[0][0], null, 2));
  let currentManhattanDistance;
  let closestManhattanDistance;
  let lowestSteps;
  let currentSteps;
  let wire1 = segments[0];
  let wire2 = segments[1];
  let stepsTraveled1 = 0;
  let stepsTraveled2 = 0;
  wire1.map((segment1) => {
    stepsTraveled2 = 0;
    wire2.map((segment2) => {
      // If *only* one of the wires is moving along the horizontal axis, there's a chance they'll intersect
      // Use XOR to ensure only one condition is true
      if (segment1.from.x === segment1.to.x ^ segment2.from.x === segment2.to.x) {
        // If the x axis of wire 1 stays the same, it means the wire 1 segment is moving vertically
        const vertical = segment1.from.x === segment1.to.x ? segment1 : segment2;
        // Which in turn means the wire 2 segment is moving horizontally
        const horizontal = segment1.from.x === segment1.to.x ? segment2 : segment1;
        // Check the start and end point of each segment and determine which is min/max
        const minX = Math.min(horizontal.from.x, horizontal.to.x);
        const maxX = Math.max(horizontal.from.x, horizontal.to.x);
        const minY = Math.min(vertical.from.y, vertical.to.y);
        const maxY = Math.max(vertical.from.y, vertical.to.y);
        // If the x axis from the vertical-moving segment is between the min and max of the horizontal-moving segment
        // and the y axis from the horizontal-moving segment is between the min and max of the vertical-moving segment
        if ((vertical.from.x >= minX && vertical.from.x <= maxX) && (horizontal.from.y >= minY && horizontal.from.y <= maxY)) {
          let intersection = {
            x: vertical.from.x,
            y: horizontal.from.y
          }
          currentManhattanDistance = Math.abs(vertical.from.x) + Math.abs(horizontal.from.y);
          // If a closestManhattanDistance value exists, grab the minimum between that and the manhatta value. Otherwise, the currentManhattanDistance value is the lowest.
          closestManhattanDistance = closestManhattanDistance ? Math.min(currentManhattanDistance, closestManhattanDistance) : currentManhattanDistance;
          // Add the two partial segments at the end since it isn't always the full path to the intersection
          currentSteps = stepsTraveled1 + stepsTraveled2 + manhattan(segment1.from, intersection) + manhattan(segment2.from, intersection);
          // If a lowestSteps value exists, grab the minimum between that and the currentSteps value. Otherwise, the currentSteps value is the lowest.
          lowestSteps = lowestSteps ? Math.min(currentSteps, lowestSteps) : currentSteps;
        };
      };
      stepsTraveled2 += manhattan(segment2.from, segment2.to);
    });
    stepsTraveled1 += manhattan(segment1.from, segment1.to);
  });
  return {
    closestManhattanDistance,
    lowestSteps
  };
};

console.log(`Part 1 solution: ${compareWirePaths("day3-input.txt").closestManhattanDistance}`);

/*
--- Part Two ---
It turns out that this circuit is very timing-sensitive; you actually need to minimize the signal delay.

To do this, calculate the number of steps each wire takes to reach each intersection; choose the intersection where the sum of both wires' steps is lowest. If a wire visits a position on the grid multiple times, use the steps value from the first time it visits that position when calculating the total value of a specific intersection.

The number of steps a wire takes is the total number of grid squares the wire has entered to get to that location, including the intersection being considered. Again consider the example from above:

...........
.+-----+...
.|.....|...
.|..+--X-+.
.|..|..|.|.
.|.-X--+.|.
.|..|....|.
.|.......|.
.o-------+.
...........
In the above example, the intersection closest to the central port is reached after 8+5+5+2 = 20 steps by the first wire and 7+6+4+3 = 20 steps by the second wire for a total of 20+20 = 40 steps.

However, the top-right intersection is better: the first wire takes only 8+5+2 = 15 and the second wire takes only 7+6+2 = 15, a total of 15+15 = 30 steps.

Here are the best steps for the extra examples from above:

R75,D30,R83,U83,L12,D49,R71,U7,L72
U62,R66,U55,R34,D71,R55,D58,R83 = 610 steps
R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
U98,R91,D20,R16,D67,R40,U7,R15,U6,R7 = 410 steps
What is the fewest combined steps the wires must take to reach an intersection?
*/

console.log(`Part 2 solution: ${compareWirePaths("day3-input.txt").lowestSteps}`);