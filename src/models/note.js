const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const SchemaObjectId = Schema.Types.ObjectId;

const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    body: {
        type: String,
        required: true
    },

    user_id: {
        type: SchemaObjectId,
        ref: 'User'
    },

    created_at: {
        type: Date,
        default: Date.now
    }
});

const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;