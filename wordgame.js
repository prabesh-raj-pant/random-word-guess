const letters = document.querySelectorAll('.box');
const loading = document.querySelector('.inf');

async function init() {
  let guess = '';
  let row = 0;
  let isLoading=true;


  const res=await fetch("https://words.dev-apis.com/word-of-the-day");
  const resObj=await res.json();
  const word=resObj.word.toUpperCase();
  const wordParts=word.split("");
  let win=false;
  setLoading(false); 
  isLoading=false;

  function addLetter(letter) {
    if (guess.length < 5) {
      // add letter at the end
      guess += letter;
    } else {
      // replace the last letter
      guess = guess.substring(0, guess.length - 1) + letter;
    }
    letters[5 * row + guess.length - 1].innerText = letter;

  }
  async function enter() {
    if (guess.length !== 5
    ) {
      // nothing
      return;
    }
   


    isLoading=true;
    setLoading(true)
    const res=await fetch("https://words.dev-apis.com/validate-word",{
      method:"POST",
      body:JSON.stringify({word:guess})
    });

    const resObj=await res.json();
    const validWord=resObj.validWord;
    isLoading=false;
    setLoading(false);
    if(!validWord){
      markInvalidWord();
      return;
    }

    const guessParts=guess.split("");
    const repeat=nonRepeat(wordParts);


    for(let i=0;i<5; i++){
      if(guessParts[i]===wordParts[i]){
        letters[row*5+i].classList.add("correct");
        repeat[guessParts[i]]--;
      }
    }


    for (let i = 0; i < 5; i++) {
      if(guessParts[i]===wordParts[i]){

        // nothing
      }else if(wordParts.includes(guessParts[i])&& repeat[guessParts[i]]>0){
        letters[row*5+i].classList.add("close");
        repeat[guessParts[i]]--;
      }
      else{
        letters[row*5+i].classList.add("wrong");
      }
      
    }
    
    row++;
    
    if(guess===word){
      // win
      alert('you win!')
      document.querySelector('.top').classList.add("winner");
      win=true;
      return;
    }else if(row===6){
      alert(`you lose,the word was ${word}`);
      win=true;
    }
    guess = ''

  }




  function backspace(){
    guess = guess.substring(0, guess.length - 1) ;
    
    letters[5 * row + guess.length ].innerText = "";

  }
  function markInvalidWord(){
    
    for (let i = 0; i < 5; i++) {
     letters[row*5+i].classList.remove("invalid");

     setTimeout(function(){
     letters[row*5+i].classList.add("invalid");
     },10);
      
    }
  }


  
  document.addEventListener('keydown',function(event) {

    if(win || isLoading){
      return;
    }
    const action = event.key;
    if (action === 'Enter') {
      enter();
    } else if (action === 'Backspace') {
      backspace();
    } else if (isLetter(action)) {
      addLetter(action.toUpperCase())
    } else {
      // nothing to do
    }
  });
}

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}
function setLoading(isLoading){
  loading.classList.toggle('hidden', !isLoading)
}
function nonRepeat(array){
  const obj={};
  for (let i = 0; i < array.length; i++) {
    const letter = array[i];
    if(obj[letter]){
      obj[letter]++;
    }else{
      obj[letter]=1;
    }
  }
  return obj;
}
init();

// document.querySelector(".box");
// document.addEventListener("keydown", function (event) {
//     if (isLetter(event.key) === false ) {
//             event.preventDefault();
//     }   
// });

// let inp = document.getElementsByClassName('box')
// Array.from(inp).forEach(function (inp) {
//   inp.addEventListener("keyup", function (event) {
//     if (inp.value.length == 1) {
//       // Focus on the next sibling
//       inp.nextElementSibling.focus()
//     }
//   });
// })
