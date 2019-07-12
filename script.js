'use strict';
/*window.addEventListener("DOMContentLoaded", Sudoku);*/

function Sudoku() {
  let game = document.querySelector('.gamespace');
  
	/* Fill gameboard with 81 (9x9) small squares */
  for (let j = 1; j <= 81; j++) {
    game.insertAdjacentHTML('afterbegin', `<div class="squares"><span class="num"></span></div>`);
  }
	
	let square = document.querySelectorAll('.squares');
	
	/* 4 red borders divide board into 9 squares */
	function redBorders() {
		for (let i = 2; i <= 81;) {
			square[i].style.borderRight = '2px solid red';
			square[i + 3].style.borderRight = '2px solid red';
			square[i + 1].style.borderLeft = '2px solid red';
			square[i + 4].style.borderLeft = '2px solid red';
			i = i + 9;
		}
		for (let i = 18; i <= 26; i++) {
			square[i].style.borderBottom = '2px solid red';	
			square[i + 27].style.borderBottom = '2px solid red';
		}
		for (let i = 27; i <= 35; i++) {
			square[i].style.borderTop = '2px solid red';
			square[i + 27].style.borderTop = '2px solid red';
		}
	};
	
	redBorders();
	
	/* 'sortArray' is the first (base) 9-elements array and the most important part of the all code */
  let sortArray = [];
	
  function sorting() {
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		let n = numbers.length;
			for (let i = 1; i <= n; ) {
				// random index 'a' number from 'numbers' array
				let a = Math.floor(Math.random() * n); 

				// get digit from index position
				let b = numbers[a]; 
				sortArray.push(b);
				numbers.splice(a, 1);
				
				n--;
      }
      
    return sortArray;
  }

//  Make 27 part of small arrays
  let fullArray = [];
	
  function arrayParts() {
    sorting();
		
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

}

/* Selected number of digits (game level type) */
function gameLevel() {
  let listGroup = document.querySelector('#level-list');
  
  function selectedValues() {
    let listValue = listGroup.value;
    let testNumber = parseInt(listValue);

    return testNumber;
  }

  let n = selectedValues();
  listGroup.addEventListener('change', selectedValues);

  insertDigits(n);
}  
  
  
/* Put selected number of digits (n) into the board */
  let noRepeatArray = [];

  function insertDigits(n) {    
		/* Taking index numbers - it is n-indexes loop, where 'n' depends on game level */
    let indexNumber = undefined;
    
    let indexArray = Array.from(fullArray); // copy of 'fullArray' to make the operations on it
    let tempValue = [];
    let k = 0;
    
    console.log(indexArray);
		do {
			/* random index number from 'indexArray' array, then get digit 1-9 from index position -> fullArray[indexNumber]*/
			indexNumber = Math.floor(Math.random() * indexArray.length);
			indexArray.splice(indexNumber, 1, '');
			tempValue.push(indexNumber);			
			
			noRepeatArray = [ ...new Set(tempValue) ];
			k = noRepeatArray.length;
		} while (k < n);
    
    fill();
    fillBoard();
  }

      /* if (indexNumber = undefined) {
        game.src = '/example.svg';
      } */
    /* Insert white/empty area to input digits into the board */
		function fill() {
			for (let i = 0; i < n; i++) {
				square[noRepeatArray[i]].insertAdjacentHTML('afterbegin', `<input type="text" class="digit" maxlength="1" size="2">`);
			}			
    }    

    /* Board is filled with digits and some of them are already covered beyond the user sight */
    function fillBoard() {
      let cellDigits = document.querySelectorAll('.squares > span'); // define space to put 81 digits
      for (let i = 0; i < indexArray.length; i++) {
        cellDigits[i].innerHTML = `${indexArray[i]}`;
      }
    }
		
      
    /* Define 2 variables to compare inserted digits with them positions in original array 'fullArray' */
		// let fullArrayValues = Array.from(indexArray.values());
    // let fullArrayKeys = Array.from(indexArray.keys());    
		
    function compare() {

    }
  

/* Sudoku start only when type and level of game are checked */
  let btnStart = document.querySelector('#play');
  let btnReset = document.querySelector('#reset');

  btnStart.addEventListener('click', playGame);

  function playGame() {
    Sudoku();
    gameLevel();
  }

  /* Timer */
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
    
  btnStart.addEventListener('click', toggleTimer);
  btnReset.addEventListener('click', toggleTimer);
  
  // Check clicked type of radiobox
  let fun = document.getElementById('timeOff');
  let record = document.getElementById('timeOn');
  
  function toggleTimer(event) {
  let button = event.target.id;
  
    if (button = 'play' && record.checked == true) {
      window.setInterval(tick(Date.now()), 1000);
      // Sudoku();
      // insertDigits(n);
    } 
    
    if (button = 'reset') {        
      clearInterval(window.setInterval(tick()));
    }
  }


/* Remove selected options and make them defaults */
btnReset.addEventListener('click', optionsClear);

/* lables */
const lables = document.querySelectorAll(".gameopt");

/* radio */
const radioButtons = document.querySelectorAll("[type='radio']");

function radioReset() {
  lables.forEach(lable => {
    lable.style.setProperty("--bg", "transparent");
  });
  radioButtons.forEach(radioBtn => {
    radioBtn.checked = false;
  });
}

/* select */
const list = document.querySelector("#level-list");

function listReset() {
  list.selectedIndex = 0;
}

function optionsClear() {
/* All fields reset */
  radioReset();
  listReset();
/* default graphic on the board */
  document.querySelector('.sudoku').style.background = 'url(/example.svg)';
}