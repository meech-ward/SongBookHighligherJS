"use strict";

module.exports = ($, window) => {

    function InstrumentInterface() {
      if (this instanceof InstrumentInterface === false) {
        return new InstrumentInterface();
      }
      this.highlightedKeyPlayed = () => {};
      $('body').on('mousedown', '.key-highlighted', () => {
          this.highlightedKeyPlayed();
      });
    }

    InstrumentInterface.prototype.highlight = function(note) {
      const $key = keyForNote(note);
      $key.removeClass('key-up');
      $key.addClass('key-highlighted');
    }

    InstrumentInterface.prototype.unHighlight = function(note) {
      const $key = keyForNote(note);
      $key.removeClass('key-highlighted');
    }

    InstrumentInterface.prototype.completed = function() {
    }

    function keyForNote(note) {
      const name = note.pitch.name;
      const octave = note.pitch.octave;

      const $key = $(`.piano-note-${name}.piano-octave-${octave}`);
      return $key;
    }

  return InstrumentInterface;
}