# Deploy ColtCircle (Render)

This app deploys as **one** web service: Express serves the API and the built React app.

## 1. Atlas (required for cloud)

1. MongoDB Atlas → **Network Access**
2. Add IP **`0.0.0.0/0`** (Allow from anywhere) so Render can connect
3. Keep your `MONGO_URI` ready

## 2. Push code to GitHub

Repo: `https://github.com/CandaCzareena/COMP_225`

## 3. Create the Render service

1. Go to [https://dashboard.render.com](https://dashboard.render.com) and sign in (GitHub)
2. **New** → **Web Service**
3. Connect `CandaCzareena/COMP_225`
4. Settings:
   - **Runtime:** Node
   - **Do not use Yarn** — delete any Build Command that starts with `yarn` (exit 127)
   - **Build Command:** `npm install --include=dev && npm install --prefix ./client --include=dev && npm run build --prefix ./client`
   - **Start Command:** `npm start`
   - **Instance type:** Free
   - If the service was auto-created with Yarn, open **Settings → Build & Deploy**, paste the npm commands above, then **Clear build cache & deploy**
5. **Environment** variables (click **Save Changes** after adding):

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `NPM_CONFIG_PRODUCTION` | `false` |
| `MONGO_URI` | your Atlas connection string |
| `JWT_SECRET` | any long random string |
| `PORT` | `10000` (Render often sets this automatically) |

6. Click **Create Web Service** and wait for the deploy to finish (first build can take a few minutes).

## 4. Verify

- Open `https://YOUR-SERVICE.onrender.com`
- Health check: `https://YOUR-SERVICE.onrender.com/api/health`
- Sign up / log in and confirm Mongo features work

## Notes

- Free Render services **spin down** after idle time; first request may be slow.
- Local development is unchanged: `npm run dev` (Vite + nodemon).
