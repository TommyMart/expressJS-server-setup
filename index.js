// Import the ExpressJS package
const express = require('express');
// Create an instance of Express
const app = express();
// Set up any data needed to give to the server later
const port = 3000;

// Configure settings to allow data to be sent into the server
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// GET http://localhost:3000/
app.get('/', (request, response) => {
    response.json({
        "message": "Testing!"
    })
})

// POST http://localhost:3000/
app.post('/', (request, response) => {
    
    console.log(request.body.name)

    response.send("Data recieved")
})

// GET http://localhost:3000/queryRouteExample?userId
app.get('/queryRouteExample', (request, response) => {
    
    // Extract userId from URL query
    let userId = response.query.userId;

    // Check if user exists in DB
    let user = users[userId];

    // If user exists
    if (user) {
        // Return user's name and email to client
        response.json({
            name: user.name,
            email: user.email
        });
    } else {
        // If not found, return an error response to client
        response.status(404).json({
            message: "User not found"
        });
    }

    
})

// Once the server has been configured, tell it to start listening to web traffic.
app.listen(port, () => {
    // This logged message will appear in the terminal, not the browser.
    console.log(`Example app listening on port ${port}`);
});