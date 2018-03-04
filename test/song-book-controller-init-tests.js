const chai = require('chai');
const expect = chai.expect;

const SongBookController = require('../song-book/src/song-book-controller');
const SongBookError = require('../song-book/src/song-book-error');

function makeNewSongBookController() {
  return (() => {
    return SongBookController.apply(this, arguments);
  }).bind(this, arguments);
}

function Song() {
  if (this instanceof Song === false) {
    return new Song();
  }
  this.notes = [];
}

function InstrumentInterface() {
  if (this instanceof InstrumentInterface === false) {
    return new InstrumentInterface();
  }
}
InstrumentInterface.prototype.highlight = function() {
}
InstrumentInterface.prototype.unHighlight = function() {
}
InstrumentInterface.prototype.completed = function() {
}

describe("SongBookController", function() {
  context("when initialized without params", () => {
    it("should throw an error", () => {
      expect(makeNewSongBookController()).to.throw(SongBookError);
    });
  });
  context("when initialized with an invalid song", () => {
    it("should throw an error", () => {
      expect(makeNewSongBookController(null)).to.throw(SongBookError);
      expect(makeNewSongBookController({})).to.throw(SongBookError);
    });
  });
  context("when initialized with an invalid instrument interface", () => {
    it("should throw an error", () => {
      expect(makeNewSongBookController(Song(), null)).to.throw(SongBookError);
      expect(makeNewSongBookController(Song(), {})).to.throw(SongBookError);
    });
  });
  context("when initialized with a valid song and instrument interface", () => {
    it("should not throw an error", () => {
      const song = Song();
      const instrumentInterface = InstrumentInterface();
      expect(makeNewSongBookController(song, instrumentInterface)).to.not.throw();
    });
  });
});