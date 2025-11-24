# Deployment Guide: Discord Bot Manager Dashboard

## 🚀 Deploy to Railway (Recommended)

Railway is perfect for Discord bots and has excellent reliability. Your dashboard will work flawlessly there.

### Step 1: Push to GitHub

1. Initialize git in your Replit project (if not already done):
```bash
git init
git add .
git commit -m "Initial commit: Discord bot manager dashboard"
```

2. Create a new repository on GitHub (https://github.com/new)
   - Name it `discord-bot-manager`
   - Don't initialize with README/gitignore (use existing)

3. Add GitHub as remote and push:
```bash
git remote add origin https://github.com/YOUR_USERNAME/discord-bot-manager.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Railway

1. **Go to Railway** (https://railway.app)
   - Sign up with GitHub (easiest)

2. **Create New Project**
   - Click "Create New Project" → "Deploy from GitHub repo"
   - Select your `discord-bot-manager` repository
   - Click "Deploy"

3. **Add Environment Variables**
   - In Railway dashboard, go to Variables
   - Add: `DISCORD_BOT_TOKEN` = your bot token
   - Railway automatically sets `PORT=8000`

4. **Configure Start Command**
   - Go to Settings in Railway
   - Set Start Command: `npm run build && npm run start`
   - (Or keep it using `npm run dev` for development)

5. **Done!** 🎉
   - Railway automatically deploys and restarts your app
   - Your dashboard will be live with a public URL
   - Discord bot will connect reliably

---

## Alternative: Deploy to Fly.io

### Step 1: Install Fly CLI
```bash
curl -L https://fly.io/install.sh | sh
```

### Step 2: Create fly.toml
In your project root, create `fly.toml`:
```toml
app = "discord-bot-manager"

[build]
  builder = "heroku/buildpacks:20"

[env]
  NODE_ENV = "production"

[[services]]
  internal_port = 5000
  protocol = "tcp"

  [services.ports]
    handlers = ["http"]
    port = 80

  [services.ports]
    handlers = ["tls", "http"]
    port = 443
```

### Step 3: Deploy
```bash
flyctl auth login
flyctl launch
flyctl secrets set DISCORD_BOT_TOKEN=your_token_here
flyctl deploy
```

---

## ✅ After Deployment

Your dashboard will be live with:
- ✅ Real Discord bot connection (no more rate-limiting!)
- ✅ Live server data and member counts
- ✅ Real-time command tracking
- ✅ Live activity feed
- ✅ Working settings management

The same beautiful UI, now with live Discord integration!

---

## 🔧 Troubleshooting

**If bot still doesn't connect on Railway:**
1. Double-check your bot token is correct (Discord Developer Portal → Applications → Your Bot → Reset Token if needed)
2. Verify all 3 intents are enabled in Discord Developer Portal
3. In Railway dashboard, view Logs to see connection errors
4. Railway support is excellent - contact them with error logs

---

## Next Steps

1. Push code to GitHub
2. Sign up on Railway.app
3. Deploy from your GitHub repository
4. Add `DISCORD_BOT_TOKEN` secret
5. Done! Your dashboard is live
