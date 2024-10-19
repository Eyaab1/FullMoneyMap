const express = require('express');
const { connectDB } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
app.use(cors());

app.use(express.json());

async function startServer() {
    try {
        const pool = await connectDB(); // Wait for DB to be connected
        console.log('Connected to the moneymap database.');

     
        app.locals.pool = pool; 

        // Define your routes here (we'll add these next)
        const utilisateurRoutes = require('./routes/utilisateurRoutes');
        app.use('/api/utilisateurs', utilisateurRoutes); // Corrected route

        const projetRoutes = require('./routes/projetRoutes');
        // app.use('/projets', projetRoutes);
        app.use('/api/projects', projetRoutes);

        // app.use('/transactions', transactionRoutes);
    
        const transactionRoutes = require('./routes/transactionRoutes');
        app.use('/api/transactions', transactionRoutes);


        const freelancerRoutes = require('./routes/freelancerRoutes');
        app.use('/freelancers', freelancerRoutes);

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start the server:', error);
    }
}

startServer();
