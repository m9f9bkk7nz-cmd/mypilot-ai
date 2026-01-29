# Database Migration Guide

## Initial Setup

This guide walks you through setting up the database for the first time.

### Step 1: Install Dependencies

First, ensure all npm packages are installed:

```bash
npm install
```

This will install:
- `prisma` - Prisma CLI for migrations
- `@prisma/client` - Prisma Client for database queries
- `bcryptjs` - For password hashing in seed data
- `ts-node` - For running TypeScript seed files

### Step 2: Set Up PostgreSQL

1. **Install PostgreSQL** (if not already installed):
   - Windows: Download from https://www.postgresql.org/download/windows/
   - Mac: `brew install postgresql@15`
   - Linux: `sudo apt-get install postgresql-15`

2. **Start PostgreSQL service**:
   - Windows: PostgreSQL should start automatically
   - Mac: `brew services start postgresql@15`
   - Linux: `sudo systemctl start postgresql`

3. **Create the database**:
   ```bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE mypilot;
   
   # Create user (optional, if you want a dedicated user)
   CREATE USER mypilot_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE mypilot TO mypilot_user;
   
   # Exit psql
   \q
   ```

### Step 3: Configure Environment Variables

Update your `.env` file with the correct database connection string:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/mypilot"
```

Or if you created a dedicated user:

```env
DATABASE_URL="postgresql://mypilot_user:your_password@localhost:5432/mypilot"
```

### Step 4: Generate and Run Initial Migration

Run the migration command to create all database tables:

```bash
npm run prisma:migrate
```

When prompted for a migration name, enter: `init`

This command will:
1. Create a new migration file in `prisma/migrations/`
2. Execute the SQL to create all tables
3. Generate the Prisma Client

You should see output like:
```
✔ Enter a name for the new migration: … init
Applying migration `20240127000000_init`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20240127000000_init/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client (5.9.0) to ./node_modules/@prisma/client
```

### Step 5: Seed the Database (Optional)

Populate the database with initial data:

```bash
npm run prisma:seed
```

This will create:
- Admin user (email: admin@mypilot.com, password: admin123)
- Test customer (email: customer@example.com, password: customer123)
- Product categories (Hardware, Cameras, Sensors)
- Sample products (4 products)
- Shipping rates for different countries

### Step 6: Verify Setup

Open Prisma Studio to verify the database:

```bash
npm run prisma:studio
```

This opens a browser at http://localhost:5555 where you can:
- View all tables
- Browse seeded data
- Manually add/edit/delete records

## Common Migration Commands

### Create a new migration after schema changes
```bash
npm run prisma:migrate
```

### Reset database (WARNING: deletes all data)
```bash
npx prisma migrate reset
```

### Apply migrations in production
```bash
npx prisma migrate deploy
```

### Generate Prisma Client only
```bash
npm run prisma:generate
```

### Push schema changes without migration (dev only)
```bash
npm run prisma:push
```

## Troubleshooting

### Error: "Can't reach database server"

**Solution**: Ensure PostgreSQL is running
```bash
# Check status
# Windows: Check Services app
# Mac: brew services list
# Linux: sudo systemctl status postgresql
```

### Error: "Database does not exist"

**Solution**: Create the database
```bash
psql -U postgres -c "CREATE DATABASE mypilot;"
```

### Error: "Authentication failed"

**Solution**: Check your DATABASE_URL credentials
- Verify username and password
- Ensure the user has access to the database

### Error: "Migration failed"

**Solution**: Reset and try again (development only)
```bash
npx prisma migrate reset
npm run prisma:migrate
```

### Error: "Prisma Client not generated"

**Solution**: Generate the client manually
```bash
npm run prisma:generate
```

## Migration Workflow for Development

1. **Make schema changes** in `prisma/schema.prisma`
2. **Create migration**: `npm run prisma:migrate`
3. **Name the migration** descriptively (e.g., "add_user_preferences")
4. **Test the migration** locally
5. **Commit migration files** to version control

## Migration Workflow for Production

1. **Pull latest code** with migration files
2. **Run migrations**: `npx prisma migrate deploy`
3. **Verify deployment**: Check application logs
4. **Rollback if needed**: Restore database backup

## Database Schema Overview

The current schema includes:

### Core Models
- **User**: Authentication and user profiles
- **Address**: User shipping addresses
- **Cart / CartItem**: Shopping cart functionality

### Product Models
- **Product**: Product catalog
- **ProductTranslation**: Multi-language support
- **Category**: Product categorization
- **CategoryTranslation**: Multi-language categories

### Order Models
- **Order**: Customer orders
- **OrderItem**: Order line items
- **ShippingRate**: Shipping cost configuration

### Review Model
- **Review**: Product reviews and ratings

## Next Steps

After completing the database setup:

1. ✅ Database is ready
2. ✅ Prisma Client is generated
3. ✅ Sample data is seeded (if you ran the seed command)
4. 🚀 Start implementing API routes using Prisma Client
5. 🚀 Import Prisma Client: `import { prisma } from '@/lib/prisma'`

## Additional Resources

- [Prisma Migrate Documentation](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Prisma Client Documentation](https://www.prisma.io/docs/concepts/components/prisma-client)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
