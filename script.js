'use strict';
window.addEventListener('DOMContentLoaded', Gameboard);

/* Fill gameboard with 81 (9x9) small squares */
function Gameboard() {
  const game = document.querySelector('.gamespace');
  for (let j = 0; j <= 80; j++) {
    game.insertAdjacentHTML('afterbegin',`<div class="squares" id="num${80 - j}"><span class="num"></span></div>`);
  }
}

const square = document.querySelectorAll('.squares');

/* 4 red lines divide board into 9 squares */
function redLines() {
  const lineStyle = '2px solid red';

  for (let i = 2; i <= 81; i += 9) {
    square[i].style.borderRight = lineStyle;
    square[i + 1].style.borderLeft = lineStyle;
    square[i + 3].style.borderRight = lineStyle;
    square[i + 4].style.borderLeft = lineStyle;
  }

  for (let i = 18; i <= 26; i++) {
    square[i].style.borderBottom = lineStyle;
    square[i + 9].style.borderTop = lineStyle;
    square[i + 27].style.borderBottom = lineStyle;
    square[i + 36].style.borderTop = lineStyle;
  }
}

redLines();



/**** Sudoku starts only when type and level of game are checked ****/

const btnStart = document.querySelector('#play');
const btnReset = document.querySelector('#reset');

/* STEP 1: Selecting number of digits (game level difficulty) */

let listGroup = document.querySelector('#level-list');

let selectedValues = () => Number(listGroup.value);
let n = selectedValues();

listGroup.addEventListener('change', selectedValues);

/* STEP 2: Choose type of game (with/without timer) */

btnStart.addEventListener('click', toggleTimer, { once: true });
btnReset.addEventListener('click', toggleTimer);

let fun = document.querySelector('#timeOff');
let record = document.querySelector('#timeOn');


 if (n > 0) {
   console.log('OK');
}

function toggleTimer(event) {
  let btn = event.target.id;
  
  if (btn = btnStart && record.checked == true) {
    window.setInterval(tick(Date.now()), 1000);
  }
  if (btn = btnReset && record.checked == true) {
    clearInterval(tick(Date.now()));
  }
}

/* Timer */

const timeIntervals = [
  /* all in milliseconds */
  ['hour', 3600000],
  ['minute', 60000],
  ['second', 1000]
];

const tick = start => () => {
  let elapsed = Date.now() - start;
  let newRecord = document.querySelector('#new-record');

  for (let [unit, ms] of timeIntervals) {
    let timing = Math.floor(elapsed / ms);
    let timerParam = document.getElementById(unit);
    let recordParam = document.getElementsByClassName(unit);

    if (typeof timing == 'number') {
      // 00-09 or 10-59 numbers range
      timing < 10
        ? (timerParam.textContent = `0${timing}`)
        : (timerParam.textContent = `${timing}`);
    }

    /* if (recordParam == '--') {
      newRecord.style.display = 'table-cell';
      newRecord.innerHTML = 'NEW RECORD !!!';
    } */

    elapsed %= ms;
  }
};

/* STEP 3: Generating 81 digits array for the game */

function Gamedigits() {
  /* 'sortedArray' is the first (base) 9-elements array
   and the most important part of the all code */
  let sortedArray = [];

  function sorting() {
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let n = numbers.length;
    for (let i = 1; i <= n; ) {
      let a = Math.floor(Math.random() * n);
      let b = numbers[a];

      sortedArray.push(b);
      numbers.splice(a, 1);

      n--;
    }

    return sortedArray;
  }

  //  Make 27 part of small arrays
  let fullArray = [];

  function arrayParts() {
    sorting();

    let [i1, i2, i3, ...others1] = sortedArray;
    let [, , , i4, i5, i6, ...others2] = sortedArray;
    let [, , , , , , i7, i8, i9] = sortedArray;

    let part1 = [i1, i2, i3];
    let part2 = [i4, i5, i6];
    let part3 = [i7, i8, i9];

    /* All other part(4-9) are made from part(1-3) by moving the last element in array to begin (like [a,b,c] -> [c,a,b] -> [b,c,a]). */
    let part4 = [i9, i7, i8]; let part5 = [i3, i1, i2]; let part6 = [i6, i4, i5];
    let part7 = [i5, i6, i4]; let part8 = [i8, i9, i7]; let part9 = [i2, i3, i1];

    /* The right order of inserting every part into 9x9 sudoku array (fullArray) */
    fullArray = [...part1, ...part2, ...part3,
                ...part4, ...part5, ...part6,
                ...part7, ...part8, ...part9,
                ...part8, ...part9, ...part7,
                ...part2, ...part3, ...part1,
                ...part5, ...part6, ...part4,
                ...part6, ...part4, ...part5,
                ...part9, ...part7, ...part8,
                ...part3, ...part1, ...part2];

    return fullArray;
  }

  arrayParts();

  //  Check correct sum for all digits and 2 main diagonals before inside them on the board
  let sumDigits = fullArray.reduce(function(previousValue, currentValue) {
    return previousValue + currentValue;
  });
  let leftResult = 0;
  let rightResult = 0;

  for (let i = 0; i <= 8; i++) {
    leftResult += fullArray[i * 10];
    rightResult += fullArray[(i + 1) * 8];
  }

  if (sumDigits != 405 || leftResult != 45 || rightResult != 45) {
    alert('Wrong digits!');
  }

  return fullArray;
}


/* STEP 4: Fill the board with the digits */

/* Taking index numbers - it is n-indexes loop, where 'n' depends on game level */
let uniqueIndexesArray = [];
let indexNumbers = [];

let sudoku = Gamedigits();
let indexArray = Array.from(sudoku); // copy of 'fullArray' to make the operations on it

function cleanedArray(n) {
  let tempArray = [];
  let k = 0;

  do {
    indexNumbers = Math.floor(Math.random() * indexArray.length);
    indexArray.splice(indexNumbers, 1, '');
    tempArray.push(indexNumbers);
    uniqueIndexesArray = [...new Set(tempArray)];

    k = uniqueIndexesArray.length;
  } while (k < n);

  return uniqueIndexesArray;
}

let smallArray = cleanedArray(n);
console.log(smallArray);

/* Inserting white/empty area to input digits into the board */
let noRepeatIndexes = Array.from(smallArray.values());

function fill() {
  for (let i = 0; i < n; i++) {
    square[noRepeatIndexes[i]].insertAdjacentHTML('afterbegin', `<input type="text" class="digits" 
    id="pos${noRepeatIndexes[i]}" maxlength="1" size="2" value="">`);
  }
}

/* Board is filled with digits and some of them are already covered beyond the user sight */
let cellDigits = document.querySelectorAll('.squares > span'); // define space to put 81 digits

function fillBoard() {
  fill();

  for (let i = 0; i < indexArray.length; i++) {
    cellDigits[i].innerHTML = `${indexArray[i]}`;
  }
}

fillBoard();

const getNumber = str => Number(str.match(/\d+/)[0]);
const num = event => getNumber(event.target.id);

game.addEventListener('click', compareDigit);

/* Checking if the entered digit matches the digit in the same index position in the fullArray */

function compareDigit(event) {
  let digit = num(event);
  let digitSquare = document.querySelector(`#${event.target.id}`);
  let enteredValue = digitSquare.value;
  let arrayDigit = fullArray[digit];

  /* Input area displays blue/red color after good/bad answer respectively */
  if (digitSquare != null && enteredValue != '' && arrayDigit != '') {
    if (enteredValue == arrayDigit) {
      digitSquare.style.backgroundColor = 'rgb(110, 144, 247)';
      /* good answer will block the square permanently and make font color black (as it was default) */
      digitSquare.disabled = true;
      digitSquare.style.color = 'black';
      n--;
      
      if (n == 0) {
        GameEnd();
      }
    }
    else {
      digitSquare.style.backgroundColor = 'rgb(219, 63, 63)';
    }
  }
}

function GameEnd() {
    /* Clear: array, all game options */
    indexArray.forEach(el => {
      el.textContent = '';
    });
    
    optionsClear();
}

/* Remove selected options and make them defaults */
btnReset.addEventListener('click', optionsClear);
window.addEventListener('DOMContentLoaded', optionsClear);

/* lables */
const lables = document.querySelectorAll('.gameopt');

/* checkbox */
const checkboxButtons = document.querySelectorAll(`[type='checkbox']`);

function checkboxReset() {
  lables.forEach(lable => {
    lable.style.setProperty('--bg', 'transparent');
  });
  checkboxButtons.forEach(checkboxBtn => {
    checkboxBtn.checked = false;
  });
}

/* select */
const list = document.querySelector('#level-list');

function listReset() {
  list.selectedIndex = 0;
}

function optionsClear() {
  /* All fields reset */
  checkboxReset();
  listReset();

  /* default graphic on the board */
  document.querySelector('.example').style.background =
    'url(/example-mini.svg)';
}

/** User can hide theoretical description of "Sudoku". 
This saves a lot of document space - it is especially 
important for mobile devices **/

let showHideButton = document.querySelector('#savespace');
let textChange = document.querySelector('.hide-show > span');

function ShowHideText() {
  let hiddenText = document.querySelector('.description');

  if (hiddenText.style.display === 'none') {
    hiddenText.style.display = 'flex';
    textChange.innerHTML = 'Click to HIDE description';
  } else {
    hiddenText.style.display = 'none';
    textChange.innerHTML = 'Click to SHOW description';
  }
}

showHideButton.addEventListener('click', ShowHideText);