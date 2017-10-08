const socket = io();
const outputYou = document.querySelector('.output-you');
const outputBot = document.querySelector('.output-bot');
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

document.querySelector('button').addEventListener('click', () => {
	recognition.start();
});

recognition.addEventListener('speechstart', () => {
  console.log('Speech has been detected.');
});

recognition.addEventListener('result', (e) => {
	console.log('Result has been detected.');
	let last = e.results.length - 1;
	let text = e.results[last][0].transcript;
	outputYou.textContent = text;
	
/*// Google translate
  const Translate = require('@google-cloud/translate');
  // Instantiates a client
  const translate = Translate();
  // The text to translate, e.g. "Hello, world!"
  // const text = 'Hello, world!';
  // The target language, e.g. "ru"
  // const target = 'ru';
  // Translates the text into the target language. "text" can be a string for
  // translating a single piece of text, or an array of strings for translating
  // multiple texts.
  translate.translate(text, target)
    .then((results) => {
      let translations = results[0];
      translations = Array.isArray(translations) ? translations : [translations];

      console.log('Translations:');
      translations.forEach((translation, i) => {
        console.log(`${text[i]} => (${target}) ${translation}`);
      });
    })
    .catch((err) => {
      console.error('ERROR:', err);
*/
	console.log('Confidence: ' + e.results[0][0].confidence);
	socket.emit('chat message', text);
});

recognition.addEventListener('speechend', () => {
  recognition.stop();
});

recognition.addEventListener('error', (e) => {
  outputBot.textContent = 'Error: ' + e.error;
});

function synthVoice(text) {
	const synth = window.speechSynthesis;
	const utterance = new SpeechSynthesisUtterance();
	utterance.text = text;
	synth.speak(utterance);
}

socket.on('bot reply', function(replyText) {
	synthVoice(replyText);

	if (replyText == '') replyText = '(Did you say somehting?)';
	outputBot.textContent = replyText;
});