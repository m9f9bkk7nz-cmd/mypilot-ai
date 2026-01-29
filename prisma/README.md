# Prisma Database Setup Guide

## Prerequisites

Before running migrations, ensure you have:

1. **PostgreSQL installed and running**
   - Install PostgreSQL 15+ on your system
   - Create a database named `mypilot`
   - Update the `DATABASE_URL` in your `.env` file with your credentials

2. **Dependencies installed**
   ```bash
   npm install
   ```

## Database Setup Steps

### 1. Configure Database Connection

Update your `.env` file with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/mypilot"
```

Replace:
- `username` with your PostgreSQL username
- `password` with your PostgreSQL password
- `localhost:5432` with your PostgreSQL host and port
- `mypilot` with your database name

### 2. Generate Initial Migration

Run the following command to create the initial migration:

```bash
npm run prisma:migrate
```

This will:
- Create a new migration file in `prisma/migrations/`
- Apply the migration to your database
- Generate the Prisma Client

When prompted, enter a name for the migration (e.g., "init" or "initial_schema")

### 3. Generate Prisma Client

If you need to regenerate the Prisma Client without running migrations:

```bash
npm run prisma:generate
```

### 4. Verify Database Setup

You can use Prisma Studio to visually inspect your database:

```bash
npm run prisma:studio
```

This will open a browser window with Prisma Studio at http://localhost:5555

## Common Commands

### Create a new migration
```bash
npm run prisma:migrate
```

### Apply migrations in production
```bash
npx prisma migrate deploy
```

### Reset database (WARNING: deletes all data)
```bash
npx prisma migrate reset
```

### Push schema changes without creating migration (for development)
```bash
npm run prisma:push
```

### Format schema file
```bash
npx prisma format
```

### Validate schema
```bash
npx prisma validate
```

## Database Schema Overview

The schema includes the following models:

- **User**: Customer and admin accounts
- **Address**: Shipping addresses for users
- **Product**: Product catalog with inventory
- **ProductTranslation**: Multi-language product content
- **Category**: Product categories with hierarchy
- **CategoryTranslation**: Multi-language category content
- **Cart**: Shopping carts for users and sessions
- **CartItem**: Items in shopping carts
- **Order**: Customer orders
- **OrderItem**: Items in orders
- **Review**: Product reviews by customers
- **ShippingRate**: Shipping cost configuration

## Troubleshooting

### Connection Issues

If you get connection errors:

1. Verify PostgreSQL is running:
   ```bash
   # On Windows
   pg_ctl status
   
   # On Linux/Mac
   sudo systemctl status postgresql
   ```

2. Check your DATABASE_URL format
3. Ensure the database exists:
   ```sql
   CREATE DATABASE mypilot;
   ```

### Migration Conflicts

If you encounter migration conflicts:

1. Check the migration history:
   ```bash
   npx prisma migrate status
   ```

2. Resolve conflicts manually or reset (development only):
   ```bash
   npx prisma migrate reset
   ```

### Schema Validation Errors

If the schema has errors:

1. Run validation:
   ```bash
   npx prisma validate
   ```

2. Format the schema:
   ```bash
   npx prisma format
   ```

## Next Steps

After setting up the database:

1. Run the application: `npm run dev`
2. The Prisma Client will be available at `@/lib/prisma`
3. Start implementing API routes using the Prisma Client

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
