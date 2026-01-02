# Book Dashboard - Full Stack Application

A full-stack book management dashboard with authentication and CRUD operations.

## Tech Stack

### Backend

- **NestJS** - Progressive Node.js framework
- **GraphQL** - API query language with Apollo Server
- **TypeORM** - ORM for database management
- **SQLite** - Lightweight database (stored in repository)
- **Auth0** - Authentication and authorization

### Frontend

- **React** - UI library
- **Vite** - Build tool
- **Chakra UI** - Component library
- **Apollo Client** - GraphQL client
- **Auth0 React SDK** - Authentication

## Project Structure

```
book-dashboard/
├── backend/          # NestJS backend
│   ├── src/
│   │   ├── auth/     # Auth0 guard
│   │   ├── books/    # Book module (entity, service, resolver)
│   │   └── main.ts
│   ├── database.sqlite
│   └── .env
├── frontend/         # React frontend
│   ├── src/
│   └── .env
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm
- Auth0 account (free tier)

### Auth0 Setup

1. Create a free account at [Auth0](https://auth0.com/)
2. Create a new **API**:
   - Name: `Book Dashboard API`
   - Identifier: `https://book-dashboard-api` (save this as `AUTH0_AUDIENCE`)
3. Create a new **Application** (Single Page Application):
   - Name: `Book Dashboard`
   - Save the **Domain** and **Client ID**
   - Add callback URLs: `http://localhost:5173`
   - Add logout URLs: `http://localhost:5173`
   - Add allowed web origins: `http://localhost:5173`

### Backend Setup

```bash
cd backend

# Install dependencies (already done)
npm install

# Configure environment variables
# Edit .env file with your Auth0 credentials:
# AUTH0_DOMAIN=your-tenant.auth0.com
# AUTH0_AUDIENCE=https://book-dashboard-api

# Start development server
npm run start:dev
```

Backend will run on `http://localhost:3001`
GraphQL Playground: `http://localhost:3001/graphql`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
# Edit .env file with your Auth0 credentials

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## Features

- ✅ User authentication (sign up/sign in) via Auth0
- ✅ View all books in a table
- ✅ Create new books
- ✅ Edit existing books
- ✅ Delete books
- ✅ Protected GraphQL API (requires authentication)

## Development

### Backend Commands

```bash
npm run start:dev    # Start in development mode
npm run build        # Build for production
npm run start:prod   # Start production server
```

### Frontend Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Deployment

### Backend (Render)

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect repository
4. Set environment variables
5. Deploy

### Frontend (Netlify)

1. Build frontend: `npm run build`
2. Deploy `dist/` folder to Netlify
3. Set environment variables
4. Configure redirects for SPA

## Conventional Commits

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(backend): add book entity
fix(frontend): resolve auth redirect issue
docs: update README with deployment steps
```

## License

MIT
