(function(){

	const app = document.querySelector(".app");
	const socket = io();

	let uname;

	//this function will take the user to chat room
	app.querySelector(".join-screen #join-user").addEventListener("click",function(){
		let username = app.querySelector(".join-screen #username").value;  // fetch the name of user from input
		if(username.length == 0){
			return;
		}
		socket.emit("newuser",username); //emit message to server that new user has joined
		uname = username;
		app.querySelector(".join-screen").classList.remove("active"); //this will hide the join chat screen
		app.querySelector(".chat-screen").classList.add("active");//display chat room to user
	});


	//this function get the message from user and set it server  then server will broadcast message to all users
	app.querySelector(".chat-screen #send-message").addEventListener("click",function(){
		let message = app.querySelector(".chat-screen #message-input").value;
		if(message.length  == 0){
			return;
		}
		//this will render message on chat box
		renderMessage("my",{
			username:uname,
			text:message
		});
		//send the message to server
		socket.emit("chat",{
			username:uname,
			text:message
		});
		app.querySelector(".chat-screen #message-input").value = "";
	});

	// when exit chatbox it will send update to server
	app.querySelector(".chat-screen #exit-chat").addEventListener("click",function(){
		socket.emit("exituser",uname);
		window.location.href = window.location.href;
	});

	socket.on("update",function(update){
		renderMessage("update",update);
	});
	
	socket.on("chat",function(message){
		renderMessage("other",message);
	});


	//this will render the message in chat box
	function renderMessage(type,message){
		let messageContainer = app.querySelector(".chat-screen .messages");

		//when message by user itself it will appear on left side of chat box
		if(type == "my"){
			let el = document.createElement("div");
			el.setAttribute("class","message my-message");
			el.innerHTML = `
				<div>
					<div class="name">You</div>
					<div class="text">${message.text}</div>
				</div>
			`;
			messageContainer.appendChild(el);
		} else if(type == "other"){   //when message by another user it will appear on right side of chat box
			let el = document.createElement("div");
			el.setAttribute("class","message other-message");
			el.innerHTML = `
				<div>
					<div class="name">${message.username}</div>
					<div class="text">${message.text}</div>
				</div>
			`;
			messageContainer.appendChild(el);
		} else if(type == "update"){
			let el = document.createElement("div");
			el.setAttribute("class","update");
			el.innerText = message;
			messageContainer.appendChild(el);
		}
		// scroll chat to end
		messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
	}

})();
