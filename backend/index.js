const express = require('express');
const { connectDB } = require('./config/database');
const jwt = require('jsonwebtoken');

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
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401); 
  }
};
async function startServer() {
  try {
      const pool = await connectDB();
      console.log('Connected to the moneymap database.');
      app.locals.pool = pool; 
      const utilisateurRoutes = require('./routes/utilisateurRoutes');
      const projetRoutes = require('./routes/projetRoutes');
      const transactionRoutes = require('./routes/transactionRoutes');
      const freelancerRoutes = require('./routes/freelancerRoutes');
      const salaireRoutes = require('./routes/salaireRoutes'); 

      app.use('/api/utilisateurs',authenticateJWT, utilisateurRoutes); 
      app.use('/api/projects', authenticateJWT, projetRoutes); 
      app.use('/api/transactions', authenticateJWT, transactionRoutes);
      app.use('/api/freelancers',authenticateJWT, freelancerRoutes);
      app.use('/api/salaires',authenticateJWT,salaireRoutes);

      app.listen(PORT, () => {
          console.log(`Server is running on port ${PORT}`);
      });
  } catch (error) {
      console.error('Failed to start the server:', error);
  }
}

startServer();
