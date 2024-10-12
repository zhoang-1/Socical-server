const jwt = require('jsonwebtoken');

// Middleware to protect routes
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach decoded user data to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = authenticateJWT;
// const jwt = require('jsonwebtoken');

// const verifyToken = (req, res, next) => {
//     const token = req.headers['authorization']?.split(' ')[1]; // Assuming Bearer token

//     if (!token) {
//         return res.status(403).json({ message: 'Token is required for authentication' });
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) {
//             return res.status(401).json({ message: 'Token is not valid or has expired' });
//         }
//         req.user = user; // Save user info to request for use in other routes
//         next();
//     });
// };

// // Use the middleware on protected routes
// app.use('/protected-route', verifyToken, (req, res) => {
//     res.json({ message: 'This is a protected route', user: req.user });
// });
