// models/User.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the structure of the user data (name, username, email, password)
const userSchema = new mongoose.Schema({
    name: { 
        type: String,       // The user's name
        required: true      // Name is required
    },
    username: {
        type: String,       // The user's unique username
        required: true,     // Username is required
        unique: true        // Must be unique (no duplicates)
    },
    email: { 
        type: String,       // The user's email address
        required: true,     // Email is required
        unique: true,       // Email must be unique
        match: /.+\@.+\..+/ // Basic email format validation
    },
    password: {
        type: String,       // The user's password (will be stored hashed)
        required: true      // Password is required
    },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

// Create a model from the schema to interact with the 'users' collection in MongoDB
const User = mongoose.model('User', userSchema);

// Export the model so other files can use it
module.exports = User;
