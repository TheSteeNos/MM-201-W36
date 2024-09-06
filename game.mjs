//#region Dont look behind the curtain
// Do not worry about the next two lines, they just need to be there. 
import * as readlinePromises from 'node:readline/promises';
const rl = readlinePromises.createInterface({ input: process.stdin, output: process.stdout });

async function askQuestion(question) {
    return await rl.question(question);
}

//#endregion

import { ANSI } from './ansi.mjs';
import { HANGMAN_UI } from './graphics.mjs';

/*
    1. Pick a word
    2. Draw one "line" per char in the picked word.
    3. Ask player to guess one char || the word (knowledge: || is logical or)
    4. Check the guess.
    5. If guess was incorect; continue drawing 
    6. Update char display (used chars and correct)
    7. Is the game over (drawing complete or word guessed)
    8. if not game over start at 3.
    9. Game over
*/
let words = ["apple", "mountain", "blue", "whisper", "chair", "lamp", "rain", "keyboard", "sunshine", "tiger", "basket", "cloud", "ocean", "planet", "book", "bicycle", "river", "bridge", "garden", "camera", "pillow", "blanket", "window", "forest", "elephant", "car", "guitar", "flame", "shadow", "ice", "paper", "rose", "butterfly", "engine", "school", "village", "coffee", "feather", "desert", "mirror", "snow", "pencil", "castle", "door", "diamond", "rocket", "piano", "moon", "sail", "train", "volcano", "cup", "chocolate", "silk", "puzzle", "ghost", "pocket", "street", "flute", "honey", "sand", "library", "mountain", "parrot", "hat", "fire", "star", "candle", "notebook", "key", "watch", "sign", "shoe", "pyramid", "banana", "pearl", "ship", "tree", "sun", "cliff", "pear", "dragon", "waterfall", "clock", "glove", "wind", "egg", "lemon", "mirror", "river", "cactus", "whale", "match", "bell", "forest", "crown", "ribbon", "motor", "violet", "umbrella", "kite", "rainbow", "scarf", "wood", "breeze", "cloud", "wheel", "mountain", "light", "leaf", "spoon", "bench", "rabbit", "piano", "grape", "teapot", "hill", "button", "storm", "shell", "sunset", "bucket", "spark", "owl", "thread", "snowflake", "bridge", "suitcase", "keyhole", "radio", "lamp", "door", "apple", "paper", "cotton", "salt", "fountain", "cup", "jungle", "straw", "castle", "seed", "plank", "fish", "orange", "coin", "thread", "shark", "gem", "tooth", "motor", "chalk", "horn", "bush", "beard", "ice", "tunnel", "kite", "pebble", "butter", "feather", "firefly", "stone", "puddle", "crane", "rocket", "bone", "bucket", "shadow", "yarn", "frost", "garden", "cane", "glue", "globe", "hedge", "ship", "helmet", "chalk", "rope", "mask", "fan", "zipper", "breeze", "shovel", "vest", "blanket", "tent", "stick", "fence", "towel", "leash", "jar", "kite", "toy", "shell", "moss", "arrow", "brick", "cloud", "cushion"];
let correctWord = words[randomWord(words.length)];
const numberOfCharInWord = correctWord.length;
let guessedWord = "".padStart(correctWord.length, "_");
let wordDisplay = "";
let isGameOver = false;
let wasGuessCorrect = false;
let wrongGuesses = [];

function randomWord(max) {

    return Math.floor(Math.random() * max)

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

function listOfWrongGuesses(list, color) {
    let output = color;
    for (let i = 0; i < list.length; i++) {
        output += list[i] + " ";
    }

    return output + ANSI.RESET;
}

while (isGameOver == false) {

    console.log(ANSI.CLEAR_SCREEN);
    console.log(drawWordDisplay());
    console.log(listOfWrongGuesses(wrongGuesses, ANSI.COLOR.RED));
    console.log(HANGMAN_UI[wrongGuesses.length]);

    const answer = (await askQuestion("Guess a character or the word: ")).toLowerCase();

    if (answer == correctWord) {
        isGameOver = true;
        wasGuessCorrect = true;
    } else if (ifPlayerGuessedLetter(answer)) {

        let org = guessedWord;
        guessedWord = "";

        let isCorrect = false;
        for (let i = 0; i < correctWord.length; i++) {
            if (correctWord[i] == answer) {
                guessedWord += answer;
                isCorrect = true;
            } else {
                guessedWord += org[i];
            }
        }

        if (isCorrect == false) {
            wrongGuesses.push(answer);
        } else if (guessedWord == correctWord) {
            isGameOver = true;
            wasGuessCorrect = true;
        }
    }

    if (wrongGuesses.length == HANGMAN_UI.length - 1) {
        isGameOver = true;
    }

}

console.log(ANSI.CLEAR_SCREEN);
console.log(drawWordDisplay());
console.log(listOfWrongGuesses(wrongGuesses, ANSI.COLOR.RED));
console.log(HANGMAN_UI[wrongGuesses.length]);

if (wasGuessCorrect) {
    console.log(ANSI.COLOR.YELLOW + "Congratulations! You guessed the correct word!");
}

if (wrongGuesses.length == HANGMAN_UI.length - 1) {
    console.log ("The answer was: " + (ANSI.COLOR.GREEN + correctWord))
    console.log(ANSI.COLOR.RED + "Game Over!")
}

const answer = (await askQuestion("Want to play again? Enter y for yes, or n for no: "))


function ifPlayerGuessedLetter(answer) {
    return answer.length == 1
}