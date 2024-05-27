import React, { useState, useEffect } from 'react';
import { api_getUsername, api_guess, api_newgame }  from './api'; 
import '../index.css';
import Username from './username/Username';
import Game from './game/Game';
import Instructions from './instructions/Instructions';
import Solo from './solo/Solo';
import Stats from './stats/Stats';

class Header extends React.Component {
  constructor(props) {
    super(props);
  
  }

  
  render() {
    const {activeNav} = this.props;
    return (
		<header>
      <nav className="ui_nav">
        <span className="alignleft"></span>
        <span className="aligncenter">
          <a className={`ui_home ${activeNav === 'solo' ? 'active' : ''}`} onClick={() => this.props.onClick('solo')}>309DLE</a>
        </span>
        <span className="alignright">
          <a className={`ui_username ${activeNav === 'username' ? 'active' : ''}`} onClick={() => this.props.onClick('username')}><span className="material-symbols-outlined"> person </span></a>
          <a className={`ui_game ${activeNav === 'game' ? 'active' : ''}`} onClick={() => this.props.onClick('game')}><span className="material-symbols-outlined"> play_circle </span></a>
          <a className={`ui_stats ${activeNav === 'stats' ? 'active' : ''}`} onClick={() => this.props.onClick('stats')}><span className="material-symbols-outlined"> leaderboard </span></a>
          <a className={`ui_instructions ${activeNav === 'instructions' ? 'active' : ''}`} onClick={() => this.props.onClick('instructions')}><span className="material-symbols-outlined"> help </span></a>
        </span>
      </nav>
		</header>
    );
  }
}

const Main = () => {
  const [activeNav, setActiveNav] = useState('username');
  const [username, setUsername] = useState('');
  const [won, setWon] = useState(0);
  const [lost, setLost] = useState(0);
  const getAlphabetMap = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const alphabetMap = {};
    for (const char of alphabet){
      alphabetMap[char] = 'not_guessed';
    }
    return alphabetMap;
  };
  const [guiState, setGuiState] = useState({
    row: 0,
    col: 0,
    guesses: Array(6).fill(Array(5).fill(' ')),
    state: 'None',
    alphabetMap: getAlphabetMap(),
  });

  useEffect(() => {
    api_getUsername((data) => {
      setUsername(data.username);
    });
  }, []);

  

  const setGame = () => {
    setActiveNav('game');
  };

  const handleNavClick = (navItem) => {
    setActiveNav(navItem);
  }

  const renderContent = () => {
    switch(activeNav) {
      case 'username':
        return <Username username={username} />;
      case 'game':
        return <Game username={username} guiState={guiState} setGuiState={setGuiState}
         getAlphabetMap={getAlphabetMap} won={won} lost={lost} setWon={setWon} setLost={setLost} />;
      case 'instructions':
        return <Instructions />;
      case 'stats':
        return < Stats won={won} lost={lost} setWon={setWon} setLost={setLost}/>;
        case 'solo':
          return <Solo setGame={setGame} />;
      default:
        return <div>Home</div>;
    }
  }

  return (
	<div>
		<Header onClick={handleNavClick} 
    activeNav = {activeNav}
    />
    {renderContent()}
	</div>
    );
}
export { Main };
