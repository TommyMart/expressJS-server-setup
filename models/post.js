
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // References User model
        required: true
    },
    content: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    // location: {
    //     type: String
    // },
    // tags: {
    //     type: [String] // Array of string tags
    // },
    time: {
        type: Date,
        default: Date.now,
        required: true
    },
    // comments: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Comment' // References Comment model
    // }]
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;