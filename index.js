const express = require('express');
const app = express();
const APIAI_TOKEN = 'ca7f9f7e014d4822b8a26567853d4697';
const APIAI_SESSION_ID = 'calhacks';

app.use(express.static(__dirname + '/views')); // html
app.use(express.static(__dirname + '/public')); // js, css, images

const server = app.listen(5000);


const io = require('socket.io')(server);

io.on('connection', function(socket){
  console.log('A user connected');
});

const apiai = require('apiai')(APIAI_TOKEN);

// Web UI
app.get('/', (req, res) => {
  res.sendFile('index.html');
});

io.on('connection', function(socket) {
	socket.on('chat message', (text) => {
		console.log('Message: ' + text);
		// Get a reply from API.ai
		if(text.toUpperCase().includes('news'.toUpperCase())) {
			var keywords = ['about', 'on', 'regarding'];
			var subject = '';
			for (i = 0; i < keywords.length; i++) {
				let keyword = keywords[i];
				start = text.indexOf(keyword);
				if (start != -1) {
					console.log(i)
					console.log(start)
					subject = text.substring(start + keyword.length, text.length);
					console.log(subject);
					break;
				}
			}

			var PythonShell = require('python-shell');
			var pyshell = new PythonShell('news_shortener/news.py');

			// sends a message to the Python script via stdin
			pyshell.send(subject);
			var aiText = '';
			pyshell.on('message', function (message) {
			  // received a message sent from the Python script (a simple "print" statement)
				aiText = aiText + message;
		  		socket.emit('bot reply', aiText);
			});

			// end the input stream and allow the process to exit
			pyshell.end(function (err) {
			  if (err) throw err;
			  console.log('finished');
			});
		} else {
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
		}

	});
});

