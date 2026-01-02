# Quick Start Guide

## Prerequisites

Before running the application, you need to configure Auth0. See [AUTH0_SETUP.md](./AUTH0_SETUP.md) for detailed instructions.

## Quick Setup (After Auth0 Configuration)

### 1. Configure Backend Environment

Edit `backend/.env`:

```env
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_AUDIENCE=https://book-dashboard-api
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### 2. Configure Frontend Environment

Create `frontend/.env`:

```env
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://book-dashboard-api
VITE_API_URL=http://localhost:3001/graphql
```

### 3. Start Backend

```bash
cd backend
npm run start:dev
```

You should see:

```
[Nest] Application successfully started
Application is running on: http://[::1]:3001
```

### 4. Start Frontend (in a new terminal)

```bash
cd frontend
npm run dev
```

You should see:

```
VITE v7.3.0  ready in XXX ms
➜  Local:   http://localhost:5173/
```

### 5. Test the Application

1. Open `http://localhost:5173` in your browser
2. Click **"Sign Up"** to create a new account
3. Complete the Auth0 registration
4. You'll be redirected to the dashboard
5. Try creating, editing, and deleting books!

## Troubleshooting

### Backend won't start - "audience is required" error

**Problem**: Environment variables not loaded

**Solution**:

- Verify `backend/.env` file exists and has correct values
- Make sure there are no typos in variable names
- Restart the backend server

### Frontend shows "Invalid token" error

**Problem**: Auth0 configuration mismatch

**Solution**:

- Verify `AUTH0_AUDIENCE` is the same in both backend and frontend `.env` files
- Check that `AUTH0_DOMAIN` matches your Auth0 tenant
- Clear browser localStorage and try logging in again

### CORS errors in browser console

**Problem**: Frontend URL not allowed

**Solution**:

- Verify `FRONTEND_URL` in backend `.env` is `http://localhost:5173`
- Add `http://localhost:5173` to Auth0 "Allowed Web Origins"

### GraphQL Playground

Access the GraphQL Playground at `http://localhost:3001/graphql` to test queries manually.

**Note**: You'll need to add an Authorization header with a valid JWT token to test protected queries.

## Next Steps

Once local testing works:

- Follow deployment guides for Render (backend) and Netlify (frontend)
- Update Auth0 with production URLs
- Test the deployed application
