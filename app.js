// app.js
require('dotenv').config();

const express = require('express');            
const mongoose = require('mongoose');          
const cors = require('cors');                     
const userRoutes = require('./routes/userRoutes'); 
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');


const app = express();  // Create the Express app

app.use(express.json());  // Middleware to parse JSON bodies
app.use(cors({          // Enable CORS for all routes
    origin: '*',  // Allow all origins for testing
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
})); 

app.options('*', cors());

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/musicAppDB', { 
    useNewUrlParser: true,   
    useUnifiedTopology: true 
})
    .then(() => console.log('Connected to MongoDB'))  // Log if connected successfully
    .catch(err => console.error('Mongo connection error:', err));  // Log errors if connection fails

// Use the user routes for any requests starting with /users
app.use('/users', userRoutes);  
app.use('/posts', postRoutes);  
app.use('/comments', commentRoutes);

// Start the server on port 3000 (or any port set in environment variables)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);  // Log the port the server is running on
});
