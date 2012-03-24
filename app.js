
/**
 * Module dependencies.
 */

var express = require('express')
  , app = express.createServer()
  , routes = require('./routes')
  , io = require('socket.io').listen(app)
  , game = require("./game.js")

  app.use(express.static(__dirname + '/public'));

// routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});


app.get('/game', function(req, res){
	res.render(__dirname + '/views/game.jade', {title: "this is the title", game: game.getGame()});
});



// usernames which are currently connected to the chat
var usernames = {};

var changeState = function(state){
	console.log("app changeState" + state)
	if (game.setState(state)){
		io.sockets.emit('game', 'SERVER', game.getGame())
		return true
	}
	else
		return false
}

io.sockets.on('connection', function (socket) {
	// User requests a new game
	socket.on('newround', function (data) {
		console.log("***** NEW ROUND")
		if(changeState('entry')){
			setTimeout(function(){changeState('vote')}, 5000)
			setTimeout(function(){changeState('result')}, 10000)
		}
	});
	
	// User sends an entry or vote
	socket.on('entry', function(data) {
		console.log("*** ENTRY RECEIVED" + data.text)
		if (game.addEntry(data.text))
			io.sockets.emit('game', 'SERVER', game.getGame())
	})

	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (data) {
		// we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.emit('updatechat', socket.username, data);
	});

	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function(username){
		// we store the username in the socket session for this client
		socket.username = username;
		// add the client's username to the global list
		usernames[username] = username;
		// echo to client they've connected
		socket.emit('updatechat', 'SERVER', 'you have connected');
		// echo globally (all clients) that a person has connected
		socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
		// update the list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
	});

	// when the user disconnects.. perform this
	socket.on('disconnect', function(){
		// remove the username from global usernames list
		delete usernames[socket.username];
		// update list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
		// echo globally that this client has left
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
	});
});

// Init the game


app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
