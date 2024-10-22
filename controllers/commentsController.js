const Comment = require('../models/comment');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');




exports.getComments = async (request, response) => {
    const { postId } = request.params;
    
    try {
        // Find post and populate userId and username from DB
        const comments = await Comment.find({ postId }).populate('userId', 'username');

        if (!comments || comments.length === 0) {
            return response.status(404).json({ message: 'No comments found for this post'});
        }

        // Send comments back to user
        response.status(200).json({ comments })

    } catch (error) {
        console.error('Error fetching comments:', error);
        return response.status(500).json({ message: 'Internal server error', error })
    }
};

exports.newComment = async (request, response) => {
    const { postId } = request.params;
    const { userId, content } = request.body;

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
        });

        const savedComment = await newComment.save();
        console.log('New comment saved to db', savedComment);

        response.status(201).json({ message: 'Comment added successfully', comment: savedComment });

    } catch (error) {
        console.error('Error creating comment', error)
        return response.status(500).json({ message: 'Internal server error', error })
    };
};

exports.editComment = async (request, response) => {

    try {
        const { commentId } = request.params;
        const { content, userId } = request.body;

        

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return response.status(401).json({ message: 'Comment not found' })
        }
         
        if (comment.userId.toString() !== userId) {
            return response.status(401).json({ message: 'User not authorized to perform this action'})
        }

        const updatedComment = await Comment.findByIdAndUpdate(commentId,
            { content },
            { new: true }
        )

        // Debug log
        console.log(updatedComment);

        return response.status(201).json({ message: 'Comment updated successfully', updatedComment })

    } catch (error) {
        console.error('Error updating comment')
        return response.status(500).json({ message: 'Internal server error' })
    }
};

exports.deleteComment = async (request, response) => {

    try {
        
    const { commentId } = request.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        return response.status(400).json({ message: 'Invalid comment Id' });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        return response.status(404).json({ message: 'Comment not found'})
    }

    await Comment.findByIdAndDelete(commentId);

    return response.status(200).json({ message: 'Comment deleted successfully' })
    
    } catch (error) {
        console.error( 'Error deleting comment:', error)
        return response.status(500).json({ message: 'Internal server error'})
    };
    
};