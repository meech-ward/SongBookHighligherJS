const SongBookError = require('./song-book-error');

function SongBookController(song, instrumentInterface) {
  if (this instanceof SongBookController === false) {
    return new SongBookController(song, instrumentInterface);
  }
  
  if (!song) {
    throw new SongBookError("Invalid Song object, null");
  }
  if (!instrumentInterface) {
    throw new SongBookError("Invalid InstrumentInterface object, null");
  }
  // Validate Song
  if (typeof song.notes !== 'object') {
    throw new SongBookError("Invalid Song object, needs a notes array");
  }

  // Validate instrument interface
  if (typeof instrumentInterface.highlight !== 'function') {
    throw new SongBookError("Invalid InstrumentInterface object, needs a highlight function");
  }
  if (typeof instrumentInterface.unHighlight !== 'function') {
    throw new SongBookError("Invalid InstrumentInterface object, needs a unHighlight function");
  }
  if (typeof instrumentInterface.completed !== 'function') {
    throw new SongBookError("Invalid InstrumentInterface object, needs a completed function");
  }
}
module.exports = SongBookController;