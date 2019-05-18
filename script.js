'use strict';
/*window.addEventListener("DOMContentLoaded", Sudoku);*/

function Sudoku() {
  let game = document.querySelector('.gamespace');
  
//  Animations on/off
  let animClick = document.querySelector('#anim');
  animClick.addEventListener('click', function animOnOff() {
    if (animClick.checked == true) {
      document.querySelectorAll('.animations > img').src = '/animationOff.png';      
    }
  }, false);
  
  for (let j=1; j<=81; j++) {
    game.insertAdjacentHTML('afterbegin', `<div class="squares"><span></span></div>`);
  }
  
  let sortArray = [];  
  function sorting() {
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = 1; i <= 9; i++) {
      // random index 'a' number from 'numbers' array
      let a = Math.round(Math.random() * (numbers.length - 1)); 
      
      // get digit from index position
      let b = numbers[a]; 
      sortArray.push(b);
      numbers.splice(a, 1);
    }
      
    return sortArray;
  }

  let mixed = sorting();

//  Make 27 part of small arrays
  let fullArray = [];
  function arrayParts(mixed) {
   
    let [i1, i2, i3, ...others1] = sortArray;
    let [ , , , i4, i5, i6, ...others2] = sortArray;
    let [ , , , , , , i7, i8, i9] = sortArray;
    let part1 = [i1, i2, i3];
    let part2 = [i4, i5, i6];
    let part3 = [i7, i8, i9];

    /* All other parts 4-9 are made from parts 1-3 by moving the last element in array to begin (like [a,b,c] -> [c,a,b] -> [b,c,a]). */
    let part4 = [i9, i7, i8];
    let part5 = [i3, i1, i2];
    let part6 = [i6, i4, i5];
    let part7 = [i5, i6, i4];
    let part8 = [i8, i9, i7];
    let part9 = [i2, i3, i1];
 
    /* The right order of inserting every part into 9x9 sudoku array (fullArray) */   
    fullArray = [...part1, ...part2, ...part3, ...part4, ...part5, ...part6, ...part7, ...part8, ...part9, ...part8, ...part9, ...part7, ...part2, ...part3, ...part1, ...part5, ...part6, ...part4, ...part6, ...part4, ...part5, ...part9, ...part7, ...part8, ...part3, ...part1, ...part2];
    
    return fullArray;
  }
  
  arrayParts(mixed);
  
//  Check correct sum for all digits and 2 main diagonals before inside them on the board
  let sumDigits = fullArray.reduce(function(previousValue, currentValue, index, array) {
      return previousValue + currentValue;
    });
    if(sumDigits != 405) {
      alert('Wrong digits!');
    };
  let mainDiagonals = function() {
      let leftResult = 0;
      let rightResult = 0;
        for (let i = 0; i <= 80; i+= 10) {
          leftResult += fullArray[i];
        }      
        for (let i = 8; i <= 72; i+= 8) {
          rightResult += fullArray[i];
        }
      
        if (leftResult != 45 || rightResult != 45) {
          alert('Wrong digits!');
        };
    };
  

// Check clicked type of checkbox
  let fun = document.querySelector('#opt1');
  let record = document.querySelector('#opt2');

// Choose type of game
  function GameType() {
    let timing = undefined;
      if (record.checked == true) {
        timing = 1;
      } 
      else {
        timing = 0;      
      }

    return timing;
  }

  fun.addEventListener('click', GameType, false);
  record.addEventListener('click', GameType, false);

// Function to use timer
  const timeIntervals = [
      /* all in milliseconds */
      ["hour", 3600000],
      ["minute", 60000],
      ["second", 1000]
    ];
  const tick = (start) => () => {
      let elapsed = Date.now() - start;

      for (let [unit, ms] of timeIntervals) {
        let timing = Math.floor(elapsed / ms);
        let param = document.getElementById(unit);

        if (typeof (timing) == "number") {
          timing < 10 ? param.textContent = `0${timing}` : param.textContent = `${timing}`;
        }      

        elapsed %= ms;    
      }
  };

  let btnStart = document.querySelector('#play');

// Selected number of digits (game level type)
  let listGroup = document.querySelector('#level-list');
  function selectedValues() {
    let listValue = listGroup.value;
    let testNumber = parseInt(listValue);

    return testNumber;
  }

  let n = selectedValues();
  listGroup.addEventListener('change', selectedValues);
  
//  Put selected number of digits (n) into the board
  function insertDigits(n) {
    let cellDigits = document.querySelectorAll('.squares > span');
    let indexArray = [];
    let indexNumber = undefined;  
      for (let i = 0; i < n; i++) {
        indexNumber = Math.floor(Math.random() * (fullArray.length - i));
        indexArray.push(indexNumber);
      }
      
      for (let k = 0; k < fullArray.length; k++) {
        if (k == n) {
          cellDigits[indexNumber].textContent = '';        
        }
        cellDigits[k].textContent = `${fullArray[k]}`;
      }
    
      if (indexNumber = undefined) {
        game.src = '/example.png';
        return ;
      }
    alert(`${indexNumber}`);
  }

  insertDigits(n);
  
// Sudoku start only when type and level of game are checked
  btnStart.addEventListener('click', function timer(timing) {
    GameType();
    insertDigits(n);
    if (n > 0) {
      if (timing = 1) {
        window.setInterval(tick(Date.now()), 1000);
      } 
      else {
        return alert('?');
      }    
    }
    else {
      return alert(`${n}`);
    }
  }, {once: true});

//  Game reset and timer off
  let btnReset = document.querySelector('#reset');
  btnReset.addEventListener('click', function reset(tick) {
      window.clearInterval(tick(Date.now()));

    document.querySelector('.gamespace').style.backgroundImage = 'url(/example.png)';
    }, {once: true});  
  
}

let btnStart = document.querySelector('#play');
btnStart.addEventListener('click', Sudoku, {once: true});