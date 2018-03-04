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
  this.notes = [newNote("c", 4), newNote("d", 5), newNote("e", 6)];
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

      context("returns a promise", function() {
        it("should complete when the song ends", function(done) {
          songBookController.start()
            .then(() => {
              done();
            });
          songBookController.stop();
        });
        it("should complete when the song is stopped", function(done) {
          songBookController.start()
            .then(() => {
              done();
            });
          songBookController.nextNote();
          songBookController.nextNote();
          songBookController.nextNote();
        });
      });
    });
    context("#nextNote", () => {
      context("when there are more keys to play", function() {
        it("should un highlight the current key", () => {
          let note = null;
          instrumentInterface.unHighlightCallback = function(n) {
            note = n;
          };
          songBookController.start();
          songBookController.nextNote();
          expect(note).to.deep.equal(song.notes[0]);
          songBookController.nextNote();
          expect(note).to.deep.equal(song.notes[1]);
        });
        it("should highlight the next key", () => {
          let note = null;
          instrumentInterface.highlightCallback = function(n) {
            note = n;
          };
          songBookController.start();
          songBookController.nextNote();
          expect(note).to.deep.equal(song.notes[1]);
          songBookController.nextNote();
          expect(note).to.deep.equal(song.notes[2]);
        });
      });
      context("when the current key is the last key", function() {
        it("should call the complete method on the instrument", () => {
          let called = false;
          instrumentInterface.completedCallback = function() {
            called = true;
          };
          songBookController.start();
          songBookController.nextNote();
          songBookController.nextNote();
          songBookController.nextNote();
          expect(called).to.be.true;
        });
      });
      context("when the song is over or not yet started", function() {
        it("should throw an error", () => {
          expect(() => { 
            songBookController.nextNote(); 
          }).to.throw(SongBookError);
          // expect((songBookController.nextNote.bind(songBookController))).to.throw(SongBookError);
        });
      });
    });

    context("#stop", () => {
      context("when the songBookController is started", function() {
        it("should call the stop method on the instrument", () => {
          songBookController.start();
          let called = false;
          instrumentInterface.completedCallback = function() {
            called = true;
          };
          songBookController.stop();
          expect(called).to.be.true;
        });

        it ("should un highlight the current key", () => {
          let note = null;
          instrumentInterface.unHighlightCallback = function(n) {
            note = n;
          };
          songBookController.start();
          songBookController.stop();
          expect(note).to.deep.equal(song.notes[0]);
        });
      });

      context("when the songBookController is not started", function() {
        it("should throw an error", () => {
          expect(() => {
            songBookController.stop();
          }).to.throw(SongBookError);
        });
      });

      context("when the songBookController has already been stopped", function() {
        it("should throw an error", () => {
          songBookController.start();
          songBookController.stop();
          expect(() => {
            songBookController.stop();
          }).to.throw(SongBookError);
        });
      });

      context("when the songBookController has ended", function() {
        it("should throw an error", () => {
          songBookController.start();
          songBookController.nextNote();
          songBookController.nextNote();
          songBookController.nextNote();
          expect(() => {
            songBookController.stop();
          }).to.throw(SongBookError);
        });
      });
    });
  });
});