import React, { useState, useEffect } from 'react';

const Solo = ({setGame}) => {
    return (
        <div className="ui_top">
        <div className="textblock" onClick={setGame}> 
            Solo
            <br/>
            Play the classic game against yourself. 
        </div>
    </div>
    );

};

export default Solo;