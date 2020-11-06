const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const SchemaObjectId = Schema.Types.ObjectId;
const ObjectId = mongoose.Types.ObjectId;

const ProfileSchema = new mongoose.Schema({
    _id: {
        type: SchemaObjectId,
        default: () => new ObjectId()
    },
    
    login :{
        type: String,
        required: true
    },

    firstname :{
        type: String,
        required: true
    },

    lastname :{
        type: String,
        required: true
    },

    email :{
        type: String,
        required: true
    },

    password :{
        type: String,
        required: true
    },

    created_at :{
        type: Date,
        default: Date.now
    }
});

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;