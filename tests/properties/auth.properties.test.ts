/**
 * @jest-environment node
 */
import fc from 'fast-check';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

/**
 * Feature: mypilot-website
 * Property 9: Valid Registration Creates Account
 * 
 * For any valid registration data (unique email, valid password, valid name),
 * submitting registration should create a new customer account that can be used
 * for authentication.
 * 
 * **Validates: Requirements 4.1**
 */
describe('Property 9: Valid Registration Creates Account', () => {
  // Clean up test users after each test
  afterEach(async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: '@test-property-9.com',
        },
      },
    });
  });

  it('valid registration data creates account that can authenticate', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate valid registration data
        fc.record({
          email: fc
            .emailAddress()
            .map((email) => `${email.split('@')[0]}@test-property-9.com`),
          password: fc
            .string({ minLength: 8, maxLength: 20 })
            .filter((pwd) => {
              // Ensure password meets requirements:
              // - At least one uppercase letter
              // - At least one lowercase letter
              // - At least one digit
              return (
                /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /\d/.test(pwd)
              );
            }),
          name: fc.string({ minLength: 2, maxLength: 50 }).filter((name) => {
            // Filter out names with only whitespace or special characters
            return /^[a-zA-Z\s]+$/.test(name) && name.trim().length >= 2;
          }),
        }),
        async ({ email, password, name }) => {
          // Ensure email is unique for this test run
          const existingUser = await prisma.user.findUnique({
            where: { email },
          });

          // Skip if email already exists (collision in test data)
          if (existingUser) {
            return true;
          }

          // Action: Create user with valid data
          const hashedPassword = await hash(password, 12);
          const user = await prisma.user.create({
            data: {
              email,
              name: name.trim(),
              password: hashedPassword,
              role: 'CUSTOMER',
            },
          });

          // Verify: User was created
          expect(user).toBeDefined();
          expect(user.id).toBeDefined();
          expect(user.email).toBe(email);
          expect(user.name).toBe(name.trim());
          expect(user.role).toBe('CUSTOMER');

          // Verify: User can be retrieved
          const retrievedUser = await prisma.user.findUnique({
            where: { email },
          });

          expect(retrievedUser).toBeDefined();
          expect(retrievedUser?.id).toBe(user.id);
          expect(retrievedUser?.email).toBe(email);

          // Verify: Password was hashed (not stored in plain text)
          expect(retrievedUser?.password).not.toBe(password);
          expect(retrievedUser?.password).toBeDefined();
          expect(retrievedUser?.password.length).toBeGreaterThan(20); // bcrypt hashes are long

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: mypilot-website
 * Property 10: Invalid Registration Rejected
 * 
 * For any invalid registration data (duplicate email, weak password, missing fields),
 * submitting registration should be rejected with specific validation errors.
 * 
 * **Validates: Requirements 4.2**
 */
describe('Property 10: Invalid Registration Rejected', () => {
  // Setup: Create a test user for duplicate email tests
  beforeAll(async () => {
    await prisma.user.upsert({
      where: { email: 'existing@test-property-10.com' },
      update: {},
      create: {
        email: 'existing@test-property-10.com',
        name: 'Existing User',
        password: await hash('ValidPass123', 12),
        role: 'CUSTOMER',
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: '@test-property-10.com',
        },
      },
    });
  });

  it('duplicate email is rejected', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          password: fc
            .string({ minLength: 8, maxLength: 20 })
            .filter((pwd) => /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /\d/.test(pwd)),
          name: fc.string({ minLength: 2, maxLength: 50 }).filter((name) => {
            return /^[a-zA-Z\s]+$/.test(name) && name.trim().length >= 2;
          }),
        }),
        async ({ password, name }) => {
          // Action: Try to create user with existing email
          const existingEmail = 'existing@test-property-10.com';

          // Verify: Should throw or return error (checking if user exists)
          const existingUser = await prisma.user.findUnique({
            where: { email: existingEmail },
          });

          expect(existingUser).toBeDefined();

          // Attempting to create with duplicate email should fail
          await expect(
            prisma.user.create({
              data: {
                email: existingEmail,
                name: name.trim(),
                password: await hash(password, 12),
                role: 'CUSTOMER',
              },
            })
          ).rejects.toThrow();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('invalid email format is rejected', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          // Generate invalid email formats
          email: fc.oneof(
            fc.string().filter((s) => !s.includes('@')), // No @ symbol
            fc.string().filter((s) => s.includes('@') && !s.includes('.')), // No domain
            fc.constant(''), // Empty string
            fc.constant('invalid'), // Just a word
            fc.constant('@example.com'), // Missing local part
            fc.constant('user@'), // Missing domain
          ),
          password: fc
            .string({ minLength: 8, maxLength: 20 })
            .filter((pwd) => /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /\d/.test(pwd)),
          name: fc.string({ minLength: 2, maxLength: 50 }).filter((name) => {
            return /^[a-zA-Z\s]+$/.test(name) && name.trim().length >= 2;
          }),
        }),
        async ({ email, password, name }) => {
          // Verify: Invalid email should fail validation
          // Using Zod schema validation
          const { registerSchema } = await import('@/lib/validations/auth');

          const result = registerSchema.safeParse({
            email,
            password,
            name: name.trim(),
          });

          expect(result.success).toBe(false);
          if (!result.success) {
            // Should have email validation error
            const emailError = result.error.errors.find(
              (err) => err.path[0] === 'email'
            );
            expect(emailError).toBeDefined();
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('weak password is rejected', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          email: fc
            .emailAddress()
            .map((email) => `${email.split('@')[0]}@test-property-10.com`),
          // Generate weak passwords that violate requirements
          password: fc.oneof(
            fc.string({ maxLength: 7 }), // Too short
            fc.string({ minLength: 8 }).filter((pwd) => !/[A-Z]/.test(pwd)), // No uppercase
            fc.string({ minLength: 8 }).filter((pwd) => !/[a-z]/.test(pwd)), // No lowercase
            fc.string({ minLength: 8 }).filter((pwd) => !/\d/.test(pwd)), // No digit
          ),
          name: fc.string({ minLength: 2, maxLength: 50 }).filter((name) => {
            return /^[a-zA-Z\s]+$/.test(name) && name.trim().length >= 2;
          }),
        }),
        async ({ email, password, name }) => {
          // Verify: Weak password should fail validation
          const { registerSchema } = await import('@/lib/validations/auth');

          const result = registerSchema.safeParse({
            email,
            password,
            name: name.trim(),
          });

          expect(result.success).toBe(false);
          if (!result.success) {
            // Should have password validation error
            const passwordError = result.error.errors.find(
              (err) => err.path[0] === 'password'
            );
            expect(passwordError).toBeDefined();
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('missing or invalid name is rejected', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          email: fc
            .emailAddress()
            .map((email) => `${email.split('@')[0]}@test-property-10.com`),
          password: fc
            .string({ minLength: 8, maxLength: 20 })
            .filter((pwd) => /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /\d/.test(pwd)),
          // Generate invalid names
          name: fc.oneof(
            fc.constant(''), // Empty
            fc.constant(' '), // Just whitespace
            fc.string({ maxLength: 1 }), // Too short
          ),
        }),
        async ({ email, password, name }) => {
          // Verify: Invalid name should fail validation
          const { registerSchema } = await import('@/lib/validations/auth');

          const result = registerSchema.safeParse({
            email,
            password,
            name,
          });

          expect(result.success).toBe(false);
          if (!result.success) {
            // Should have name validation error
            const nameError = result.error.errors.find(
              (err) => err.path[0] === 'name'
            );
            expect(nameError).toBeDefined();
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: mypilot-website
 * Property 11: Valid Credentials Authenticate
 * 
 * For any existing customer account and correct credentials,
 * authentication should succeed and grant access to the account.
 * 
 * **Validates: Requirements 4.3**
 */
describe('Property 11: Valid Credentials Authenticate', () => {
  // Clean up test users after each test
  afterEach(async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: '@test-property-11.com',
        },
      },
    });
  });

  it('valid credentials authenticate successfully', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate valid user data
        fc.record({
          email: fc
            .emailAddress()
            .map((email) => `${email.split('@')[0]}@test-property-11.com`),
          password: fc
            .string({ minLength: 8, maxLength: 20 })
            .filter((pwd) => {
              // Ensure password meets requirements
              return (
                /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /\d/.test(pwd)
              );
            }),
          name: fc.string({ minLength: 2, maxLength: 50 }).filter((name) => {
            return /^[a-zA-Z\s]+$/.test(name) && name.trim().length >= 2;
          }),
        }),
        async ({ email, password, name }) => {
          // Setup: Create a user account
          const hashedPassword = await hash(password, 12);
          const createdUser = await prisma.user.create({
            data: {
              email,
              name: name.trim(),
              password: hashedPassword,
              role: 'CUSTOMER',
            },
          });

          // Action: Retrieve user and verify password (simulating authentication logic)
          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
              role: true,
            },
          });

          // Verify: User exists
          expect(user).toBeDefined();
          expect(user?.email).toBe(email);

          // Verify: Password verification succeeds with correct password
          const { compare } = await import('bcryptjs');
          const isPasswordValid = await compare(password, user!.password!);
          expect(isPasswordValid).toBe(true);

          // Verify: User data is correct
          expect(user?.id).toBe(createdUser.id);
          expect(user?.name).toBe(name.trim());
          expect(user?.role).toBe('CUSTOMER');

          // Verify: Password is hashed (not plain text)
          expect(user?.password).not.toBe(password);
          expect(user?.password?.length).toBeGreaterThan(20);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('invalid credentials are rejected', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate valid user data and wrong password
        fc.record({
          email: fc
            .emailAddress()
            .map((email) => `${email.split('@')[0]}@test-property-11.com`),
          correctPassword: fc
            .string({ minLength: 8, maxLength: 20 })
            .filter((pwd) => {
              return (
                /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /\d/.test(pwd)
              );
            }),
          wrongPassword: fc
            .string({ minLength: 8, maxLength: 20 })
            .filter((pwd) => {
              return (
                /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /\d/.test(pwd)
              );
            }),
          name: fc.string({ minLength: 2, maxLength: 50 }).filter((name) => {
            return /^[a-zA-Z\s]+$/.test(name) && name.trim().length >= 2;
          }),
        }),
        async ({ email, correctPassword, wrongPassword, name }) => {
          // Ensure passwords are different
          if (correctPassword === wrongPassword) {
            return true; // Skip this iteration
          }

          // Setup: Create a user account with correct password
          const hashedPassword = await hash(correctPassword, 12);
          await prisma.user.create({
            data: {
              email,
              name: name.trim(),
              password: hashedPassword,
              role: 'CUSTOMER',
            },
          });

          // Action: Retrieve user and verify with wrong password
          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
              role: true,
            },
          });

          // Verify: User exists
          expect(user).toBeDefined();

          // Verify: Password verification fails with wrong password
          const { compare } = await import('bcryptjs');
          const isPasswordValid = await compare(wrongPassword, user!.password!);
          expect(isPasswordValid).toBe(false);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('non-existent user authentication is rejected', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate credentials for non-existent user
        fc.record({
          email: fc
            .emailAddress()
            .map((email) => `nonexistent-${Date.now()}-${email.split('@')[0]}@test-property-11.com`),
          password: fc
            .string({ minLength: 8, maxLength: 20 })
            .filter((pwd) => {
              return (
                /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /\d/.test(pwd)
              );
            }),
        }),
        async ({ email, password }) => {
          // Action: Attempt to retrieve non-existent user
          const user = await prisma.user.findUnique({
            where: { email },
          });

          // Verify: User does not exist
          expect(user).toBeNull();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: mypilot-website
 * Property 12: Profile Update Persistence
 * 
 * For any customer and profile updates (name, email, password),
 * after updating profile information, the changes should be persisted
 * and reflected in subsequent profile retrievals.
 * 
 * **Validates: Requirements 4.5**
 */
describe('Property 12: Profile Update Persistence', () => {
  // Clean up test users after each test
  afterEach(async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: '@test-property-12.com',
        },
      },
    });
  });

  it('name update is persisted and reflected in subsequent retrievals', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate initial user data and new name
        fc.record({
          email: fc
            .emailAddress()
            .map((email) => `${email.split('@')[0]}@test-property-12.com`),
          password: fc
            .string({ minLength: 8, maxLength: 20 })
            .filter((pwd) => /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /\d/.test(pwd)),
          initialName: fc.string({ minLength: 2, maxLength: 50 }).filter((name) => {
            return /^[a-zA-Z\s]+$/.test(name) && name.trim().length >= 2;
          }),
          newName: fc.string({ minLength: 2, maxLength: 50 }).filter((name) => {
            return /^[a-zA-Z\s]+$/.test(name) && name.trim().length >= 2;
          }),
        }),
        async ({ email, password, initialName, newName }) => {
          // Ensure names are different
          if (initialName.trim() === newName.trim()) {
            return true; // Skip this iteration
          }

          // Setup: Create a user with initial name
          const hashedPassword = await hash(password, 12);
          const user = await prisma.user.create({
            data: {
              email,
              name: initialName.trim(),
              password: hashedPassword,
              role: 'CUSTOMER',
            },
          });

          // Verify initial state
          expect(user.name).toBe(initialName.trim());

          // Action: Update user name
          const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { name: newName.trim() },
          });

          // Verify: Update returns new name
          expect(updatedUser.name).toBe(newName.trim());
          expect(updatedUser.id).toBe(user.id);
          expect(updatedUser.email).toBe(email);

          // Verify: Subsequent retrieval reflects the change
          const retrievedUser = await prisma.user.findUnique({
            where: { id: user.id },
          });

          expect(retrievedUser).toBeDefined();
          expect(retrievedUser?.name).toBe(newName.trim());
          expect(retrievedUser?.email).toBe(email);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('email update is persisted and reflected in subsequent retrievals', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate initial user data and new email
        fc.record({
          initialEmail: fc
            .emailAddress()
            .map((email) => `initial-${email.split('@')[0]}@test-property-12.com`),
          newEmail: fc
            .emailAddress()
            .map((email) => `new-${email.split('@')[0]}@test-property-12.com`),
          password: fc
            .string({ minLength: 8, maxLength: 20 })
            .filter((pwd) => /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /\d/.test(pwd)),
          name: fc.string({ minLength: 2, maxLength: 50 }).filter((name) => {
            return /^[a-zA-Z\s]+$/.test(name) && name.trim().length >= 2;
          }),
        }),
        async ({ initialEmail, newEmail, password, name }) => {
          // Ensure emails are different
          if (initialEmail === newEmail) {
            return true; // Skip this iteration
          }

          // Setup: Create a user with initial email
          const hashedPassword = await hash(password, 12);
          const user = await prisma.user.create({
            data: {
              email: initialEmail,
              name: name.trim(),
              password: hashedPassword,
              role: 'CUSTOMER',
            },
          });

          // Verify initial state
          expect(user.email).toBe(initialEmail);

          // Action: Update user email
          const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { email: newEmail },
          });

          // Verify: Update returns new email
          expect(updatedUser.email).toBe(newEmail);
          expect(updatedUser.id).toBe(user.id);
          expect(updatedUser.name).toBe(name.trim());

          // Verify: Subsequent retrieval by new email succeeds
          const retrievedByNewEmail = await prisma.user.findUnique({
            where: { email: newEmail },
          });

          expect(retrievedByNewEmail).toBeDefined();
          expect(retrievedByNewEmail?.id).toBe(user.id);
          expect(retrievedByNewEmail?.email).toBe(newEmail);
          expect(retrievedByNewEmail?.name).toBe(name.trim());

          // Verify: Old email no longer retrieves the user
          const retrievedByOldEmail = await prisma.user.findUnique({
            where: { email: initialEmail },
          });

          expect(retrievedByOldEmail).toBeNull();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('password update is persisted and old password no longer works', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate initial user data and new password
        fc.record({
          email: fc
            .emailAddress()
            .map((email) => `${email.split('@')[0]}@test-property-12.com`),
          oldPassword: fc
            .string({ minLength: 8, maxLength: 20 })
            .filter((pwd) => /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /\d/.test(pwd)),
          newPassword: fc
            .string({ minLength: 8, maxLength: 20 })
            .filter((pwd) => /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /\d/.test(pwd)),
          name: fc.string({ minLength: 2, maxLength: 50 }).filter((name) => {
            return /^[a-zA-Z\s]+$/.test(name) && name.trim().length >= 2;
          }),
        }),
        async ({ email, oldPassword, newPassword, name }) => {
          // Ensure passwords are different
          if (oldPassword === newPassword) {
            return true; // Skip this iteration
          }

          // Setup: Create a user with old password
          const hashedOldPassword = await hash(oldPassword, 12);
          const user = await prisma.user.create({
            data: {
              email,
              name: name.trim(),
              password: hashedOldPassword,
              role: 'CUSTOMER',
            },
          });

          // Verify: Old password works initially
          const { compare } = await import('bcryptjs');
          const oldPasswordValid = await compare(oldPassword, user.password);
          expect(oldPasswordValid).toBe(true);

          // Action: Update user password
          const hashedNewPassword = await hash(newPassword, 12);
          const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedNewPassword },
          });

          // Verify: Password was updated (hash changed)
          expect(updatedUser.password).not.toBe(hashedOldPassword);
          expect(updatedUser.password).toBe(hashedNewPassword);

          // Verify: Subsequent retrieval has new password
          const retrievedUser = await prisma.user.findUnique({
            where: { id: user.id },
          });

          expect(retrievedUser).toBeDefined();
          expect(retrievedUser?.password).toBe(hashedNewPassword);

          // Verify: New password works
          const newPasswordValid = await compare(newPassword, retrievedUser!.password);
          expect(newPasswordValid).toBe(true);

          // Verify: Old password no longer works
          const oldPasswordStillValid = await compare(oldPassword, retrievedUser!.password);
          expect(oldPasswordStillValid).toBe(false);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('multiple field updates are persisted together', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate initial and updated user data
        fc.record({
          initialEmail: fc
            .emailAddress()
            .map((email) => `initial-${email.split('@')[0]}@test-property-12.com`),
          newEmail: fc
            .emailAddress()
            .map((email) => `new-${email.split('@')[0]}@test-property-12.com`),
          initialName: fc.string({ minLength: 2, maxLength: 50 }).filter((name) => {
            return /^[a-zA-Z\s]+$/.test(name) && name.trim().length >= 2;
          }),
          newName: fc.string({ minLength: 2, maxLength: 50 }).filter((name) => {
            return /^[a-zA-Z\s]+$/.test(name) && name.trim().length >= 2;
          }),
          oldPassword: fc
            .string({ minLength: 8, maxLength: 20 })
            .filter((pwd) => /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /\d/.test(pwd)),
          newPassword: fc
            .string({ minLength: 8, maxLength: 20 })
            .filter((pwd) => /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /\d/.test(pwd)),
        }),
        async ({ initialEmail, newEmail, initialName, newName, oldPassword, newPassword }) => {
          // Ensure values are different
          if (initialEmail === newEmail || initialName.trim() === newName.trim() || oldPassword === newPassword) {
            return true; // Skip this iteration
          }

          // Setup: Create a user with initial data
          const hashedOldPassword = await hash(oldPassword, 12);
          const user = await prisma.user.create({
            data: {
              email: initialEmail,
              name: initialName.trim(),
              password: hashedOldPassword,
              role: 'CUSTOMER',
            },
          });

          // Verify initial state
          expect(user.email).toBe(initialEmail);
          expect(user.name).toBe(initialName.trim());

          // Action: Update all fields at once
          const hashedNewPassword = await hash(newPassword, 12);
          const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
              email: newEmail,
              name: newName.trim(),
              password: hashedNewPassword,
            },
          });

          // Verify: All updates are reflected in the response
          expect(updatedUser.email).toBe(newEmail);
          expect(updatedUser.name).toBe(newName.trim());
          expect(updatedUser.password).toBe(hashedNewPassword);

          // Verify: Subsequent retrieval reflects all changes
          const retrievedUser = await prisma.user.findUnique({
            where: { id: user.id },
          });

          expect(retrievedUser).toBeDefined();
          expect(retrievedUser?.email).toBe(newEmail);
          expect(retrievedUser?.name).toBe(newName.trim());
          expect(retrievedUser?.password).toBe(hashedNewPassword);

          // Verify: New password works
          const { compare } = await import('bcryptjs');
          const newPasswordValid = await compare(newPassword, retrievedUser!.password);
          expect(newPasswordValid).toBe(true);

          // Verify: Old password no longer works
          const oldPasswordStillValid = await compare(oldPassword, retrievedUser!.password);
          expect(oldPasswordStillValid).toBe(false);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
