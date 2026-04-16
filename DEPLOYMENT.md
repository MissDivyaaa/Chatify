# Railway Deployment Guide for Chatify Backend

This repo contains a frontend and backend. The backend should be deployed on Railway because it runs a persistent Node/Express server with Socket.io.

## Step 1: Install Railway CLI

In your terminal:

```powershell
npm install -g @railway/cli
```

Then log in:

```powershell
railway login
```
```

## Step 2: Deploy the backend service

From the backend directory:

```powershell
cd backend
railway init
```

- Choose an existing Railway project or create a new one.
- Select `Node.js` when prompted.

Then deploy:

```powershell
railway up
```

Railway will provision a URL for your backend.

## Step 3: Add environment variables

In Railway, add the backend environment variables to the service settings:

- `PORT` = `3000`
- `MONGO_URI` = your MongoDB Atlas connection string
- `NODE_ENV` = `production`
- `JWT_SECRET` = a secure random string
- `RESEND_API_KEY` = your Resend API key
- `EMAIL_FROM` = your sender email
- `EMAIL_FROM_NAME` = your sender name
- `CLIENT_URL` = your Vercel frontend URL, e.g. `https://your-vercel-app.vercel.app`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `ARCJET_KEY`
- `ARCJET_ENV` = `production`

## Step 4: Update the frontend for production

In `frontend/src/lib/axios.js`, make sure the backend URL resolves correctly in production by using a Vite environment variable:

```js
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api");
```

Then set `VITE_API_URL` in your Vercel project to your Railway backend API URL, for example:

```
https://<your-railway-backend-url>/api
```

After that, rebuild the frontend and redeploy to Vercel.

## Step 5: Optional local test before deploy

If you want to test locally before Railway deploy:

```powershell
cd backend
npm install
npm run dev
```

Then visit your frontend and ensure the backend endpoints work.

---

### Notes

- Railway should automatically detect the `backend/package.json` and use `npm start`.
- The `backend/Procfile` is included to ensure the web process is started correctly.
- Your backend must use a cloud MongoDB URI; local MongoDB will not work in Railway.
