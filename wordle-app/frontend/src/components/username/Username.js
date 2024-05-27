import React, { useState, useEffect } from 'react';

const Username = ({ username }) => {
    return (
        <div className="ui_top">
			<h2>username: <span >{username}</span></h2>
		</div>
    );

};

export default Username;