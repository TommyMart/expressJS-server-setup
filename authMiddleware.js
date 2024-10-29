const jwt = require('jsonwebtoken');
const User = require('./models/user');

const authMiddleware = async (request, response, next) => {
    // Get token from Authorization header
    // split("")[1] retrieved the token and not the "Bearer" after 
    // splitting string into array
    const token = request.headers.authorization?.split(" ")[1];

    // Debug
    // console.log(token)

    if (!token) {
        return response.status(401).json({ message: 'Auth token missing' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        // Add user to request

        // console.log('Auth decoded:', decoded)

        // console.log(decoded)
        request.user = await User.findById(decoded.userId);

        if (!request.user) {
            return response.status(401).json({ message: 'User not found' });
        }
        next();
    } catch (error) {
        return response.status(401).json({ message: 'Invalid token '});
    }
}

module.exports = authMiddleware;