import React, { useState, useEffect } from 'react';

const Stats = ({won, lost, setWon, setLost}) => {
    return (
        <div className="ui_top" style={{ fontSize: 'xx-large' }}>
        <center>
          <span className="material-symbols-outlined">check_circle</span> {won} &nbsp;
          <span className="material-symbols-outlined">cancel</span> {lost}
        </center>
      </div>
    );

};

export default Stats;