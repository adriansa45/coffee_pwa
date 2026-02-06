import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import pg from 'pg';

async function test() {
    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        const res = await pool.query('SELECT COUNT(*) FROM "payload"."users"');
        console.log("Users count result:", res.rows);
        const tags = await pool.query('SELECT COUNT(*) FROM "payload"."tags"');
        console.log("Tags count result:", tags.rows);
    } catch (err) {
        console.error("Failed to list migrations:", err);
    } finally {
        await pool.end();
    }
}

test();
