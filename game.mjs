//#region Don´t look behind the curtain
// Do not worry about the next two lines, they just need to be there. 
import * as readlinePromises from 'node:readline/promises';
const rl = readlinePromises.createInterface({ input: process.stdin, output: process.stdout });

async function askQuestion(question) {
    return await rl.question(question);
}

//#end_region

import { ANSI } from './ansi.mjs';
import { HANGMAN_UI } from './graphics.mjs';

let willPlayerContinue = true;
let totalWrongGuesses = 0;
let totalCompletedPuzzles = 0;
let totalRoundsPlayed = 0;

const PLAYER_PROMPTS_AND_INFO = {
WIN: "Congratulations! You got the correct word!",
GUESS_PROMPT: "Guess a character or the word: ",
GAME_OVER: "Game Over!",
ANSWER_REVEAL: "The answer was: ",
CONTINUE_PROMPT: "Want to play again? Enter yes or no: ",
THANK_PLAYER: "Thank you for playing!",
STAT_INFO: "Statistics: ",
WRONG_GUESS_AMOUNT: "Total wrong guesses: ",
COMPLETED_PUZZLES: "Total completed puzzles: ",
ROUNDS_PLAYED: "Total rounds played: ",
PLAYER_ACCEPT: "yes",
PLAYER_DENY: "no",
EXIT_PROMPT: "Enter any key to exit the program: "
};

const CHAR = {
SPACE: " ",
EMPTY: "",
LINE: "_",
}

while (willPlayerContinue == true) {

    let words = ["apple", "mountain", "blue", "whisper", "chair", "lamp", "rain", "keyboard", "sunshine", "tiger", "basket", "cloud", "ocean", "planet", "book", "bicycle", "river", "bridge", "garden", "camera", "pillow", "blanket", "window", "forest", "elephant", "car", "guitar", "flame", "shadow", "ice", "paper", "rose", "butterfly", "engine", "school", "village", "coffee", "feather", "desert", "mirror", "snow", "pencil", "castle", "door", "diamond", "rocket", "piano", "moon", "sail", "train", "volcano", "cup", "chocolate", "silk", "puzzle", "ghost", "pocket", "street", "flute", "honey", "sand", "library", "mountain", "parrot", "hat", "fire", "star", "candle", "notebook", "key", "watch", "sign", "shoe", "pyramid", "banana", "pearl", "ship", "tree", "sun", "cliff", "pear", "dragon", "waterfall", "clock", "glove", "wind", "egg", "lemon", "mirror", "river", "cactus", "whale", "match", "bell", "forest", "crown", "ribbon", "motor", "violet", "umbrella", "kite", "rainbow", "scarf", "wood", "breeze", "cloud", "wheel", "mountain", "light", "leaf", "spoon", "bench", "rabbit", "piano", "grape", "teapot", "hill", "button", "storm", "shell", "sunset", "bucket", "spark", "owl", "thread", "snowflake", "bridge", "suitcase", "keyhole", "radio", "lamp", "door", "apple", "paper", "cotton", "salt", "fountain", "cup", "jungle", "straw", "castle", "seed", "plank", "fish", "orange", "coin", "thread", "shark", "gem", "tooth", "motor", "chalk", "horn", "bush", "beard", "ice", "tunnel", "kite", "pebble", "butter", "feather", "firefly", "stone", "puddle", "crane", "rocket", "bone", "bucket", "shadow", "yarn", "frost", "garden", "cane", "glue", "globe", "hedge", "ship", "helmet", "chalk", "rope", "mask", "fan", "zipper", "breeze", "shovel", "vest", "blanket", "tent", "stick", "fence", "towel", "leash", "jar", "kite", "toy", "shell", "moss", "arrow", "brick", "cloud", "cushion"];
    let wordDisplay = CHAR.EMPTY;
    let correctWord = words[getRandomNumber(words.length)];
    const numberOfCharInWord = correctWord.length;
    let guessedWord = CHAR.EMPTY.padStart(correctWord.length, CHAR.LINE);
    let wrongGuesses = [];
    let wordStorage = [];
    let isGameOver = false;
    let wasGuessCorrect = false;

    while (isGameOver == false) {

        console.log(ANSI.CLEAR_SCREEN);
        console.log(drawWordDisplay());
        console.log(listOfWrongGuesses(wrongGuesses, ANSI.COLOR.RED));
        console.log(HANGMAN_UI[wrongGuesses.length + wordStorage.length]);

        const answer = (await askQuestion(PLAYER_PROMPTS_AND_INFO.GUESS_PROMPT)).toLowerCase();

        if (answer == correctWord) {
            isGameOver = true;
            wasGuessCorrect = true;
        
        } 
        else if (ifPlayerGuessed(answer)) {

            let org = guessedWord;
            guessedWord = CHAR.EMPTY;

            let isCorrect = false;
            for (let i = 0; i < correctWord.length; i++) {
                if (correctWord[i] == answer) {
                    guessedWord += answer;
                    isCorrect = true;
                } else {
                    guessedWord += org[i];
                }
            }
            if (wrongGuesses.includes(answer)) {
                wordStorage.push(answer);
                totalWrongGuesses++;
            } 
            else if (isCorrect == false) {
                wrongGuesses.push(answer);
                totalWrongGuesses++;
            } 
            else if (guessedWord == correctWord) {
                isGameOver = true;
                wasGuessCorrect = true;
                totalCompletedPuzzles++;
            }
        }

        if (wrongGuesses.length + wordStorage.length == HANGMAN_UI.length - 1) {
            isGameOver = true;
        }

    }

    console.log(ANSI.CLEAR_SCREEN);
    console.log(drawWordDisplay());
    console.log(listOfWrongGuesses(wrongGuesses, ANSI.COLOR.RED));
    console.log(HANGMAN_UI[wrongGuesses.length + wordStorage.length]);

    if (wasGuessCorrect) {
        console.log(ANSI.COLOR.YELLOW + PLAYER_PROMPTS_AND_INFO.WIN + ANSI.RESET);
    }

    if (wrongGuesses.length + wordStorage.length == HANGMAN_UI.length - 1) {
        console.log (PLAYER_PROMPTS_AND_INFO.ANSWER_REVEAL + (ANSI.COLOR.GREEN + correctWord));
        console.log(ANSI.COLOR.RED + PLAYER_PROMPTS_AND_INFO.GAME_OVER + ANSI.RESET);
    }

    const answer = (await askQuestion(PLAYER_PROMPTS_AND_INFO.CONTINUE_PROMPT)).toLowerCase();
    totalRoundsPlayed++;

    if (answer == PLAYER_PROMPTS_AND_INFO.PLAYER_ACCEPT) {
        willPlayerContinue = true;
    }
    else if (answer == PLAYER_PROMPTS_AND_INFO.PLAYER_DENY) {
        willPlayerContinue = false;
    }
    else {
        willPlayerContinue = false;
    }


    function getRandomNumber(max) {

        return Math.floor(Math.random() * max)
    
    }
    
    function ifPlayerGuessed(answer) {
        return answer.length;
    }
    
    function listOfWrongGuesses(list, color) {
        let output = color;
        for (let i = 0; i < list.length; i++) {
            output += list[i] + " ";
        }
    
        return output + ANSI.RESET;
    }
    
    function drawWordDisplay() {
    
        wordDisplay = "";
    
        for (let i = 0; i < numberOfCharInWord; i++) {
            if (guessedWord[i] != "_") {
                wordDisplay += ANSI.COLOR.GREEN;
            }
            wordDisplay = wordDisplay + guessedWord[i] + " ";
            wordDisplay += ANSI.RESET;
        }
    
        return wordDisplay;
    }


}


console.log(ANSI.CLEAR_SCREEN);
console.log(PLAYER_PROMPTS_AND_INFO.THANK_PLAYER)
console.log(CHAR.EMPTY);
console.log(PLAYER_PROMPTS_AND_INFO.STAT_INFO);
console.log(PLAYER_PROMPTS_AND_INFO.ROUNDS_PLAYED + ANSI.COLOR.YELLOW + totalRoundsPlayed + ANSI.RESET);
console.log(PLAYER_PROMPTS_AND_INFO.COMPLETED_PUZZLES + ANSI.COLOR.GREEN + totalCompletedPuzzles + ANSI.RESET);
console.log(PLAYER_PROMPTS_AND_INFO.WRONG_GUESS_AMOUNT + ANSI.COLOR.RED + totalWrongGuesses + ANSI.RESET);
console.log(CHAR.EMPTY);
const answer = (await askQuestion(PLAYER_PROMPTS_AND_INFO.EXIT_PROMPT));
if (answer) {
    console.log(ANSI.CLEAR_SCREEN);
    process.exit();
}