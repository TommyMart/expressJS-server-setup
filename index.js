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

// GET QUERY http://localhost:3000/queryRouteExample?userId
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

// GET QUERY http://localhost:3000/queryRouteExample?userId&dotw=Monday&weather=hot
app.get('/queryRouteExample', (request, response) => {
    // Take userId, find in DB, assign userId to user
    let userId = request.query.userId;
    let user = users[userId]

    let dayOfTheWeek = request.query.dotw;
    let weather = request.query.weather

    let allQueryParams = {}

    // Create an object with all query parameters
    Object.keys(request.query).forEach(key => {
        allQueryParams[key] = request.query[key]
    })

    response.json({
        "day": dayOfTheWeek,
        // return name of the user
        "user": user.name,
        "weather": weather,
        allQueryParams: allQueryParams
    })

    // http://localhost:3000/queryRouteExample?userId=1&dotw=Monday&weather=sunny
    // assuming Tom is userId 1 in DB
    // {
    //     "day": "Monday",
    //     "user": "Tom", 
    //     "weather": "sunny",
    //     "allQueryParams": {
    //       "userId": "1",
    //       "dotw": "Monday",
    //       "weather": "sunny"
    //     }
    //   }
})

// GET PARAMS http://localhost:3000/users/8899
app.get('/users/:userId', (request, response) => {
    let userId = request.params.userId;

    if (isNaN(userId)) {
        response.json({
            "error": "Provided user ID was not a number"
        });
    } else {
        let message = `User ID is ${userId}!`;

        reponse.json({
            "message": message
        })
    }
})

// Once the server has been configured, tell it to start listening to web traffic.
app.listen(port, () => {
    // This logged message will appear in the terminal, not the browser.
    console.log(`Example app listening on port ${port}`);
});