import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq } from 'drizzle-orm';
import * as schema from "../db/schema/payload-generated-schema";
import coffeeShopsData from '../db/coffee_shops.json';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const importCoffeeShops = async () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool, { schema });

  console.log(`Starting import of ${coffeeShopsData.length} coffee shops via Drizzle...`);

  for (const shop of coffeeShopsData) {
    try {
      const existing = await db.select().from(schema.coffee_shops).where(eq(schema.coffee_shops.id, shop.id));

      if (existing.length > 0) {
        console.log(`Skipping existing shop: ${shop.name} (${shop.id})`);
        continue;
      }

      await db.insert(schema.coffee_shops).values({
        id: shop.id || uuidv4(),
        name: shop.name,
        description: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            direction: 'ltr',
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                direction: 'ltr',
                children: [
                  {
                    mode: 'normal',
                    text: shop.description || '',
                    type: 'text',
                    style: '',
                    detail: 0,
                    version: 1,
                  },
                ],
              },
            ],
          },
        },
        latitude: shop.latitude,
        longitude: shop.longitude,
        address: shop.address,
        googleMapsUrl: shop.google_maps_url,
        rating: shop.rating || 0,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      } as any);
      console.log(`Imported: ${shop.name}`);
    } catch (error) {
      console.error(`Error importing ${shop.name}:`, error);
    }
  }

  console.log('Import completed!');
  await pool.end();
  process.exit(0);
};

importCoffeeShops();
