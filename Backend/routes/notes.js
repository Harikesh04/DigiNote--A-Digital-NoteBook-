const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const router = express.Router();
const { body, validationResult, Result } = require("express-validator");
const Note = require("../models/Note");

//ROUTE 1 :- Get all the notes USING:GET "/api/auth/getuser".  login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some internal error occured");
  }
});
//ROUTE 2:- Add a new notes using:POSTS "/api/auth/addnote".  login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    // body("Description", "Decription must be of atleast 5 character").isLength({
    //   min: 1
    // }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      //if there are errors , return bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save()
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some internal error occured");
    }
  }
);

//ROUTE 3:- update an existing  note  using:PUT "/api/auth/updatenote".  login required
router.put(
  "/updatenote/:id",fetchuser, async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      
     //create a newNote object
     const newNote = {};
      if (title) {
        newNote.title = title
      };
      
      if (description) {
        newNote.description = description
      };
      if (tag) {
        newNote.tag = tag
      };
      //find the note to be updated and update it
      let note = await Note.findById(req.params.id);
      //making our react app secure so that no other user can access to our note and no one hack it
      if (!note) {
       return  res.status(404).send("Not Found")
      }
      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed")
      }
      note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true})
      res.json({note});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some internal error occured");
    }
  }
);
//ROUTE 4:- delete an existing  note  using:DELETE "/api/auth/deletenote".  login required
router.delete(
  "/deletenote/:id",fetchuser, async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      
   //here no need to make a new note object
      //find the note to be deleted and delete it
      let note = await Note.findById(req.params.id);
      //making our react app secure so that no other user can access to our note and no one hack it
      if (!note) {
       return  res.status(404).send("Not Found")
      }

      //allow deletion if user owns this note
      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed")
      }
      note = await Note.findByIdAndDelete(req.params.id)
      res.json({"Success": "Note has been deleted",note: note});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some internal error occured");
    }
  }
);
module.exports = router;
