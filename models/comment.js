
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema ({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now,
        required: true
    }
});

// Create comment model to interact with comments collection
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;