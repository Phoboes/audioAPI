// Sine visualiser explanation here: https://hackernoon.com/a-web-audio-experiment-666743e16679#.s5ukydxrh
// Intensity visualiser code taken from https://codepen.io/Rumyra/pen/pEMGEP

var sineCanvas = document.getElementsByTagName('canvas')[0];
var waveCanvas = document.getElementsByTagName('canvas')[1];
var audioContext = new window.AudioContext();
var analyser = audioContext.createAnalyser();

// set up audio context
var audioContext = (window.AudioContext || window.webkitAudioContext);
// create audio class
if (audioContext) {
  // Web Audio API is available.
  var audioAPI = new audioContext();
} else {
  // Web Audio API is not available. Ask the user to use a supported browser.
  alert("Your browser does not support web audio. Try another.");
}

// canvas variables:
var lastPoint = 0;
var totalSteps = 0;
var pitchSamples = [];
var audioReady = false;

// variables
var analyserNode,
    frequencyData = new Uint8Array(256),
    dataArray = new Uint8Array(analyser.frequencyBinCount);

// create an audio API analyser node and connect to source
function createAnalyserNode(audioSource) {
  analyserNode = audioAPI.createAnalyser();
  analyserNode.fftSize = 512;
  audioSource.connect(analyserNode);
}

var canvasContext = sineCanvas.getContext('2d'); // Sine canvas
canvasContext.fillStyle = 'firebrick';

var canvasWave = waveCanvas.getContext('2d'); // Wave canvas


// getUserMedia success callback -> pipe audio stream into audio API
var gotStream = function(stream) {
  // Create an audio input from the stream.
  var audioSource = audioAPI.createMediaStreamSource(stream);
  createAnalyserNode(audioSource);
  audioReady = true;  
}

// pipe in analysing to getUserMedia
navigator.mediaDevices.getUserMedia({ audio: true, video: false })
  .then(gotStream);


// Draws the wave of frequencies
var drawWave = function(){
  analyserNode.getByteTimeDomainData(dataArray);
  // console.log("Byte time data array: " + dataArray)


  for( var i = 0; i < dataArray.length; i++ ){

    if( dataArray[i] > 128 && prevPoint <= 128 ){
      totalSteps = i - lastPoint;
      lastPoint = i;

      var hertz = 1 / (totalSteps / 44100);
      if ( hertz >= 0 && hertz !== Infinity ){ // Something here generates infinity, I opted to ignore the result.
        pitchSamples.push(hertz); // an array of every pitch encountered
      }

    };
    canvasContext.fillRect(i, (dataArray[i]+22), 1, 1); 
    // 22 is literally just to center our data in the canvas

    prevPoint = dataArray[i];
  };


  var tone = dataSort.mode( pitchSamples ) 
  // The most common in our pitch sample is chosen as our note
  // console.log(tone);
};

var drawBars = function(){
  analyserNode.getByteFrequencyData(frequencyData);
  // console.log("Frequency data array: " + frequencyData )


  for( var i = 0; i < frequencyData.length; i++ ){
    canvasWave.fillStyle = 'rgb('+(255-i)+','+i+','+(155 - i)+')';
    canvasWave.fillRect(i, 150, 1, ( frequencyData[i] * -1 ) );
    // Multiplied by -1 to scale in the correct direction on our canvas, 
    // otherwise all results are inverted.
    canvasWave.fillStyle = 'red';
    canvasWave.fillRect(i, 150, 1, 1 );

    prevPoint = frequencyData[i];
  }
};


// dumps frequency array intermittently to save on having giant arrays.
setInterval(function(){
  if (!audioReady) return;
  dataSort.emptyArray( pitchSamples );
}, 1000)

var renderAudio = function(){
  requestAnimationFrame(renderAudio);

  if (!audioReady) return;

  canvasContext.clearRect(0, 0, 1024, 300);
  canvasWave.clearRect(0, 0, 1024, 300);
  drawWave();
  drawBars();
};

var audioRequest = setInterval(function(){
  audioReady ? clearInterval(audioRequest) : renderAudio();
}, 300);