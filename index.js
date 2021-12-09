const express = require("express");
const path = require("path");
const port = 8000;
const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname+"/assets"))); //static files setup

app.use('/', require('./routes')); 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));


io.on("connection", function(socket){ // when user connected 
	socket.on("newuser",function(username){ // send update to all existing users that new user is joined the chat
		socket.broadcast.emit("update", username + " joined the conversation");
	});
	socket.on("exituser",function(username){  //when user left the chat it will notify other users
		socket.broadcast.emit("update", username + " left the conversation");
	});
	socket.on("chat",function(message){ // for emmit the message to all users
		socket.broadcast.emit("chat", message);
	});
});

server.listen(port, function(err){
	if(err){console.log("Error in running server"); return};
	console.log("Server is up and running on port: ", port )
});