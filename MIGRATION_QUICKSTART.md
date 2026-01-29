# Quick Start: Database Migration

This guide will help you quickly run the database migration for task 2.3.

## Prerequisites Check

Before running the migration, ensure:

- ✅ Dependencies are installed (`npm install` completed)
- ✅ `.env` file exists with `DATABASE_URL` configured
- ✅ PostgreSQL database server is running
- ✅ Database `mypilot` exists

## Quick Setup Options

### Option A: Using Docker (Fastest - Recommended)

1. **Install Docker Desktop** (if not already installed):
   - Download from https://www.docker.com/products/docker-desktop
   - Install and start Docker Desktop

2. **Start the database**:
   ```cmd
   docker-compose up -d
   ```

3. **Run the migration**:
   ```cmd
   scripts\migrate.cmd
   ```

### Option B: Using Existing PostgreSQL

If you already have PostgreSQL installed and running:

1. **Verify PostgreSQL is running**:
   - Check if you can connect to `localhost:5432`
   - Ensure database `mypilot` exists

2. **Run the migration**:
   ```cmd
   scripts\migrate.cmd
   ```

### Option C: Manual Migration (If scripts don't work)

```cmd
node_modules\.bin\prisma.cmd migrate dev --name init
```

## What the Migration Does

When you run the migration, Prisma will:

1. ✅ Create a migration file in `prisma/migrations/`
2. ✅ Create all database tables:
   - User (with authentication fields)
   - Address (shipping addresses)
   - Product (product catalog)
   - ProductTranslation (multi-language support)
   - Category (product categories)
   - CategoryTranslation (multi-language categories)
   - Cart & CartItem (shopping cart)
   - Order & OrderItem (orders)
   - Review (product reviews)
   - ShippingRate (shipping configuration)
   - PasswordResetToken (password reset)

3. ✅ Generate Prisma Client (TypeScript types for database access)

## Verification

After successful migration:

1. **Check migration status**:
   ```cmd
   node_modules\.bin\prisma.cmd migrate status
   ```

2. **View database with Prisma Studio**:
   ```cmd
   npm run prisma:studio
   ```
   Opens http://localhost:5555

3. **Check generated Prisma Client**:
   - Look for `node_modules/.prisma/client/`
   - This contains the generated TypeScript types

## Troubleshooting

### Error: "Can't reach database server at `localhost:5432`"

**Solution**: Database is not running

- **Docker**: Run `docker-compose up -d`
- **Local PostgreSQL**: Start the PostgreSQL service
  - Windows: Services → PostgreSQL → Start
  - Mac: `brew services start postgresql@15`
  - Linux: `sudo systemctl start postgresql`

### Error: "Database 'mypilot' does not exist"

**Solution**: Create the database

- **Docker**: Database is auto-created, just restart: `docker-compose restart`
- **Local PostgreSQL**:
  ```sql
  CREATE DATABASE mypilot;
  ```

### Error: "Authentication failed for user"

**Solution**: Check your `.env` file

- Verify `DATABASE_URL` has correct username and password
- Format: `postgresql://username:password@localhost:5432/mypilot`
- For Docker setup, use: `postgresql://user:password@localhost:5432/mypilot`

### PowerShell Execution Policy Error

**Solution**: Use CMD instead of PowerShell

- Open Command Prompt (CMD)
- Navigate to project directory
- Run `scripts\migrate.cmd`

## Next Steps

After successful migration:

1. ✅ Task 2.3 is complete!
2. ✅ Database tables are created
3. ✅ Prisma Client is generated
4. ✅ Ready to implement authentication (Task 3)

## Need More Help?

- See `DATABASE_SETUP.md` for detailed setup instructions
- See `prisma/README.md` for Prisma-specific documentation
- See `SETUP.md` for general project setup

## Quick Reference Commands

```cmd
# Start Docker database
docker-compose up -d

# Stop Docker database
docker-compose down

# Run migration
scripts\migrate.cmd

# View database
npm run prisma:studio

# Check migration status
node_modules\.bin\prisma.cmd migrate status

# Generate Prisma Client only
npm run prisma:generate
```
