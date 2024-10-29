const Post = require('../models/post/post');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.postNewPost = async (request, response) => {
    // Destructure
    // const { content, title, location, tags} = request.body;
    // const { userId, content, title, location, tags} = request.body;
    const {  userId, content, title } = request.body;

    // console.log(request.body)

    // Input validation
    // if (!userId || !content || !title) {
    //     return response.status(400).json({ message: 'userId, content, and title are required'});
    // };

    // Input validation
   if (!userId || !content || !title) {
        return response.status(400).json({ message: 'userId, content, and title are required'});
    }; 

    try {
        // Create a new Post object
        const newPost = new Post({
            userId,
            content,
            title,
            // location: location || '', // Optional 
            // tags: tags || [] // Default to an empty array if tags are not provided
            time: new Date()
        });

        // Save the new post to the database
        const savedPost = await newPost.save();
        console.log('Post saved to DB:', savedPost);

        response.status(201).json({
            message: 'New post created succesfully',
            post: {
                id: savedPost._id,
                userId: savedPost.userId,
                content: savedPost.content,
                title: savedPost.title,
                // location: savedPost.location,
                // tags: savedPost.tags,
                time: savedPost.time
            }
            
        });
        console.log('post saved to DB')

    } catch (error) {
        console.error('Error creating post: ', error);
        response.status(500).json({ message: 'Internal server error'});
    }
};

exports.getPosts = async (request, response) => {
    try {
        const posts = await Post.find()
        .populate('userId', 'username')
        .sort({ time: -1 })
        .limit(4);

        response.status(200).json({ posts });
    } catch (error) {
        console.error('Error fetching posts:', error);
        response.status(500).json({ message: 'Internal server error' });
    }
};

exports.deletePost =  async (request, response) => {
    try {
        const { postId } = request.params;
        const post = await Post.findById(postId);

        if (!post) {
            return response.status(404).json({ message: 'Post not found'})
        }

        await Post.findByIdAndDelete(postId);

        console.log('Post successfully deleted')
        return response.status(200).json({ message: 'Post deleted successfully'});
        
    } catch (error) {
        console.error('Error deleting post:', error);
        return response.status(500).json({ message: 'Internal server error'});
    }
    };

exports.editPost = async (request, response) => {
    try {
        const { postId } = request.params;
        const { content, title } = request.body;
        const post = await Post.findById(postId);

        if (!post) {
            return response.status(404).json({ message: 'Post not found' });
        } 

        const updatedPost = await Post.findByIdAndUpdate(
            postId, 
            {content, title}, // Fields to update
            { new: true } // Return the updated post
        ).populate('userId', 'username')

        // Debug log
        console.log(updatedPost);

        return response.status(201).json({ message: 'Post edit successful', updatedPost })
    } catch (error) {
        console.error('Error editing post:', error);
        return response.status(500).json({ message: 'Internal server error'})
    }
}
