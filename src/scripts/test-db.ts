import { Pool } from "pg";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

async function testConnection() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        const client = await pool.connect();
        console.log("Successfully connected to the database!");
        const res = await client.query("SELECT NOW()");
        console.log("Current Time:", res.rows[0]);
        client.release();
    } catch (err) {
        console.error("Error connecting to the database:", err);
    } finally {
        await pool.end();
    }
}

testConnection();
