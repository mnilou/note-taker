const util = require("util");
const fs = require("fs");
const { v4: uuidv4 }= require("uuid");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

class Notes {
  read() {
    return readFileAsync("db/db.json", "utf8");
  }

  write(note) {
    return writeFileAsync("db/db.json", JSON.stringify(note));
  }

  getNotes() {
    return this.read().then(notes => {
      let readNotes;

      // If notes isn't an array or can't be turned into one, send back a new empty array
      try {
        readNotes = [].concat(JSON.parse(notes));
      } catch (err) {
        readNotes = [];
      }

      return readNotes;
    });
  }

  addNote(note) {
    const { title, text } = note;

    if (!title || !text) {
      throw new Error("Note 'title' and 'text' cannot be blank");
    }

    // Add a unique id to the note using uuid package
    const newNote = { title, text, id: uuidv4() };

    // Get all notes, add the new note, write all the updated notes, return the newNote
    return this.getNotes()
      .then(notes => [...notes, newNote])
      .then(updatedNotes => this.write(updatedNotes))
      .then(() => newNote);
  }

  removeNote(id) {
    // Get all notes, remove the note with the given id, write the filtered notes
    return this.getNotes()
      .then(notes => notes.filter(note => note.id !== id))
      .then(filteredNotes => this.write(filteredNotes));
  }
}

module.exports = new Notes();
