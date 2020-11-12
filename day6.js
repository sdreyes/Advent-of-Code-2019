/*
--- Day 6: Universal Orbit Map ---
You've landed at the Universal Orbit Map facility on Mercury. Because navigation in space often involves transferring between orbits, the orbit maps here are useful for finding efficient routes between, for example, you and Santa. You download a map of the local orbits (your puzzle input).

Except for the universal Center of Mass (COM), every object in space is in orbit around exactly one other object. An orbit looks roughly like this:

                  \
                   \
                    |
                    |
AAA--> o            o <--BBB
                    |
                    |
                   /
                  /
In this diagram, the object BBB is in orbit around AAA. The path that BBB takes around AAA (drawn with lines) is only partly shown. In the map data, this orbital relationship is written AAA)BBB, which means "BBB is in orbit around AAA".

Before you use your map data to plot a course, you need to make sure it wasn't corrupted during the download. To verify maps, the Universal Orbit Map facility uses orbit count checksums - the total number of direct orbits (like the one shown above) and indirect orbits.

Whenever A orbits B and B orbits C, then A indirectly orbits C. This chain can be any number of objects long: if A orbits B, B orbits C, and C orbits D, then A indirectly orbits D.

For example, suppose you have the following map:

COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L
Visually, the above map of orbits looks like this:

        G - H       J - K - L
       /           /
COM - B - C - D - E - F
               \
                I
In this visual representation, when two objects are connected by a line, the one on the right directly orbits the one on the left.

Here, we can count the total number of orbits as follows:

D directly orbits C and indirectly orbits B and COM, a total of 3 orbits.
L directly orbits K and indirectly orbits J, E, D, C, B, and COM, a total of 7 orbits.
COM orbits nothing.
The total number of direct and indirect orbits in this example is 42.

What is the total number of direct and indirect orbits in your map data?
*/

const fs = require("fs");

const readFile = filepath => {
  if (!fs.existsSync(filepath)) throw ("File not found");
  const data = fs.readFileSync(filepath, "utf8");
  return data;
};

const getOrbitData = (filepath) => {
  return parseOrbitData(readFile(filepath).split("\n"));
};

const parseOrbitData = (orbitData) => {
  let obj = {};
  // Create a list of key value pairs, where the key is the orbiter, and the value is the object being orbited
  for (let i = 0; i < orbitData.length; i++) {
    const orbitee = orbitData[i].split(")")[0];
    const orbiter = orbitData[i].split(")")[1];
    obj[orbiter] = orbitee;
  }
  return obj;
};

const countOrbits = (i, orbitData) => {
  // If the object exists as an orbiter, add 1 and then recursively check if its value exists as an orbiter. Once it finds a value that doesn't exist as an orbiter, it returns 0 and the call stack ends
  if (orbitData[i]) return 1 + countOrbits(orbitData[i], orbitData)
  return 0;
};

const checkSum = filepath => {
  let orbitData = getOrbitData(filepath);
  let count = 0;
  // Because every object is in orbit around exactly one other object, the orbiters are all unique (keys)
  for (const i in orbitData) {
    count += countOrbits(i, orbitData);
  }
  return count;
};

console.log(checkSum("day6-input.txt"));

/*
--- Part Two ---
Now, you just need to figure out how many orbital transfers you (YOU) need to take to get to Santa (SAN).

You start at the object YOU are orbiting; your destination is the object SAN is orbiting. An orbital transfer lets you move from any object to an object orbiting or orbited by that object.

For example, suppose you have the following map:

COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L
K)YOU
I)SAN
Visually, the above map of orbits looks like this:

                          YOU
                         /
        G - H       J - K - L
       /           /
COM - B - C - D - E - F
               \
                I - SAN
In this example, YOU are in orbit around K, and SAN is in orbit around I. To move from K to I, a minimum of 4 orbital transfers are required:

K to J
J to E
E to D
D to I
Afterward, the map of orbits looks like this:

        G - H       J - K - L
       /           /
COM - B - C - D - E - F
               \
                I - SAN
                 \
                  YOU
What is the minimum number of orbital transfers required to move from the object YOU are orbiting to the object SAN is orbiting? (Between the objects they are orbiting - not between YOU and SAN.)
*/

const getPath = (i, orbitData, pathArr) => {
  // Capture a list of every orbit jumped to to reach the orbiter specified
  if (orbitData[i]) {
    // If the orbiter exists in the list, push the orbitee to the array
    pathArr.push(orbitData[i]);
    // Then find out what the orbitee is orbiting
    getPath(orbitData[i], orbitData, pathArr)
  }
  return pathArr;
};

const contains = (arr, val) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === val) return true;
  }
  return false;
};

const numOrbitsToSanta = filepath => {
  let orbitData = getOrbitData(filepath);
  // Capture the orbit path to get to SAN from COM
  let santaLoc = getPath("SAN", orbitData, []);
  // Capture the orbit path to get to YOU from COM
  let youLoc = getPath("YOU", orbitData, []);
  // Counter to capture how many orbital transfers are required
  let orbitsToSanta = 0;
  // Count how many orbits to SantaLoc aren't in common with youLoc
  for (let i = 0; i < santaLoc.length; i++) {
    if (!contains(youLoc, santaLoc[i])) orbitsToSanta++;
  }
  // Count how many orbits to YouLoc aren't in common with SantaLoc
  for (let j = 0; j < santaLoc.length; j++) {
    if (!contains(santaLoc, youLoc[j])) orbitsToSanta++;
  }
  return orbitsToSanta;
}

console.log(numOrbitsToSanta("day6-input.txt"));