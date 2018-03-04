const chai = require('chai');
const expect = chai.expect;

const SongBookController = require('../song-book/src/song-book-controller');
const SongBookError = require('../song-book/src/song-book-error');

function newNote(name, octave) {
  return { pitch: { name, octave } };
}

function MockSong() {
  if (this instanceof MockSong === false) {
    return new MockSong();
  }
  this.notes = [newNote("c", 4), newNote("d", 5)];
}

function MockInstrumentInterface() {
  if (this instanceof MockInstrumentInterface === false) {
    return new MockInstrumentInterface();
  }
  this.highlightCallback = () => {};
  this.unHighlightCallback = () => {};
  this.completedCallback = () => {};
}
MockInstrumentInterface.prototype.highlight = function() {
  this.highlightCallback.apply(this, Array.from(arguments));
}
MockInstrumentInterface.prototype.unHighlight = function() {
  this.unHighlightCallback.apply(this, Array.from(arguments));
}
MockInstrumentInterface.prototype.completed = function() {
  this.completedCallback.apply(this, Array.from(arguments));
}

describe("SongBookController", function() {
  context("when initialized with a valid song and instrument interface", () => {
    let song;
    let instrumentInterface;
    let songBookController;

    beforeEach(() => {
      song = MockSong();
      instrumentInterface = MockInstrumentInterface();
      songBookController = SongBookController(song, instrumentInterface);
    });

    context("#start", () => {

      it("should call highlight on the instrumentInterface", () => {
        let calledHighlighted = false;
        instrumentInterface.highlightCallback = () => calledHighlighted = true;
        songBookController.start();
        expect(calledHighlighted).to.be.true;
      });

      it("should call highlight with the first note", () => {
        let note = null;
        instrumentInterface.highlightCallback = function(n) {
          note = n;
        };
        songBookController.start();
        expect(note).to.deep.equal(song.notes[0]);
      });
    });
  });
});