# Authentication System

This directory contains the authentication implementation for the MyPilot website.

## Overview

The authentication system uses NextAuth.js with the following features:
- Email/password authentication with bcrypt hashing
- OAuth providers (Google, GitHub)
- JWT-based sessions
- Password reset functionality
- Role-based access control (CUSTOMER, ADMIN)

## Installation

Before using the authentication system, install the required dependencies:

```bash
npm install
```

Then generate the Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

## Environment Variables

Add the following to your `.env` file:

```env
# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

Generate a secure NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

## API Endpoints

### Registration
**POST** `/api/auth/register`

Register a new user account.

Request body:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}
```

Response (201):
```json
{
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "CUSTOMER",
    "createdAt": "..."
  },
  "message": "User registered successfully"
}
```

### Login
**POST** `/api/auth/login`

Authenticate a user (alternative to NextAuth signIn).

Request body:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

Response (200):
```json
{
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "CUSTOMER"
  },
  "message": "Login successful"
}
```

### NextAuth Endpoints
NextAuth provides the following endpoints at `/api/auth/[...nextauth]`:
- `/api/auth/signin` - Sign in page
- `/api/auth/signout` - Sign out
- `/api/auth/callback/[provider]` - OAuth callbacks
- `/api/auth/session` - Get current session

### Password Reset Request
**POST** `/api/auth/password-reset/request`

Request a password reset email.

Request body:
```json
{
  "email": "user@example.com"
}
```

Response (200):
```json
{
  "message": "If an account with that email exists, a password reset link has been sent"
}
```

### Password Reset Confirm
**POST** `/api/auth/password-reset/confirm`

Reset password using a token.

Request body:
```json
{
  "token": "reset-token-from-email",
  "password": "NewSecurePass123"
}
```

Response (200):
```json
{
  "message": "Password has been reset successfully"
}
```

## Usage in Components

### Client-side

```typescript
import { useSession, signIn, signOut } from "next-auth/react";

function MyComponent() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "authenticated") {
    return (
      <div>
        <p>Signed in as {session.user.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => signIn()}>Sign in</button>
    </div>
  );
}
```

### Server-side

```typescript
import { getCurrentUser, requireAuth, requireAdmin } from "@/lib/session";

// Get current user (returns null if not authenticated)
const user = await getCurrentUser();

// Require authentication (throws error if not authenticated)
const user = await requireAuth();

// Require admin role (throws error if not admin)
const admin = await requireAdmin();
```

## Security Features

1. **Password Hashing**: Passwords are hashed using bcrypt with 12 rounds
2. **JWT Tokens**: Sessions use JWT tokens for stateless authentication
3. **Password Requirements**: 
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
4. **Email Uniqueness**: Prevents duplicate accounts
5. **Token Expiration**: Password reset tokens expire after 1 hour
6. **Token Invalidation**: Old reset tokens are invalidated when new ones are created
7. **Secure Token Storage**: Reset tokens are hashed before storage

## Validation

All inputs are validated using Zod schemas defined in `lib/validations/auth.ts`.

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "User-friendly error message",
    "details": [...],
    "requestId": "...",
    "timestamp": "..."
  }
}
```

## Next Steps

1. Configure OAuth providers (optional)
2. Set up email service for password reset emails
3. Implement rate limiting for authentication endpoints
4. Add security event logging
5. Implement property-based tests for authentication flows
