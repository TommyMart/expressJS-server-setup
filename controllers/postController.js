const Post = require('../models/post/Post');
const Comment = require('../models/comment');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getComments = async (request, response) => {
    const { postId } = request.params;
    
    try {
        // Find post and populate userId and username from DB
        const comments = await Comment.find({ postId }).populate('userId', 'username');

        if (!comments || comments.length === 0) {
            return response.status(404).json({ message: ' No comments found for this post'});
        }

        // Send comments back to user
        response.status(200).json({ comments });

        

        // response.json(
        //     { message: 'Comment retrieved successfully',
        //         comment:
        //     {
        //     commentId: comment._id,
        //     postId: comment.postId,
        //     userId: comment.userId,
        //     content: comment.content,
        //     time: comment.time
        // }})
    } catch (error) {
        console.error('Error fetching comments:', error);
        return response.status(500).json({ message: 'Internal server error', error })
    }
}

exports.newComment = async (request, response) => {
    const { userId, content } = request.body;
    const { postId } = request.params; 

    // Debug log
    console.log('Recieved data:', { userId, postId, content })

    if ( !userId || !postId || !content ) {
        return response.status(400).json({ message: 'userId, postId and content are required'});
    }

    try {
        // Create newComment object
        const newComment = new Comment({
            userId,
            postId,
            content,
            time: new Date()
        })

        const savedComment = await newComment.save();
        console.log('New comment saved to db', savedComment);

        response.status(201).json({
            message: 'New comment successfully created',
            comment: {
            userId: savedComment.userId,
            postId: savedComment.postId,
            content: savedComment.content,
            time: savedComment.time
        }})

    } catch (error) {
        console.error('Error creating comment', error)
        return response.status(500).json({ message: 'Internal server error', error })
    }

}