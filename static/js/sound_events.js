/**
 * Created by Michael on 12/5/2016.
 */
// Initialize variables
   var audioCtx = new (window.AudioContext || window.webkitAudioContext);

   var gainNode = audioCtx.createGain();
   var biquadFilter = audioCtx.createBiquadFilter();
   biquadFilter.connect(gainNode);
   gainNode.connect(audioCtx.destination);

   function defineFilter(){
       biquadFilter.type = "lowpass";
       biquadFilter.frequency.value = $('.knob2').val();
       console.log($('.knob2').val());
   }

   //defineFilter();
   var sine;
   var range = 1;
   var octave = 0;
   var MiddleC = 261.63;
   var freqRatio = 1.05946;

   // Sine wave Oscillator initialized at the specified frequency/wave type
   // Needs to be initialized multiple times as per design of Web Audio API
   function initializeOsc(freq) {
       var type = $("input[name=wave_type]:checked").val();
       var knob_val = $('.knob1').val();
       sine = audioCtx.createOscillator();
       sine.frequency.value = freq;
       gainNode.gain.value = knob_val/100;
       sine.type = type;
       defineFilter();
       sine.connect(biquadFilter);
   }
   // Set Octave for Keyboard
   function setOctave() {
       console.log("current octave: " + octave);
       range = Math.pow(freqRatio, 12*octave);
   }
   // Create flags for keyboard playing
   document.onkeydown = checkPress;
   document.onkeyup = checkRelease;
   var soundCheck = 0;
   // Initialize OSC and play notes at dictated frequency
   function checkPress(e) {
       e = e || window.event;
       if (soundCheck == 0) {
           soundCheck = 1;
           if (e.keyCode == '65') {
               initializeOsc(MiddleC * range);
               sine.start();
           } else if (e.keyCode == '87'){
               initializeOsc(MiddleC * range * Math.pow(freqRatio, 1));
               sine.start();
           } else if (e.keyCode == '83'){
               initializeOsc(MiddleC * range * Math.pow(freqRatio, 2));
               sine.start();
           } else if (e.keyCode == '69'){
               initializeOsc(MiddleC * range * Math.pow(freqRatio, 3));
               sine.start();
           } else if (e.keyCode == '68'){
               initializeOsc(MiddleC * range * Math.pow(freqRatio, 4));
               sine.start();
           } else if (e.keyCode == '70'){
               initializeOsc(MiddleC * range * Math.pow(freqRatio, 5));
               sine.start();
           } else if (e.keyCode == '84'){
               initializeOsc(MiddleC * range * Math.pow(freqRatio, 6));
               sine.start();
           } else if (e.keyCode == '71'){
               initializeOsc(MiddleC * range * Math.pow(freqRatio, 7));
               sine.start();
           } else if (e.keyCode == '89'){
               initializeOsc(MiddleC * range * Math.pow(freqRatio, 8));
               sine.start();
           } else if (e.keyCode == '72'){
               initializeOsc(MiddleC * range * Math.pow(freqRatio, 9));
               sine.start();
           } else if (e.keyCode == '85'){
               initializeOsc(MiddleC * range * Math.pow(freqRatio, 10));
               sine.start();
           } else if (e.keyCode == '74'){
               initializeOsc(MiddleC * range * Math.pow(freqRatio, 11));
               sine.start();
           } else if (e.keyCode == '75'){
               initializeOsc(MiddleC * range * Math.pow(freqRatio, 12));
               sine.start();
           } else if (e.keyCode == '79'){
               initializeOsc(MiddleC * range * Math.pow(freqRatio, 13));
               sine.start();
           } else if (e.keyCode == '76'){
               initializeOsc(MiddleC * range * Math.pow(freqRatio, 14));
               sine.start();
           }
       }
       // Check for Z (Octave Down) & X (Octave Up) pressed
       if (e.keyCode == 90){
           if (octave > -6) {
               octave--;
               setOctave();
               $('.octave').html(octave);
           }
       }
       if (e.keyCode == 88){
           if (octave < 6) {
               octave++;
               setOctave();
               $('.octave').html(octave);
           }
       }
   }
   // Stop OSC on key release
   function checkRelease(e) {
       e = e || window.event;
       if(soundCheck == 1) {
           if (e.keyCode == '65') {
               soundCheck = 0;
               gainNode.gain.value = 0;
               sine.stop();
           } else if (e.keyCode == '87'){
               soundCheck = 0;
               gainNode.gain.value = 0;
               sine.stop();
           } else if (e.keyCode == '69'){
               soundCheck = 0;
               gainNode.gain.value = 0;
               sine.stop();
           } else if (e.keyCode == '68'){
               soundCheck = 0;
               gainNode.gain.value = 0;
               sine.stop();
           } else if (e.keyCode == '70'){
               soundCheck = 0;
               gainNode.gain.value = 0;
               sine.stop();
           } else if (e.keyCode == '84'){
               soundCheck = 0;
               gainNode.gain.value = 0;
               sine.stop();
           } else if (e.keyCode == '71'){
               soundCheck = 0;
               gainNode.gain.value = 0;
               sine.stop();
           } else if (e.keyCode == '89'){
               soundCheck = 0;
               gainNode.gain.value = 0;
               sine.stop();
           } else if (e.keyCode == '72'){
               soundCheck = 0;
               gainNode.gain.value = 0;
               sine.stop();
           } else if (e.keyCode == '85'){
               soundCheck = 0;
               gainNode.gain.value = 0;
               sine.stop();
           } else if (e.keyCode == '74'){
               soundCheck = 0;
               gainNode.gain.value = 0;
               sine.stop();
           } else if (e.keyCode == '75'){
               soundCheck = 0;
               gainNode.gain.value = 0;
               sine.stop();
           } else if (e.keyCode == '79'){
               soundCheck = 0;
               gainNode.gain.value = 0;
               sine.stop();
           } else if (e.keyCode == '76'){
               soundCheck = 0;
               gainNode.gain.value = 0;
               sine.stop();
           }
       }
   }