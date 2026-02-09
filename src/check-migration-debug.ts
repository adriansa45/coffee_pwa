import { db } from './db/index.js';
import { sql } from 'drizzle-orm';

async function check() {
    try {
        console.log('--- payload_locked_documents_rels constraints ---');
        const res = await db.execute(sql`
            SELECT conname 
            FROM pg_constraint 
            WHERE conrelid = '"payload"."payload_locked_documents_rels"'::regclass;
        `);
        console.log(JSON.stringify(res, null, 2));

        console.log('--- tables in payload schema ---');
        const tables = await db.execute(sql`
            SELECT table_name FROM information_schema.tables WHERE table_schema = 'payload';
        `);
        console.log(JSON.stringify(tables, null, 2));
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}

check();
