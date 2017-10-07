const express = require('express')
const app = express();

app.use(express.static(__dirname + '/views')); // html
app.use(express.static(__dirname + '/public')); // js, css, images

const server = app.listen(5000);
app.get('/', (req, res) => {
	res.sendFile('index.html');
)};

const APIAI_TOKEN = ''
const APIAI_SESSION_ID = ''
const apiai = require('apiai')(APIAI_TOKEN);

io.on('connection', function(socket) {
	socket.on('chat message', (text) => {

		let apiaiReq = apiai.textRequest(text, {
			sessionId: APIAI_SESSION_ID
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
