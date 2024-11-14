const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'moneymap',
    password: 'admin',
    port: 5432,
});

async function connectDB() {
    if (!pool) {
        pool = new Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'moneymap', 
            password: 'admin',
            port: 5432,
        });

        try {
            const checkDbResult = await pool.query(`
                SELECT 1 FROM pg_database WHERE datname = 'moneymap';
            `);

            if (checkDbResult.rowCount === 0) {
                await pool.query('CREATE DATABASE moneymap;');
                console.log('Database "moneymap" created successfully.');
            } else {
                console.log('Database "moneymap" already exists.');
            }
        } catch (err) {
            console.error('Error checking or creating database:', err);
            return;
        } finally {
            await pool.end();
        }

        pool = new Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'moneymap',
            password: 'admin',
            port: 5432,
        });
    }

    await createTables(pool);
    console.log('Connected to the moneymap database.');
}

async function createTables(pool) {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS "Utilisateurs" (
            "id" SERIAL PRIMARY KEY,
            "nom" VARCHAR(255) NOT NULL,
            "prenom" VARCHAR(255) NOT NULL,
            "email" VARCHAR(255) NOT NULL UNIQUE,
            "password" VARCHAR(255) NOT NULL,
            "role" VARCHAR(50) NOT NULL CHECK (role IN ('financier', 'chef de projet', 'administrateur'))
        );
    `);
    console.log('Table "Utilisateurs" created successfully.');

    await pool.query(`
        CREATE TABLE IF NOT EXISTS "Projets" (
            "id" SERIAL PRIMARY KEY,
            "nom" VARCHAR(255) NOT NULL,
            "date_debut" TIMESTAMP WITH TIME ZONE NOT NULL,
            "date_fin" TIMESTAMP WITH TIME ZONE NOT NULL,
            "budget" FLOAT NOT NULL,
            "etat" VARCHAR(50) NOT NULL CHECK (etat IN ('en cours', 'termine')),
            "id_chef" INTEGER NOT NULL REFERENCES "Utilisateurs" ("id") ON DELETE CASCADE
        );
    `);
    console.log('Table "Projets" created successfully.');

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

    await pool.query(`
        CREATE TABLE IF NOT EXISTS "Revenues" (
            "transaction_id" INTEGER PRIMARY KEY REFERENCES "Transactions" ("id") ON DELETE CASCADE,
            "id_projet" INTEGER REFERENCES "Projets" ("id") ON DELETE CASCADE
        );
    `);
    console.log('Table "Revenues" created successfully.');

    await pool.query(`
        CREATE TABLE IF NOT EXISTS "Depenses" (
            "transaction_id" INTEGER PRIMARY KEY REFERENCES "Transactions" ("id") ON DELETE CASCADE,
            "category" VARCHAR(50) NOT NULL 
        );
    `);
    console.log('Table "Dépenses" created successfully.');

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

module.exports = { connectDB, pool };
