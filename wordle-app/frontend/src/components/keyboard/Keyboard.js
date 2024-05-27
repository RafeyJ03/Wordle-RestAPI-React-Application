import React from 'react';

const Keyboard = ({pressedKey, guiState}) => {

    const { alphabetMap } = guiState;

    const handleKeyClick = (key) => {
        pressedKey(key); 

    };

    const getColorForLetter = (letter) => {
      const status = alphabetMap[letter];
      switch (status) {
          case 'guessed_not_present':
              return 'darkgray';
          case 'wrong_pos':
              return 'orange';
          case 'right_pos':
              return 'green';
          default:
              return 'black';
      }
  };


    return(
        <>
        <table className="keyboardrow">
            <tbody>
              <tr>{'QWERTYUIOP'.split('').map((letter) =>  <td key={letter} onClick={() => handleKeyClick(letter)} style={{backgroundColor: getColorForLetter(letter)}}>{letter}</td>)}</tr>
            </tbody>
          </table>
          <table className="keyboardrow">
            <tbody>
              <tr>{'ASDFGHJKL'.split('').map((letter) =>  <td key={letter} onClick={() => handleKeyClick(letter)} style={{backgroundColor: getColorForLetter(letter)}}>{letter}</td>)}</tr>
            </tbody>
          </table>
          <table className="keyboardrow">
            <tbody>
              <tr>
                <td onClick={() => handleKeyClick('DEL')} >DEL</td>
                {'ZXCVBNM'.split('').map((letter) =>  <td key={letter} onClick={() => handleKeyClick(letter)} style={{backgroundColor: getColorForLetter(letter)}}>{letter}</td>)}
                <td onClick={() => handleKeyClick('ENTER')}>ENTER</td>
              </tr>
            </tbody>
          </table>
          </>
    )
}

export default Keyboard