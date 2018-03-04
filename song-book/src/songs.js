
/// A constructor that can be used without new.
function NoteData(note, octave) {
  if (this instanceof NoteData === false) {
    return new NoteData(note, octave);
  }
  this.note = note;
  this.octave = octave;
}
// var songs = {
//   'twinkle': [NoteData('c', 3), 'c', 'g', 'g', 'a', 'a', 'g', 'f', 'f', 'e', 'e', 'd', 'd', 'c']
// }

console.log((NoteData('c', 3)));
console.log((new NoteData('c', 3)));