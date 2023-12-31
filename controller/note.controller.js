const noteModel = require("../models/notes.model");

const createNote = async (req, res) => {
  const { title, description } = req.body;
  const newNote = noteModel({ title, description, user_id: req.userId });
  try {
    await newNote.save();
    res
      .status(201)
      .json({
        response: true,
        note: {
          _id: newNote._id,
          title: newNote.title,
          description: newNote.description,
          createdAt: newNote.createdAt,
          updatedAt: newNote.updatedAt,
          __v: newNote.__v,
        },
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Somethign went wrong" });
  }
};

const getNote = async (req, res) => {
  try {
    let notes = await noteModel.find({ user_id: req.userId });

    notes = await notes.map((note) => {
      const { user_id, ...rest } = note._doc;
      return rest;
    });

    res.status(200).json(notes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something wentw wrong" });
  }
};

const updateNote = async (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;
  const newNote = {
    user_id: req.userId,
    description: description,
    title: title,
  };
  try {
    await noteModel.findByIdAndUpdate(id, newNote, { new: true });
    res
      .status(200)
      .json({
        response: true,
        note: {
          _id: id,
          description,
          title,
          createdAt: newNote.createdAt,
          updatedAt: newNote.updatedAt,
          __v: newNote.__v,
        },
      });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

const deleteNote = async (req, res) => {
  const id = req.params.id;
  try {
    const note = await noteModel.findByIdAndDelete(id);
    res
      .status(200)
      .json({
        response: true,
        note: {
          _id: id,
          description: note.description,
          title: note.title,
          createdAt: note.createdAt,
          updatedAt: note.updatedAt,
          __v: note.__v,
        },
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

module.exports = { createNote, updateNote, deleteNote, getNote };
