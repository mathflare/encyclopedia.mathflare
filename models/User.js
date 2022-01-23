const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
    },
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024,
    },
    bio: {
        type: String,
        default: '',
        maxlength: 1200,
    },
    avatar: {
        type: String,
        default: 'violet.png',
        maxlength: 30,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    articles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
    }],
    created_at: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('User', userSchema);