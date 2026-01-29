# MyPilot Property-Based Tests

This directory contains property-based tests using fast-check to verify correctness properties of the MyPilot system.

## Setup

Before running tests, install dependencies:

```bash
npm install
```

## Running Tests

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Test Structure

- `properties/` - Property-based tests that verify universal properties across many inputs
- `unit/` - Unit tests for specific examples and edge cases
- `integration/` - Integration tests for multi-component workflows

## Property Test Configuration

All property tests run with a minimum of 100 iterations to ensure thorough coverage of the input space.
