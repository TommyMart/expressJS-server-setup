// routes/userRoutes.js

const express = require('express');         // Import Express
const router = express.Router();            // Create a router for handling routes
const userController = require('../controllers/userController');  // Import the controller

router.post('/signup', userController.signup);  // Route for user registration
router.post('/login', userController.login);    // Route for user login
// router.get('/:id', userController.getUserById); // Route to fetch user info
router.post('/post', userController.postNewPost)
router.get('/posts', userController.getPosts)

// Export the router so it can be used in other files
module.exports = router;
