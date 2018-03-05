"use strict";

module.exports = ($, window) => {
  $(function() {
    const SongBookController = require('./song-book-controller');
    window.SongBookController = SongBookController;
    const SongBookError = require('./song-book-error');
    window.SongBookError = SongBookError;
    const PianoInstrumentInterface = require("./piano-instrument-interface")($, window);
    window.PianoInstrumentInterface = PianoInstrumentInterface;
  });

  return exports;
}