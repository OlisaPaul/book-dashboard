# Testing Guide

This document explains how to run and write tests for the Book Dashboard application.

## Overview

The project uses different testing frameworks for backend and frontend:

- **Backend**: Jest (comes with NestJS)
- **Frontend**: Vitest + React Testing Library

## Backend Tests

### Running Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run E2E tests
npm run test:e2e
```

### Test Structure

```
backend/
├── src/
│   └── books/
│       ├── books.service.spec.ts      # Unit tests for service
│       └── books.resolver.spec.ts     # Unit tests for resolver
└── test/
    └── books.e2e-spec.ts              # E2E tests for GraphQL API
```

### What's Tested

#### BooksService (`books.service.spec.ts`)

- ✅ `findAll()` - Returns all books
- ✅ `findOne()` - Returns a single book by ID
- ✅ `findOne()` - Throws NotFoundException when book not found
- ✅ `create()` - Creates a new book
- ✅ `update()` - Updates an existing book
- ✅ `update()` - Throws NotFoundException when updating non-existent book
- ✅ `remove()` - Deletes a book
- ✅ `remove()` - Throws NotFoundException when deleting non-existent book

#### BooksResolver (`books.resolver.spec.ts`)

- ✅ `findAll()` - GraphQL query returns all books
- ✅ `findOne()` - GraphQL query returns single book
- ✅ `createBook()` - GraphQL mutation creates book
- ✅ `updateBook()` - GraphQL mutation updates book
- ✅ `deleteBook()` - GraphQL mutation deletes book

#### E2E Tests (`books.e2e-spec.ts`)

- ✅ Authentication - All queries/mutations require valid JWT token
- ✅ Returns UNAUTHENTICATED error without token
- ⚠️ Authenticated requests (skipped - requires Auth0 test token)

### Writing New Tests

Example service test:

```typescript
describe("BooksService", () => {
  it("should create a book", async () => {
    const input = { name: "Test", description: "Test" };
    const result = await service.create(input);

    expect(result).toBeDefined();
    expect(result.name).toBe("Test");
  });
});
```

## Frontend Tests

### Running Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Test Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── BookModal.test.tsx         # Component tests
│   ├── pages/
│   │   └── LoginPage.test.tsx         # Page tests
│   └── test/
│       └── setup.ts                   # Test setup
└── vitest.config.ts                   # Vitest configuration
```

### What's Tested

#### BookModal (`BookModal.test.tsx`)

- ✅ Renders in create mode when no book provided
- ✅ Renders in edit mode when book provided
- ✅ Calls onClose when cancel button clicked
- ✅ Shows validation error for empty fields
- ✅ Updates form fields when typing

#### LoginPage (`LoginPage.test.tsx`)

- ✅ Renders page title and description
- ✅ Renders Sign In and Sign Up buttons
- ✅ Buttons have correct styling

### Writing New Tests

Example component test:

```typescript
import { render, screen } from "@testing-library/react";
import { MyComponent } from "./MyComponent";

describe("MyComponent", () => {
  it("should render correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
```

## Test Coverage

### Backend Coverage

Run `npm run test:cov` in the backend directory to see coverage report.

Target coverage:

- Statements: > 80%
- Branches: > 75%
- Functions: > 80%
- Lines: > 80%

### Frontend Coverage

Run `npm run test:coverage` in the frontend directory.

Target coverage:

- Components: > 70%
- Utilities: > 80%

## Continuous Integration

### GitHub Actions (Recommended)

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: cd backend && npm ci
      - run: cd backend && npm test

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: cd frontend && npm ci
      - run: cd frontend && npm test
```

## Mocking

### Backend Mocking

Jest automatically mocks TypeORM repositories:

```typescript
const mockRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
};
```

### Frontend Mocking

Mock Auth0:

```typescript
vi.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({
    isAuthenticated: true,
    user: { email: "test@example.com" },
  }),
}));
```

Mock Apollo Client:

```typescript
import { MockedProvider } from "@apollo/client/testing";

const mocks = [
  {
    request: { query: GET_BOOKS },
    result: { data: { books: [] } },
  },
];

<MockedProvider mocks={mocks}>
  <YourComponent />
</MockedProvider>;
```

## Troubleshooting

### Backend Tests Failing

**Issue**: `Cannot find module`
**Solution**: Run `npm install` in backend directory

**Issue**: Database errors
**Solution**: Tests use in-memory mocks, check mock setup

### Frontend Tests Failing

**Issue**: `ReferenceError: window is not defined`
**Solution**: Check `vitest.config.ts` has `environment: 'jsdom'`

**Issue**: Chakra UI components not rendering
**Solution**: Wrap component in `<ChakraProvider>`

## Best Practices

1. **Test Behavior, Not Implementation**

   - Test what the user sees and does
   - Don't test internal state

2. **Keep Tests Simple**

   - One assertion per test when possible
   - Clear test names

3. **Use Descriptive Names**

   ```typescript
   it("should show error when email is invalid");
   // Better than: it('works')
   ```

4. **Mock External Dependencies**

   - Auth0
   - GraphQL API
   - Database

5. **Test Edge Cases**
   - Empty states
   - Error states
   - Loading states

## Next Steps

- [ ] Add integration tests for full user flows
- [ ] Add visual regression tests with Playwright
- [ ] Set up CI/CD pipeline
- [ ] Increase test coverage to > 80%
- [ ] Add performance tests
