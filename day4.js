/*
--- Day 4: Secure Container ---
You arrive at the Venus fuel depot only to discover it's protected by a password. The Elves had written the password on a sticky note, but someone threw it out.

However, they do remember a few key facts about the password:

It is a six-digit number.
The value is within the range given in your puzzle input.
Two adjacent digits are the same (like 22 in 122345).
Going from left to right, the digits never decrease; they only ever increase or stay the same (like 111123 or 135679).
Other than the range rule, the following are true:

111111 meets these criteria (double 11, never decreases).
223450 does not meet these criteria (decreasing pair of digits 50).
123789 does not meet these criteria (no double).
How many different passwords within the range given in your puzzle input meet these criteria?

Your puzzle input is 124075-580769.
*/

const input = "124075-580769";

// Gets the digit in the 'i'th spot of the full num
const getDigit = (num, i) => {
  return Math.floor(Math.abs(num) / Math.pow(10, i)) % 10;
};

// Counts the number of digits in num
const digitCount = num => {
  if (num === 0) return 1;
  return Math.floor(Math.log10(Math.abs(num))) + 1;
};

const isSixDigits = function(num) {
  return digitCount(num) === 6;
};

const hasSameAdjacentDigits = function(num) {
  for (let i = 1; i < 6; i++) {
    if (getDigit(num, i) === getDigit(num, i-1)) return true;
  };
  return false;
};

const digitsIncrease = function(num) {
  for (let i = 5; i > 0; i--) {
    // If the digit is smaller than the one preceding it, return false
    if (getDigit(num, i-1) < getDigit(num, i)) return false;
  };
  return true;
};

let getNumValidPasswords = function(input) {
  let numValidPasswords = 0;
  let range = input.split("-");
  let minRange = parseInt(range[0]);
  let maxRange = parseInt(range[1]);
  for (let i = minRange; i < maxRange; i++) {
    if (isSixDigits(i)) {
      if (hasSameAdjacentDigits(i) && digitsIncrease(i)) numValidPasswords++;
    };
  };
  return numValidPasswords;
}

console.log(`Part 1 solution: ${getNumValidPasswords(input)}`);

/*
--- Part Two ---
An Elf just remembered one more important detail: the two adjacent matching digits are not part of a larger group of matching digits.

Given this additional criterion, but still ignoring the range rule, the following are now true:

112233 meets these criteria because the digits never decrease and all repeated digits are exactly two digits long.
123444 no longer meets the criteria (the repeated 44 is part of a larger group of 444).
111122 meets the criteria (even though 1 is repeated more than twice, it still contains a double 22).
How many different passwords within the range given in your puzzle input meet all of the criteria?
*/

// Function to check if there is a section with exactly 2 repeating digits
const hasTwoSameAdjacentDigits = function(num) {
  let adjacentDigitsCounter = 0;
  for (let i = 1; i <= 6; i++) {
    // If the digit is the same as the one before it, increase the counter
    if (getDigit(num, i) === getDigit(num, i-1)) {
      adjacentDigitsCounter++;
    // Otherwise, we've gotten to a different digit, so check if the counter's value is 1. If it is, then we've found exactly two adjacent digits
    } else if (adjacentDigitsCounter === 1) {
      return true
    // Otherwise reset the counter
    } else {
      adjacentDigitsCounter = 0;
    }
  };
  return false;
};

let getUpdatedNumValidPasswords = function(input) {
  let numValidPasswords = 0;
  let range = input.split("-");
  let minRange = parseInt(range[0]);
  let maxRange = parseInt(range[1]);
  for (let i = minRange; i <= maxRange; i++) {
    if (isSixDigits(i)) {
      if (hasTwoSameAdjacentDigits(i) && digitsIncrease(i)) numValidPasswords++;
    };
  };
  return numValidPasswords;
}

console.log(`Part 2 solution: ${getUpdatedNumValidPasswords(input)}`);