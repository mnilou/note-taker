const router = require("express").Router();
const notes = require("../db/notes");

// GET "/api/notes" responds with all notes from the database
router.get("/notes", (req, res) => {
  notes
    .getNotes()
    .then(notes => res.json(notes))
    .catch(err => res.status(500).json(err));
});

router.post("/notes", ({ body }, res) => {
  notes
    .addNote(body)
    .then(note => res.json(note))
    .catch(err => res.status(500).json(err));
});

// DELETE "/api/notes" deletes the note with an id equal to req.params.id
router.delete("/notes/:id", ({ params }, res) => {
  notes
    .removeNote(params.id)
    .then(() => res.json({ ok: true }))
    .catch(err => res.status(500).json(err));
});

module.exports = router;
