$(function() {

  const startNote = {
    note: 'c',
    octave: 2
  }
  const endNote = {
    note: 'b',
    octave: 4
  }
  let piano;
  try {
    piano = newPiano(startNote, endNote);
  } catch (error) {
    if (error instanceof PianoBuildError) {
      alert("Error Building Piano");
    } else {
      throw error;
    }
  }
  const $pianoElement = $(piano.HTML);
  $pianoElement.appendTo($(document.body));

  const pianoSynth = Synth.createInstrument('piano');

  piano.keyDown = (key) => {
    const keyNumber = piano.keyNumber(key);
    const keyNote = piano.keyNote(key);
    const keyOctave = piano.keyOctave(key);

    console.log("key number", keyNumber) 
    console.log("note", keyNote);
    console.log("octave", keyOctave);

    const seconds = 2;
    try {
      pianoSynth.play(keyNote.toUpperCase(), keyOctave, seconds);
    } catch (error) {
      console.log(error);
    }
  }
});