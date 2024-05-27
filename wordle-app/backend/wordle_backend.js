/**
 * read    GET - Safe, Idempotent, Cachable
 * update  PUT - Idempotent
 * delete  DELETE - Idempotent
 * create  POST
 *
 * https://restfulapi.net/http-methods/
 * https://restfulapi.net/http-status-codes/
 *
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
 * https://restfulapi.net/rest-put-vs-post/
 **/

const port = 8630; 
const express = require('express');

const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());
const fs = require('fs');
const Wordle = require("./model.js");

const database = {};
var words = ["words"]; // just in case!!

/******************************************************************************
 * word routines
 ******************************************************************************/

// Read in all words, lets hope this finished before we need the words!
// https://www.memberstack.com/blog/reading-files-in-node-js
fs.readFile('./words.5', 'utf8', (err, data) => {
        if (err)console.error(err);
        else words = data.split("\n");
});

/******************************************************************************
 * middleware
 ******************************************************************************/
app.use(express.json()); // support json encoded bodies
app.use(express.urlencoded({ extended: true })); // support encoded bodies

// https://expressjs.com/en/starter/static-files.html
// app.use(express.static('static-content')); 

/******************************************************************************
 * routes
 ******************************************************************************/
app.get('/api/username/', function (req, res) {
	let username = req.cookies['username'];

    if (username && database[username]) {
        res.status(200).json({"username": username});
    } else {
        let wordle = new Wordle(words);
        username = wordle.getUsername();

        database[username] = wordle;
        res.cookie('username', username, { maxAge: 86400000, httpOnly: true });

        res.status(200).json({"username": username});
    }
});

app.put('/api/username/:username/newgame', function (req, res) {
	let username=req.params.username;

	if(!(username in database)){
		let wordle=new Wordle(words);
		wordle.setUsername(username);
		database[username]=wordle;
	} 
	database[username].reset();

	res.status(200);
	res.json({"status":"created"});
});

// Add another guess against the current secret word
app.post('/api/username/:username/guess/:guess', function (req, res) {
	let username=req.params.username;
	let guess=req.params.guess;

	if(! username in database){
		res.status(409);
		res.json({"error":`${username} does not have an active game`});
		return;
	}
	var data = database[username].makeGuess(guess);
	res.status(200);
	res.json(data);
});

app.get('/cookie',function(req, res){
	res.cookie(cookie_name, 'cookie_value');
	return res.send('cookie has been set!');
	});

app.listen(port, function () {
  	console.log('Example app listening on port '+port);
});

