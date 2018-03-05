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

  function Note(name, octave) {
    if (this instanceof Note === false) {
      return new Note(name, octave);
    }
    this.pitch = { name, octave };
  }
  var songs = {
    'twinkle': {
      notes: [
      Note('c', 4), 
      Note('c', 4),
      Note('g', 4),
      Note('g', 4),
      Note('a', 4),
      Note('a', 4),
      Note('g', 4),
      Note('f', 4),
      Note('f', 4),
      Note('e', 4),
      Note('e', 4),
      Note('d', 4),
      Note('d', 4),
      Note('c', 4)]
    }
  };

  const song = songs['twinkle'];
  const pianoInterface = PianoInstrumentInterface();
  const songBookController = SongBookController(song, pianoInterface);
  pianoInterface.highlightedKeyPlayed = () => {
    songBookController.nextNote();
  }
  songBookController.start();
});