// controllers/userController.js

const User = require('../models/User');  // Import the user model
const Post = require('../models/post/Post')
const bcrypt = require('bcrypt');        // Import bcrypt for password hashing
const jwt = require('jsonwebtoken');

// Function to handle user sign-up (registration)
exports.signup = async (request, response) => {
    const { name, username, email, password } = request.body;  // Get data from request body

    try {
        // Check if email is already in use
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return response.status(400).json({ message: 'Email is already in use' });
        }

        // Check if username is already in use
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return response.status(400).json({ message: 'Username is already in use' });
        }


        // Hash the password for security
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with the hashed password
        const newUser = new User({ name, username, email, password: hashedPassword });
        await newUser.save();  // Save the new user to the database
        

        const secretKey = process.env.JWT_SECRET_KEY
        let token;
        try {
            token = jwt.sign(
                {
                    userId: newUser._id,
                    email: newUser.email
                }, 
                secretKey,
                {expiresIn: "4h"}
            );
        } catch (error) {
            console.log(error);
            const newError =
            new Error('Error! Something went wrong.')
            return next(newError);
        }

        // Respond with a success message
        return response.status(201).json({
            success: true,
            message: 'User created successfully',
            name: newUser.name,  // Return the new user's name
            id: newUser._id,     // Return the new user's ID
            username: newUser.username,
            token: token
        });

    } catch (error) {
        console.error('Error during signup:', error);  // Log errors if something goes wrong
        return response.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Function to handle user login
exports.login = async (request, response) => {
    const { email, password } = request.body;  // Get data from request body

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return response.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        // Compare the provided password with the stored (hashed) password
        const match = await bcrypt.compare(password, user.password);

        if (match) {

            const secretKey = process.env.JWT_SECRET_KEY
            let token;
            try {
                token = jwt.sign(
                    {
                        userId: user._id,
                        email: user.email
                    }, 
                    secretKey,
                    {expiresIn: "4h"}
                );
            } catch (error) {
                console.log(error);
                const newError =
                new Error('Error! Something went wrong.')
                return next(newError);
            }
            // If password is correct, return success and user info
            return response.json({
                success: true,
                message: 'Login successful',
                name: user.name,
                username: user.username,
                email: user.email,
                id: user._id,
                token: token
            });
        } else {
            // If password is incorrect, return an error
            return response.status(400).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error during login:', error);  // Log errors if something goes wrong
        return response.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.getUserById = async (request, response) => {

    const { id } = request.params; // Get email from query params
    try {
        const user = await User.findById(id); // Find the user in DB
        if (!user) {
            return response.status(404).json({ message: 'User not found '})
        }
        response.json({ 
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
        });
    } catch (error) {
        console.error('Error fetching the user: ', error);
        response.status(500).json({ message: 'Internal server error' });
    }
}

exports.postNewPost = async (request, response) => {
    // Destructure
    // const { content, title, location, tags} = request.body;
    // const { userId, content, title, location, tags} = request.body;
    const {  content, title } = request.body;

    // console.log(request.body)

    // Input validation
    // if (!userId || !content || !title) {
    //     return response.status(400).json({ message: 'userId, content, and title are required'});
    // };

    // Input validation
   if (!content || !title) {
        return response.status(400).json({ message: 'userId, content, and title are required'});
    }; 

    try {
        // Create a new Post object
        const newPost = new Post({
            // userId,
            content,
            title,
            // location: location || '', // Optional 
            // tags: tags || [] // Default to an empty array if tags are not provided
            // time: new Date()
        });

        // Save the new post to the database
        const savedPost = await newPost.save();
        console.log(savedPost);

        response.status(201).json({
            message: 'New post created succesfully',
            post: {
                id: savedPost._id,
                // userId: savedPost.userId,
                content: savedPost.content,
                title: savedPost.title,
                // location: savedPost.location,
                // tags: savedPost.tags,
                // time: savedPost.time
            }
            
        });
        console.log('post saved to DB')

    } catch (error) {
        console.error('Error creating post: ', error);
        response.status(500).json({ message: 'Internal server error'});
    }
};