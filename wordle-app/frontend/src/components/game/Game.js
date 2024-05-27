import React, { useState, useEffect } from 'react';

import Keyboard from '../keyboard/Keyboard';
import Popup from '../popup/Popup';
import PopupError from '../popuperror/PopupError';
import { api_newgame, api_guess } from '../api';

const Game = ({ username, guiState, setGuiState, getAlphabetMap, won, lost, setWon, setLost}) => {
    const [showPopup, setShowPopup] = useState(false);
    const [showPopupError, setShowPopupError] = useState(false);
    const [popupCounter, setPopupCounter] = useState(0);
    const [popupErrorContent, setPopupErrorContent] = useState({
        message: ''
    });
    const [popupContent, setPopupContent] = useState({
        title: '',
        message: '',
        attempts: 0
    });

    const handlePop = (win) => {
        setPopupContent({
          title: win ? 'You win!' : 'You lose!',
          message: win ? 'You have guessed the correct word!' : 'Try again!',
          attempts: guiState.row + 1
        });
        setShowPopup(true);
      };

      const handlePopError = (message) => {
        setPopupErrorContent({
          message:message
        });
        setShowPopupError(true);
        setTimeout(() => {
            setShowPopupError(false);
        }, 1500);
      };

    const gui_resetGame = () => {
        setGuiState(
            {
            row: 0,
            col: 0,
            guesses: Array(6).fill(Array(5).fill(' ')),
            state: 'play',
            alphabetMap: getAlphabetMap(),
        });
    };


    const startNewGame = () => {
        api_newgame(username, (response) => {
            if (response.status === "created") {
                console.log(response.status);
                gui_resetGame();
            }
        });
    }


    const putCharacter = (char) => {
        if (guiState.col < 5){
            const newGuesses = guiState.guesses.slice(); 
            const newRow = newGuesses[guiState.row].slice(); 
            newRow[guiState.col] = char;
            newGuesses[guiState.row] = newRow;

            setGuiState((prevState) => ({
                ...prevState,
                guesses: newGuesses,
                col: prevState.col + 1,
            }));
        }
    };


    const delCharacter = () => {
        if (guiState.col > 0){
            const newGuesses = guiState.guesses.slice(); 
            const newRow = newGuesses[guiState.row].slice(); 
            newRow[guiState.col - 1] = ' ';
            newGuesses[guiState.row] = newRow;

            setGuiState((prevState) => ({
                ...prevState,
                guesses: newGuesses,
                col: prevState.col - 1,
            }));
        }
    };


    const handleKeyboardEvent = (key) => {
        if (guiState.row === 6 || guiState.state !== 'play') {
            return;
        }
        else if (key === 'ENTER'){
            if (guiState.col !== 5) {
                console.log("guess must be 5 alphabetic characters");
                handlePopError("guess must be 5 alphabetic characters");
            }
            else {
            const guess = guiState.guesses[guiState.row].join('');
            api_guess(username, guess, (data) => {
                console.log(data.status);
                if (data.success) {
                    console.log(data.state);
                    console.log(data.score);
                    console.log(data.guess);
                    console.log(data.target);
                    setGuiState((prevState) => (
                        {
                        ...prevState,
                        state: data.state,
                        row: prevState.row + 1,
                        col: 0,
                        }));

                    colourBoard(data.score);
                    if (data.state === "won"){
                        handlePop(true);
                        setWon(data.won);
                    }
                    else if (data.state === "lost"){
                        handlePop(false);
                        setLost(data.lost);
;                    }
                   
                }
                else {
                    console.log(data.error);
                    handlePopError(data.error);
                }
            });
            }
        }
        else if (key === 'DEL'){
            delCharacter();
        }
        else if (key !== 'ENTER') {
            putCharacter(key);
        }
    };

    const colourBoard = (score) => {
        const newGuesses = guiState.guesses.slice();
        const newRow = newGuesses[guiState.row].map((cell, index) => ({
            ...cell,
            color: getColorFromScore(score[index].score),
        }));

        newGuesses[guiState.row] = newRow;

        const newAlphabetMap = { ...guiState.alphabetMap };
        score.forEach(({ char, score }) => {
            if (newAlphabetMap[char] !== 'right_pos') {
                if (score === 1 && newAlphabetMap[char] !== "wrong_pos") {
                    newAlphabetMap[char] = "guessed_not_present";
                  }
                else {
                     newAlphabetMap[char] = getAlphabetMapStatusFromScore(score);
                }
            }
        });

        setGuiState((prevState) => ({
            ...prevState,
            guesses: newGuesses,
            alphabetMap: newAlphabetMap,
        }));

    };

    const getColorFromScore = (score) => {
        switch (score) {
          case 1: return 'darkgray';
          case 2: return 'orange';
          case 3: return 'green';
          default: return '';
        }
      };

    
    const getAlphabetMapStatusFromScore = (score) => {
        switch (score) {
            case 2: return 'wrong_pos';
            case 3: return 'right_pos';
            default: return '';
          }
        };


    const Board = () => {
        return guiState.guesses.map((row, rowIndex) => (
            <tr key={rowIndex} className={`row${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className={`col${cellIndex}`} style={{backgroundColor: cell.color}}>
                        {cell[0]}
                    </td>
                ))}
            </tr>
        ));
    };

    
    return (
        <div className="ui_top">
        <center>
          <table className="letterbox">
            {Board()}
          </table>
        </center>
        <br/>
        <br/>
        <center>
          <Keyboard pressedKey={handleKeyboardEvent} guiState={guiState} />
        </center>
        <br />
        <br />
        <center>
        <Popup isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        title={popupContent.title}
        message={popupContent.message}
        attempts={popupContent.attempts}
         />
        <PopupError
        isOpen={showPopupError}
        message={popupErrorContent.message}
         />
        {guiState.state !== 'play' && (
                <button onClick={startNewGame} style={{ background: 'red', fontSize: 'x-large' }}>
                    NEW GAME
                </button>
            )}
       
        </center>

      </div>
    );

};


export default Game;