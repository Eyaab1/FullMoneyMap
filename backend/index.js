const express = require('express');
const { connectDB } = require('./config/database');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Import routes
const utilisateurRoutes = require('./routes/utilisateurRoutes');
const projetRoutes = require('./routes/projetRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const freelancerRoutes = require('./routes/freelancerRoutes');
const salaireRoutes = require('./routes/salaireRoutes');
const authRoutes = require('./routes/authRoutes'); // Importing authRoutes for login/logout

// Middleware for authentication
const { authenticate } = require('./middleware/auth'); // Assuming you already have this middleware

// Initialize database connection
async function startServer() {
  try {
    const pool = await connectDB();
    console.log('Connected to the moneymap database.');
    app.locals.pool = pool; // Store pool in app locals for easy access in routes

    // Authentication routes
    app.use('/api/auth', authRoutes); // Authentication related routes (login/logout)

    // Use authentication middleware for routes that require authentication
    app.use('/api/utilisateurs',authenticate, utilisateurRoutes); // No auth required for this route
    app.use('/api/projects', authenticate, projetRoutes); // Authentication required for this route
    app.use('/api/transactions', authenticate, transactionRoutes); // Authentication required
    app.use('/api/freelancers', authenticate, freelancerRoutes); // Authentication required
    app.use('/api/salaires', authenticate, salaireRoutes); // Authentication required

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
  }
}

startServer();
