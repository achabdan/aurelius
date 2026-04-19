# Deploy Aurelius on Render

## 1. Push this folder to its own GitHub repository

This project should live in its own repository rooted at `aurelius/`.

## 2. Create the Render services from `render.yaml`

Render can read the root `render.yaml` file and create:

- `aurelius-backend` as a Node web service
- `aurelius-frontend` as a static site

## 3. Set the required environment variables

### Backend

- `DATABASE_URL`: your production Postgres connection string
- `JWT_SECRET`: a long random secret
- `FRONTEND_URL`: your frontend Render URL, for example `https://aurelius-frontend.onrender.com`
- `ADMIN_PASSWORD`: the initial admin password

### Frontend

- `VITE_API_URL`: your backend Render URL, for example `https://aurelius-backend.onrender.com`

## 4. Important note about uploads

This app stores uploaded files on the local filesystem in `uploads/`.
On Render, service files are ephemeral by default, so uploaded images are lost after redeploys or restarts unless you attach a persistent disk or move uploads to external object storage.

## 5. Database schema deploy strategy

The provided `render.yaml` uses `npx prisma db push` in the backend `preDeployCommand` because the repo currently does not include a Prisma migrations folder.
For longer-term production use, prefer checked-in Prisma migrations.
