const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();

app.use(express.json());
app.use(cors());

// Replace with Mongo string
mongoose.connect('mongodb://localhost:27017/myDatabase', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
    .then(() => console.log('Conected to MongoDB'))
    .catch(err => console.error('Mongo connection error: ', err));

// Create User schema and model
// Mongoose Schema vs. Model. A Mongoose model is a wrapper on the Mongoose schema. A Mongoose schema defines the structure of the document, default values, validators, etc., whereas a Mongoose model provides an interface to the database for creating, querying, updating, deleting records, etc
const userSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: { 
        type: String, 
        required: true,
        unique: true,
        match: /.+\@.+\..+/
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', userSchema);

// Post endpoint for Sign-up
app.post('/signup', async (request, response) => {

    const {name, username, email, password} = request.body;

    try {
        // Look for user in MongoDB
        const existingUser = await User.findOne({ email });

        // If exists
        if (existingUser) {
            return response.status(400).json({message: 'Email is already in use'});
        } 

        // Existing username
        const existingUsername = await User.findOne({ username });

        // If username exists
        if (existingUsername) {
            response.status(500).json({ message: 'Username is already in use' })
        }

        // Hash the password and then save
        // 10 is the number of salt rounds. meaning the password is hashed
        // ten times. Increased salt rounds means more difficult for hackers to 
        // crack but takes up more processing power.
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create a new user
        const newUser = await User({ name, username, email, password: hashedPassword });

        await newUser.save();

        response.status(400).json({ success: true, message: 'User created successfully'})
        
    } catch (error) {
        console.error('Error during signup: ', error);
        response.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// POST endpoint for login
app.post('/login', async (request, response) => {
    const { email, password } = request.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return response.status(400).json({ success: false, message: 'Invalid email address or password' });
        }

        // Compare the hashed password with the provided password
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            response.json({ success: true, message: 'Login successful' });
        } else {
            response.status(400).json({ success: false, message: 'Invalid email address or password' });
        }
    } catch (error) {
        console.error('Error during login: ', error);
        response.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
