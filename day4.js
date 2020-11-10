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
  // console.log(minRange, maxRange);
  for (let i = minRange; i < maxRange; i++) {
    if (isSixDigits(i)) {
      if (hasSameAdjacentDigits(i) && digitsIncrease(i)) numValidPasswords++;
    };
  };
  return numValidPasswords;
}

console.log(isSixDigits(123456)); //true
console.log(isSixDigits(2)); //false
console.log(hasSameAdjacentDigits(11)); //true
console.log(hasSameAdjacentDigits(123456)); //false
console.log(digitsIncrease(123456)); //true
console.log(digitsIncrease(111211)); //false
console.log(getNumValidPasswords(input));

