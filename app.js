// app.js
require('dotenv').config();

const express = require('express');            
const mongoose = require('mongoose');          
const cors = require('cors');                     
const userRoutes = require('./routes/userRoutes'); 
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const followRoutes = require('./routes/followRoutes');
const helmet = require('helmet');


const app = express();  // Create the Express app
app.use(express.json());  // Middleware to parse JSON bodies

// Configure server security
try 
    {
        app.use(helmet());
        app.use(helmet.permittedCrossDomainPolicies());
        app.use(helmet.referrerPolicy());
        app.use(helmet.contentSecurityPolicy({
            directives: {
                defaultSrc: ["'self'"]
            }
        }));
    } catch (error) {
        console.error('Helmet config error:', error);
    }

// Configure CORS, add domains to the origin array as needed.
app.use(cors({          
    origin: ['http://localhost:5173', "https://deployedApp.com"], // Add deployed app when deployed
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
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
app.use('/follow', followRoutes);

// Start the server on port 3000 (or any port set in environment variables)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);  // Log the port the server is running on
});
