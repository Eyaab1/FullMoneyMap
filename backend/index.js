const express = require('express');
const { connectDB } = require('./config/database');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser'); 

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());  


const utilisateurRoutes = require('./routes/utilisateurRoutes');
const projetRoutes = require('./routes/projetRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const freelancerRoutes = require('./routes/freelancerRoutes');
const salaireRoutes = require('./routes/salaireRoutes');
const authRoutes = require('./routes/authRoutes'); 


const { authenticate } = require('./middleware/auth'); 


async function startServer() {
  try {
    const pool = await connectDB();
    console.log('Connected to the moneymap database.');
    app.locals.pool = pool; 

    
    app.use(authRoutes); 

    
    app.use('/api/utilisateurs', utilisateurRoutes); 
    app.use('/api/projects',  projetRoutes);
    app.use('/api/transactions',  transactionRoutes);
    app.use('/api/freelancers',  freelancerRoutes); 
    app.use('/api/salaires',  salaireRoutes);

    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
  }
}

startServer();