const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
    try {
        const clientConfig = process.env.DATABASE_URL 
          ? { connectionString: process.env.DATABASE_URL }
          : {
              host: process.env.PGHOST || process.env.DB_HOST,
              user: process.env.PGUSER || process.env.DB_USER,
              password: process.env.PGPASSWORD || process.env.DB_PASSWORD,
              database: process.env.PGDATABASE || process.env.DB_NAME,
              port: process.env.PGPORT || process.env.DB_PORT || 5432,
          };

        if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost') && !process.env.DATABASE_URL.includes('127.0.0.1')) {
            clientConfig.ssl = { rejectUnauthorized: false };
        }

        console.log('Attempting to connect with PostgreSQL config:', {
            host: clientConfig.host || 'URI provided from DATABASE_URL',
            user: clientConfig.user,
            port: clientConfig.port,
        });

        const client = new Client(clientConfig);
        await client.connect();

        console.log('Connected to PostgreSQL server...');

        const sqlPath = path.join(__dirname, 'database.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Executing database.sql...');
        await client.query(sql);

        console.log('✅ Database setup completed successfully!');
        await client.end();
    } catch (err) {
        console.error('❌ Error setting up database:', err);
        process.exit(1);
    }
}

setupDatabase();
