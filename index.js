const express = require('express');
const app = express();
const APIAI_TOKEN = process.env.APIAI_TOKEN;
const APIAI_SESSION_ID = process.env.APIAI_SESSION_ID;

app.use(express.static(__dirname + '/views')); // html
app.use(express.static(__dirname + '/public')); // js, css, images

const server = app.listen(5000);


const io = require('socket.io')(server);

io.on('connection', function(socket){
  console.log('An user connected');
});

const apiai = require('apiai')(APIAI_TOKEN);

// Web UI
app.get('/', (req, res) => {
  res.sendFile('index.html');
});

io.on('connection', function(socket) {
	socket.on('chat message', (text) => {

		let apiaiReq = apiai.textRequest(text, {
			sessionId:APIAI_SESSION_ID
		});

		apiaiReq.on('response', (response) => {
			let aiText = response.result.fulfillment.speech;
			socket.emit('bot reply', aiText);
		});

		apiaiReq.on('error', (error) => {
			console.log(error);
		});

			apiaiReq.end();
	});
});
