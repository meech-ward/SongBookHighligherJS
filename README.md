# Song Book Highlighter

Highlights keys on a piano to prompt the user to play those keys.


Could work with any HTML instrument, but currently works with the the piano library:
<https://meech-ward.github.io/HTML-Piano-VanillaJS>

## How to use

Make sure you have already created a piano: <https://github.com/meech-ward/HTML-Piano-VanillaJS>

Create a `Song` object. This just needs to have a `notes` array that contains a bunch of objects that have valid names and octaves.

```js
var song = {
  notes: [
  {name: 'c', octave: 4}, 
  {name: 'c', octave: 4}, 
  {name: 'g', octave: 4}, 
  {name: 'g', octave: 4}, 
  {name: 'a', octave: 4}, 
  {name: 'a', octave: 4}, 
  {name: 'g', octave: 4}, 
  {name: 'f', octave: 4}, 
  {name: 'f', octave: 4}, 
  {name: 'e', octave: 4}, 
  {name: 'e', octave: 4}, 
  {name: 'd', octave: 4}, 
  {name: 'd', octave: 4}, 
  {name: 'c', octave: 4}]
};
```

Create a new song book controller with the song and the PianoInstrumentInterface. When you're ready to start playing, call the controller's `start` method.

```js
const pianoInterface = PianoInstrumentInterface();
const songBookController = SongBookController(song, pianoInterface);
pianoInterface.highlightedKeyPlayed = () => {
  songBookController.nextNote();
}
songBookController.start();
```