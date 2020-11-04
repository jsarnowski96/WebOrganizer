const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
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

const user = mongoose.model('user', userSchema);

module.exports = user;