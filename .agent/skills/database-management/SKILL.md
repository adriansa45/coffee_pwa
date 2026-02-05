---
name: Database Management
description: Guidelines for managing database changes, schemas, and migrations using Drizzle ORM and Payload CMS.
---

# Database Management Skill

This skill defines the workflow for making changes to the database and managing the separation between operational data and CMS content.

## Core Principles

1.  **Migrations as Source of Truth**: All database changes MUST be made via Drizzle migrations. Never modify the database directly.
2.  **Schema Separation**:
    *   **`public` schema**: Contains all **operational tables**. These tables are core to the application's logic (e.g., authentication, settings) and **DO NOT depend on Payload CMS**.
    *   **`payload` schema**: Contains all tables managed by **Payload CMS** (e.g., coffee shops, tags, content). This ensures a clean separation between the CMS and the core business logic.
3.  **Operational vs Content**: Operational tables are for app mechanics; Payload tables are for catalogs and dynamic content.

## Migration Workflow

Ensuring the database is always in sync with your schema definitions.

### 1. Update Schema
Modify the files in `src/db/schema`.
*   Operational tables should be defined in `src/db/schema/schema.ts` or similar files mapping to the `public` schema.
*   Payload tables are defined in Payload collections and synced to `src/db/schema/payload-generated-schema.ts`.

### 2. Generate Migration
Create a SQL migration file based on your schema changes:
```powershell
npm run db:generate
```

### 3. Apply Migration
Push the changes to the live database:
```powershell
npm run db:migrate
```

## Relevant Commands

| Action | Command |
| :--- | :--- |
| **Generate Migration** | `npm run db:generate` |
| **Apply Migration** | `npm run db:migrate` |
| **DB Explorer** | `npm run db:studio` |
| **Payload Migration** | `npm run payload migrate:create <name>` |

> [!IMPORTANT]
> Always check the generated SQL file in the `drizzle/` directory before applying it to ensure no destructive changes are made accidentally.
