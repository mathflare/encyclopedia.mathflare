const mongoose = require('mongoose');

const topicSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        required: true,
    },
    articles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
    }],
});

module.exports = mongoose.model('Topic', topicSchema);