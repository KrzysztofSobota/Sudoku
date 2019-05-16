'use strict';

function Sudoku() {
  let game = document.querySelector('.gamespace');

  for (let j=1; j<=81; j++) {
    game.insertAdjacentHTML('afterbegin', `<div class="squares"><span></span></div>`);
  }

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

    /*let timer = window.setInterval(tick(Date.now()), 1000);*/
  
    let fun = document.querySelector('#opt1');
    let record = document.querySelector('#opt2');
    let watch = document.querySelector('#time_now');
  
  function chooseGameType() {    
    if (fun.checked == true) {
      fun.value = 1;
      record.value = 0;
    } 
    else {
      fun.value = 0;
      record.value = 1;
      window.setInterval(tick(Date.now()), 1000);
    }
  }
  
  fun.addEventListener('change', chooseGameType, false);
  record.addEventListener('change', chooseGameType, false);
  
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

  arrayParts();
  
  let sum = fullArray.reduce(function(previousValue, currentValue, index, array) {
      return previousValue + currentValue;
    });
    if(sum != 405) {
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
  mainDiagonals;
  
  
  let listGroup = document.querySelector('#level-list');
  
  function selectedValues() {
    let listValue = listGroup.value;
    let testNumber = parseInt(listValue);
    return testNumber;
  }
  
  let n = selectedValues();  
  
  listGroup.addEventListener('change', selectedValues);
  
  function insertDigits(n) {
    let cellDigits = document.querySelectorAll('.squares > span');
    let indexArray = [];  
      for (let i = 0; i < n; i++) {
        let indexNumber = Math.floor(Math.random() * (fullArray.length - i));
        indexArray.push(indexNumber);
      }
        
      
      for (let k = 0; k < fullArray.length; k++) {
        if (k == n) {
          cellDigits[indexNumber].textContent = '';        
        }
        cellDigits[k].textContent = `${fullArray[k]}`;
      }
  }
  
  insertDigits(n);
  
  let btnReset = document.querySelector('#reset');
  btnReset.addEventListener('click', function reset() {
    window.clearInterval(tick(Date.now()));
    
    let sudokuImage = document.querySelector('.gamespace');
    sudokuImage.style.backgroundImage = 'url(/example.png)';
  }, false);
  
  
}

let btnStart = document.querySelector('#play');
btnStart.addEventListener('click', Sudoku, {once: true});