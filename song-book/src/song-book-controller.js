const SongBookError = require('./song-book-error');

// http://usejsdoc.org/

/**
 * The pitch that uses Scientific pitch notation https://en.wikipedia.org/wiki/Scientific_pitch_notation
 * @param {string} name The name of the pitch. Example "c".
 * @param {number} octave The octave number from 0 - 9. Example 4.
 */
function Pitch(name, octave) {
  this.name = name;
  this.octave = octave;
}

/**
 * Note
 * @param {Pitch} pitch
 */
function Note(pitch) {
  this.pitch = pitch;
}


/**
 * Song
 * @param {Note[]} notes - An array of Note objects.
 */
function Song(notes) {
  this.notes = notes
}

/**
 * Song Book Controller to link a song to the interface.
 * @constructor
 * @param {Song} song - A valid Song object with a notes array.
 * @param {object} instrumentInterface - A valid InstrumentInterface object.
 */
function SongBookController(song, instrumentInterface) {
  // So that it can be created without `new`
  if (this instanceof SongBookController === false) {
    return new SongBookController(song, instrumentInterface);
  }
  
  // Validate Song
  if (!song) {
    throw new SongBookError("Invalid Song object, null");
  }
  if (typeof song.notes !== 'object') {
    throw new SongBookError("Invalid Song object, needs a notes array");
  }

  // Validate instrument interface
  if (!instrumentInterface) {
    throw new SongBookError("Invalid InstrumentInterface object, null");
  }
  if (typeof instrumentInterface.highlight !== 'function') {
    throw new SongBookError("Invalid InstrumentInterface object, needs a highlight function");
  }
  if (typeof instrumentInterface.unHighlight !== 'function') {
    throw new SongBookError("Invalid InstrumentInterface object, needs a unHighlight function");
  }
  if (typeof instrumentInterface.completed !== 'function') {
    throw new SongBookError("Invalid InstrumentInterface object, needs a completed function");
  }

  /**
   * The instrumentInterface object passed into the constructor.
   * @private
   * @type {InstrumentInterface}
   */
  this._instrumentInterface = instrumentInterface;

  /**
   * The song object passed into the constructor.
   * @private
   * @type {Song}
   */
  this._song = song;

  /**
   * The current index of the note that is highlighted.
   * @private
   * @type {number}
   */
  this._currentNoteIndex = null;
}
module.exports = SongBookController;

/**
 * Returns the current note using the _currentNoteIndex.
 * @returns {Note} if _currentNoteIndex is a number that is within the range of the array.
 * @returns {null} if _currentNoteIndex is a a number that is out of bounds of the array.
 * @returns {SongBookError} if _currentNoteIndex is null implying the song is not current being played.
 * @private
 */
SongBookController.prototype._currentNote = function() {
  const notes = this._song.notes;
  if (this._currentNoteIndex == null) {
    throw new SongBookError("Cannot get next note when there is no song being played. Make sure the song has been started and is not yet complete");
  }
  if (this._currentNoteIndex >= notes.length) {
    return null;
  }
  return notes[this._currentNoteIndex];
}

/**
 * Start playing the song.
 * This will start calling the highlight method on the instrument interface.
 * You can stop playing at any time by calling the `stop` method.
 */
SongBookController.prototype.start = function() {
  this._currentNoteIndex = 0;
  this._instrumentInterface.highlight(this._currentNote());
}

/**
 * Highlight the next note in the song and un highlight the last note in the song.
 */
SongBookController.prototype.nextNote = function() {
  let currentNote = this._currentNote();
  this._instrumentInterface.unHighlight(currentNote);
  this._currentNoteIndex++;
  currentNote = this._currentNote();
  if (currentNote == null) {
    this._instrumentInterface.completed();
    this._currentNoteIndex = null;
    return 
  }
  this._instrumentInterface.highlight(currentNote);
}

/**
 * Stop playing the started song.
 */
SongBookController.prototype.stop = function() {
  if (this._currentNoteIndex == null) {
    throw new SongBookError("Can't stop a song that hasn't yet been started");
  }
  this._instrumentInterface.completed();

  let currentNote = this._currentNote();
  this._instrumentInterface.unHighlight(currentNote);

  this._currentNoteIndex = null;
}