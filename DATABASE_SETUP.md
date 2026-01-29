# Database Setup Guide for MyPilot

This guide will help you set up PostgreSQL for the MyPilot project.

## Option 1: Using Docker (Recommended)

This is the easiest way to get started. Docker will handle all the setup for you.

### Prerequisites
- Docker Desktop installed on your system
- Docker Desktop running

### Steps

1. **Start the database services**:
   ```cmd
   docker-compose up -d
   ```

   This will start both PostgreSQL and Redis in the background.

2. **Verify the services are running**:
   ```cmd
   docker-compose ps
   ```

   You should see both `mypilot-postgres` and `mypilot-redis` with status "Up".

3. **Your `.env` file is already configured** with the correct connection string:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/mypilot"
   ```

4. **Run the database migration** (see "Running Migrations" section below)

### Useful Docker Commands

- **Stop the services**: `docker-compose stop`
- **Start the services**: `docker-compose start`
- **Stop and remove containers**: `docker-compose down`
- **View logs**: `docker-compose logs -f postgres`
- **Access PostgreSQL CLI**: `docker exec -it mypilot-postgres psql -U user -d mypilot`

## Option 2: Using Local PostgreSQL Installation

If you prefer to install PostgreSQL directly on your system:

### Windows

1. **Download PostgreSQL**:
   - Visit https://www.postgresql.org/download/windows/
   - Download the installer for PostgreSQL 15 or later
   - Run the installer and follow the setup wizard

2. **During installation**:
   - Set a password for the postgres user (remember this!)
   - Keep the default port (5432)
   - Install pgAdmin 4 (optional but helpful)

3. **Create the database**:
   - Open pgAdmin 4 or use psql command line
   - Create a new database named `mypilot`

4. **Update your `.env` file**:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/mypilot"
   ```
   Replace `YOUR_PASSWORD` with the password you set during installation.

### macOS

1. **Install PostgreSQL using Homebrew**:
   ```bash
   brew install postgresql@15
   brew services start postgresql@15
   ```

2. **Create the database**:
   ```bash
   createdb mypilot
   ```

3. **Update your `.env` file**:
   ```env
   DATABASE_URL="postgresql://$(whoami)@localhost:5432/mypilot"
   ```

### Linux (Ubuntu/Debian)

1. **Install PostgreSQL**:
   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

2. **Create the database**:
   ```bash
   sudo -u postgres createdb mypilot
   sudo -u postgres psql -c "CREATE USER user WITH PASSWORD 'password';"
   sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE mypilot TO user;"
   ```

3. **Update your `.env` file**:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/mypilot"
   ```

## Option 3: Using Cloud PostgreSQL

You can use a cloud-hosted PostgreSQL service:

### Supabase (Free tier available)
1. Visit https://supabase.com
2. Create a new project
3. Copy the connection string from Settings > Database
4. Update your `.env` file with the connection string

### Neon (Free tier available)
1. Visit https://neon.tech
2. Create a new project
3. Copy the connection string
4. Update your `.env` file with the connection string

### Railway (Free tier available)
1. Visit https://railway.app
2. Create a new PostgreSQL database
3. Copy the connection string
4. Update your `.env` file with the connection string

## Running Migrations

Once your database is set up and running, run the migrations:

```cmd
node_modules\.bin\prisma.cmd migrate dev --name init
```

Or if you're using CMD (not PowerShell):

```cmd
npx prisma migrate dev --name init
```

This will:
1. Create the migration files in `prisma/migrations/`
2. Apply the migration to create all database tables
3. Generate the Prisma Client

## Verifying the Setup

1. **Check the migration status**:
   ```cmd
   node_modules\.bin\prisma.cmd migrate status
   ```

2. **View your database with Prisma Studio**:
   ```cmd
   node_modules\.bin\prisma.cmd studio
   ```
   
   This will open http://localhost:5555 where you can see all your tables.

3. **Test the connection** by running the dev server:
   ```cmd
   npm run dev
   ```

## Troubleshooting

### "Can't reach database server"
- **Docker**: Make sure Docker Desktop is running and containers are up (`docker-compose ps`)
- **Local**: Make sure PostgreSQL service is running
- **Cloud**: Check your internet connection and verify the connection string

### "Database does not exist"
- Create the database manually using the steps above for your setup method

### "Authentication failed"
- Double-check the username and password in your `DATABASE_URL`
- Make sure there are no extra spaces in the `.env` file

### PowerShell execution policy errors
- Use CMD instead of PowerShell
- Or use the full path: `node_modules\.bin\prisma.cmd` instead of `npx prisma`

## Next Steps

After successfully running the migrations:

1. ✅ Database tables are created
2. ✅ Prisma Client is generated
3. ✅ You're ready to start implementing API routes
4. Continue with task 3: Authentication System Implementation

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
