import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function main() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
    const db = drizzle(pool);

    try {
        console.log('Testing direct SELECT of main_image_id from payload.coffee_shops...');
        try {
            const res = await db.execute('SELECT main_image_id FROM "payload"."coffee_shops" LIMIT 1;');
            console.log('Successfully selected main_image_id!');
            console.log('Result:', res.rows);
        } catch (e) {
            console.error('Failed to select main_image_id:', e.message);
        }

        console.log('\nTesting direct SELECT of hours, phone, website...');
        try {
            const res = await db.execute('SELECT hours, phone, website FROM "payload"."coffee_shops" LIMIT 1;');
            console.log('Successfully selected hours, phone, website!');
        } catch (e) {
            console.error('Failed to select other columns:', e.message);
        }

        console.log('\nChecking table definition via pg_attribute...');
        const atts = await db.execute(`
            SELECT a.attname, t.typname
            FROM pg_attribute a
            JOIN pg_class c ON a.attrelid = c.oid
            JOIN pg_namespace n ON c.relnamespace = n.oid
            JOIN pg_type t ON a.atttypid = t.oid
            WHERE n.nspname = 'payload' AND c.relname = 'coffee_shops' AND a.attnum > 0;
        `);
        console.log('Attributes in payload.coffee_shops:');
        atts.rows.forEach(r => console.log(` - ${r.attname} (${r.typname})`));

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await pool.end();
    }
}

main();
