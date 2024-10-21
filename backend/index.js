const express = require('express');
const { connectDB } = require('./config/database');
const jwt = require('jsonwebtoken');
// import { ReadableStream } from 'stream';
// import http from 'stream-http';
// import https from 'https-browserify';
// import zlib from 'browserify-zlib';
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
app.use(cors());

app.use(express.json());

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (token) {
    jwt.verify(token, 'your_jwt_secret', (err, user) => {
      if (err) {
        return res.sendStatus(403); // Invalid token
      }
      req.user = user; // Attach the decoded token to the request object
      next();
    });
  } else {
    res.sendStatus(401); // No token provided
  }
};
async function startServer() {
  try {
      const pool = await connectDB();
      console.log('Connected to the moneymap database.');
      app.locals.pool = pool; 

      // Import routes
      const utilisateurRoutes = require('./routes/utilisateurRoutes');
      const projetRoutes = require('./routes/projetRoutes');
      const transactionRoutes = require('./routes/transactionRoutes');
      const freelancerRoutes = require('./routes/freelancerRoutes');

      // Routes
      app.use('/api/utilisateurs', utilisateurRoutes); // Login route (no auth)
      app.use('/api/projects', authenticateJWT, projetRoutes); // Protected route
      app.use('/api/transactions', authenticateJWT, transactionRoutes); // Protected route
      app.use('/freelancers', freelancerRoutes); // Freelancers route (add auth if needed)

      app.listen(PORT, () => {
          console.log(`Server is running on port ${PORT}`);
      });
  } catch (error) {
      console.error('Failed to start the server:', error);
  }
}

startServer();
