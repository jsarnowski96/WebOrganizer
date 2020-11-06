const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Profile = require('./profile');

const Schema = mongoose.Schema;
const SchemaObjectId = Schema.Types.ObjectId;
//const ObjectId = mongoose.Types.ObjectId;

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
        type: SchemaObjectId,
        ref: 'Profile'
    },

    created_at: {
        type: Date,
        default: Date.now
    }
});

const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;