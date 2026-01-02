# Auth0 Setup Guide

This guide will walk you through setting up Auth0 for the Book Dashboard application.

## Step 1: Create Auth0 Account

1. Go to [auth0.com](https://auth0.com/)
2. Click "Sign Up" and create a free account
3. Complete the registration process

## Step 2: Create an API

1. In the Auth0 Dashboard, go to **Applications** → **APIs**
2. Click **Create API**
3. Fill in the details:
   - **Name**: `Book Dashboard API`
   - **Identifier**: `https://book-dashboard-api` (this will be your `AUTH0_AUDIENCE`)
   - **Signing Algorithm**: RS256
4. Click **Create**
5. **Save the Identifier** - you'll need this for your environment variables

## Step 3: Create an Application

1. In the Auth0 Dashboard, go to **Applications** → **Applications**
2. Click **Create Application**
3. Fill in the details:
   - **Name**: `Book Dashboard`
   - **Application Type**: Select **Single Page Web Applications**
4. Click **Create**
5. Go to the **Settings** tab and note:
   - **Domain** (e.g., `dev-xxxxx.us.auth0.com`)
   - **Client ID**
6. Scroll down to **Application URIs** and configure:
   - **Allowed Callback URLs**: `http://localhost:5173`
   - **Allowed Logout URLs**: `http://localhost:5173`
   - **Allowed Web Origins**: `http://localhost:5173`
7. Click **Save Changes**

## Step 4: Configure Backend Environment Variables

Edit `backend/.env` file:

```env
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_AUDIENCE=https://book-dashboard-api
PORT=3001
FRONTEND_URL=http://localhost:5173
```

Replace `your-tenant.auth0.com` with your actual Auth0 domain from Step 3.

## Step 5: Configure Frontend Environment Variables

Create `frontend/.env` file (it's gitignored):

```env
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id-from-step-3
VITE_AUTH0_AUDIENCE=https://book-dashboard-api
VITE_API_URL=http://localhost:3001/graphql
```

Replace:

- `your-tenant.auth0.com` with your Auth0 domain
- `your-client-id-from-step-3` with your Client ID from Step 3

## Step 6: Test the Setup

1. Start the backend:

   ```bash
   cd backend
   npm run start:dev
   ```

2. In a new terminal, start the frontend:

   ```bash
   cd frontend
   npm run dev
   ```

3. Open `http://localhost:5173` in your browser
4. Click "Sign Up" to create a test user
5. After signing up, you should be redirected to the dashboard

## For Production Deployment

When deploying to production, you'll need to:

1. Update **Allowed Callback URLs** in Auth0 to include your production URL:
   - Example: `https://your-app.netlify.app`
2. Update **Allowed Logout URLs** and **Allowed Web Origins** similarly
3. Update environment variables in your deployment platform (Netlify, Render, etc.)

## Troubleshooting

### "Invalid or missing token" error

- Verify your `AUTH0_DOMAIN` and `AUTH0_AUDIENCE` match in both backend and frontend
- Check that the API identifier matches exactly

### Redirect loop after login

- Ensure callback URLs are correctly configured in Auth0
- Check that `VITE_AUTH0_AUDIENCE` matches your API identifier

### CORS errors

- Verify `FRONTEND_URL` is set correctly in backend `.env`
- Check that your frontend URL is in the Allowed Web Origins in Auth0
