const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Profile = require('./profile');

const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    body: {
        type: String,
        required: true
    },

    profile_id: {
        type: ObjectId,
        default: Profile.ObjectId
    },

    created_at: {
        type: Date,
        default: Date.now
    }
});

const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;