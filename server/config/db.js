const { Pool } = require('pg');
require('dotenv').config(); // Load environment variables

// Use DATABASE_URL if provided (preferred for Supabase), otherwise fallback to individual DB components
const poolConfig = process.env.DATABASE_URL 
  ? { connectionString: process.env.DATABASE_URL }
  : {
      host: process.env.PGHOST || process.env.DB_HOST,
      user: process.env.PGUSER || process.env.DB_USER,
      password: process.env.PGPASSWORD || process.env.DB_PASSWORD,
      database: process.env.PGDATABASE || process.env.DB_NAME,
      port: process.env.PGPORT || process.env.DB_PORT || 5432,
  };

// Add SSL mode for Supabase / remote databases
if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost') && !process.env.DATABASE_URL.includes('127.0.0.1')) {
  poolConfig.ssl = { rejectUnauthorized: false };
}

const pgPool = new Pool(poolConfig);

// Create a wrapper object that matches the `mysql2/promise` API used in this project
const poolWrapper = {
    // Wrap the query function
    query: async (text, params = []) => {
        // 1. Convert MySQL queries (using `?`) to PostgreSQL (using `$1, $2, ...`)
        let index = 1;
        const pgQuery = text.replace(/\?/g, () => `$${index++}`);
        
        // 2. Execute the query using pg
        const result = await pgPool.query(pgQuery, params);

        // 3. Emulate `mysql2` response format: [rows/meta, fields]
        // SELECT-like commands return rows directly; mutation queries return
        // metadata with `insertId`/`affectedRows` used by existing code.
        const command = (result.command || '').toUpperCase();
        if (command === 'SELECT' || command === 'SHOW' || command === 'WITH') {
            return [result.rows, result.fields];
        }

        return [{
            insertId: result.rows?.[0]?.id ?? null,
            affectedRows: result.rowCount ?? 0,
            rowCount: result.rowCount ?? 0,
            rows: result.rows ?? []
        }, result.fields];
    },
    
    // Wrap the getConnection function
    getConnection: async () => {
        const client = await pgPool.connect();
        // Give the client the same wrapped `query` API
        const clientWrapper = {
            query: async (text, params = []) => {
                let index = 1;
                const pgQuery = text.replace(/\?/g, () => `$${index++}`);
                const result = await client.query(pgQuery, params);
                const command = (result.command || '').toUpperCase();
                if (command === 'SELECT' || command === 'SHOW' || command === 'WITH') {
                    return [result.rows, result.fields];
                }
                return [{
                    insertId: result.rows?.[0]?.id ?? null,
                    affectedRows: result.rowCount ?? 0,
                    rowCount: result.rowCount ?? 0,
                    rows: result.rows ?? []
                }, result.fields];
            },
            release: () => client.release(),
        };
        return clientWrapper;
    },
    
    end: async () => {
        return await pgPool.end();
    }
};

// Test connection
(async () => {
    try {
        const connection = await poolWrapper.getConnection();
        console.log('✅ Database connected successfully (PostgreSQL/Supabase)');
        connection.release();
    } catch (err) {
        console.error('❌ Database connection failed:', err);
    }
})();

module.exports = poolWrapper;
