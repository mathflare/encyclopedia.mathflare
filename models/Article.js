const mongoose = require('mongoose');

const subSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    username: {
        type: String,
    },
    name: {
        type: String,
    },
});

const articleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        minlength: 2,
        maxlength: 50,
    },
    content: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30000,
    },
    contributors: [subSchema],
    created_at: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Article', articleSchema);