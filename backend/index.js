const express = require('express');
const { connectDB } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

async function startServer() {
    try {
        const pool = await connectDB(); // Wait for DB to be connected
        console.log('Connected to the moneymap database.');

        // Now pass this pool to routes or globally
        app.locals.pool = pool; // Attach pool to app locals for sharing across modules

        // Define your routes here (we'll add these next)
        const utilisateurRoutes = require('./routes/utilisateurRoutes');
        app.use('/utilisateurs', utilisateurRoutes);

        const projetRoutes = require('./routes/projetRoutes');
        app.use('/projets', projetRoutes);

        const transactionRoutes = require('./routes/transactionRoutes');
        app.use('/transactions', transactionRoutes);

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
