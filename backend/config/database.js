const { Pool } = require('pg');

// Initial pool for the 'postgres' database
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres', // Initial connection to 'postgres'
    password: 'admin',
    port: 5432,
});

async function connectDB() {
    console.log("Connecting to 'postgres' database...");

    try {
        // Check if 'moneymap' database exists
        const checkDbResult = await pool.query(`
            SELECT 1 FROM pg_database WHERE datname = 'moneymap';
        `);
        console.log('Check database result:', checkDbResult.rows);

        if (checkDbResult.rowCount === 0) {
            console.log('Creating "moneymap" database...');
            await pool.query('CREATE DATABASE moneymap;');
            console.log('Database "moneymap" created successfully.');
        } else {
            console.log('Database "moneymap" already exists.');
        }

    } catch (err) {
        console.error('Error creating or checking database:', err);
    } finally {
        // Close the connection to 'postgres' and switch to 'moneymap'
        await pool.end();
        console.log('Closed connection to "postgres".');
    }

    // Now connect to the 'moneymap' database
    const newPool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'moneymap', // Switch to 'moneymap' database
        password: 'admin',
        port: 5432,
    });

    try {
        await createTables(newPool);
        console.log('Connected to "moneymap" database and tables created.');
    } catch (err) {
        console.error('Error creating tables:', err);
    } finally {
        await newPool.end();
    }
}


// Function to create tables
async function createTables(pool) {
    // Create "Utilisateurs" table
    await pool.query(`
        CREATE TABLE IF NOT EXISTS "Utilisateurs" (
            "id" SERIAL PRIMARY KEY,
            "nom" VARCHAR(255) NOT NULL,
            "prenom" VARCHAR(255) NOT NULL,
            "email" VARCHAR(255) NOT NULL UNIQUE,
            "password" VARCHAR(255) NOT NULL,
            "role" VARCHAR(50) NOT NULL CHECK (role IN ('financier', 'chef de projet'))
        );
    `);
    console.log('Table "Utilisateurs" created successfully.');

    // Create "Projets" table
    await pool.query(`
        CREATE TABLE IF NOT EXISTS "Projets" (
            "id" SERIAL PRIMARY KEY,
            "nom" VARCHAR(255) NOT NULL,
            "date_debut" TIMESTAMP WITH TIME ZONE NOT NULL,
            "date_fin" TIMESTAMP WITH TIME ZONE NOT NULL,
            "budget" FLOAT NOT NULL,
            "etat" VARCHAR(50) NOT NULL CHECK (etat IN ('en cours', 'termine')),
            "id_chef" INTEGER NOT NULL REFERENCES "Utilisateurs" ("id")
        );
    `);
    console.log('Table "Projets" created successfully.');

    // Create "Transactions" table
    await pool.query(`
        CREATE TABLE IF NOT EXISTS "Transactions" (
            "id" SERIAL PRIMARY KEY,
            "amount" FLOAT NOT NULL,
            "date" TIMESTAMP WITH TIME ZONE NOT NULL,
            "description" VARCHAR(255),
            "addedBy" INTEGER NOT NULL,
            "type" VARCHAR(50) CHECK (type IN ('revenu', 'depense')) NOT NULL,
            FOREIGN KEY ("addedBy") REFERENCES "Utilisateurs"("id") ON DELETE CASCADE
        );
    `);
    console.log('Table "Transactions" created successfully.');

    // Create "Revenues" table
    await pool.query(`
        CREATE TABLE IF NOT EXISTS "Revenues" (
            "transaction_id" INTEGER PRIMARY KEY REFERENCES "Transactions" ("id") ON DELETE CASCADE,
            "id_projet" INTEGER NOT NULL REFERENCES "Projets" ("id") ON DELETE CASCADE
        );
    `);
    console.log('Table "Revenues" created successfully.');

    // Create "Dépenses" table
    await pool.query(`
        CREATE TABLE IF NOT EXISTS "Depenses" (
            "transaction_id" INTEGER PRIMARY KEY REFERENCES "Transactions" ("id") ON DELETE CASCADE,
            "category" VARCHAR(50) NOT NULL 
        );
    `);
    console.log('Table "Dépenses" created successfully.');

    // Create "Freelancers" table
    await pool.query(`
        CREATE TABLE IF NOT EXISTS "Freelancers" (
            "id" SERIAL PRIMARY KEY,
            "nom" VARCHAR(255) NOT NULL,
            "prenom" VARCHAR(255) NOT NULL,
            "specialty" VARCHAR(50) NOT NULL CHECK (specialty IN (
                'Front-End Developer',
                'Back-End Developer',
                'UI/UX Designer',
                'Graphic Designer',
                'Mobile Developer',
                'Data Analyst',
                'Social Media Manager'
            ))
        );
    `);
    console.log('Table "Freelancers" created successfully.');

    // Create "Salaires" table
    await pool.query(`
        CREATE TABLE IF NOT EXISTS "Salaires" (
            "id_projet" INTEGER NOT NULL,
            "id_freelancer" INTEGER NOT NULL,
            "salaire" FLOAT NOT NULL,
            PRIMARY KEY ("id_projet", "id_freelancer"),
            FOREIGN KEY ("id_projet") REFERENCES "Projets" ("id") ON DELETE CASCADE,
            FOREIGN KEY ("id_freelancer") REFERENCES "Freelancers" ("id") ON DELETE CASCADE
        );
    `);
    console.log('Table "Salaires" created successfully.');
}

// Export the connectDB function
module.exports = { connectDB, pool };
