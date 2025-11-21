# Deployment Guide - Infinite Path Puzzle

This guide will help you deploy your game to GitHub and Vercel.

## 📦 Step 1: Push to GitHub

### 1.1 Initialize Git Repository

```bash
cd "/Users/d0r1h/Infinite Path Puzzle"
git init
```

### 1.2 Create .gitignore (Already exists)

The `.gitignore` file is already created and includes:
- `node_modules/`
- `dist/`
- `.DS_Store`
- etc.

### 1.3 Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the **"+"** icon → **"New repository"**
3. Name it: `infinite-path-puzzle`
4. Description: "A progressive path-connecting puzzle game"
5. Keep it **Public** (or Private if you prefer)
6. **Don't** initialize with README (we already have one)
7. Click **"Create repository"**

### 1.4 Add and Commit Files

```bash
# Add all files
git add .

# Commit
git commit -m "Initial commit: Infinite Path Puzzle game"
```

### 1.5 Push to GitHub

Replace `YOUR_USERNAME` with your GitHub username:

```bash
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/infinite-path-puzzle.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 🚀 Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to [Vercel](https://vercel.com)**
2. **Sign in** with GitHub
3. Click **"Add New Project"**
4. **Import** your `infinite-path-puzzle` repository
5. Vercel will auto-detect Vite settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **"Deploy"**
7. Wait 1-2 minutes for deployment
8. Your game will be live at: `https://infinite-path-puzzle.vercel.app`

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? infinite-path-puzzle
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

---

## 🔧 Step 3: Update README with Live URL

After deployment, update your README.md:

```markdown
## 🎮 Play Now

[**Play the Game →**](https://infinite-path-puzzle.vercel.app)
```

Then commit and push:

```bash
git add README.md
git commit -m "Add live demo URL"
git push
```

---

## 📱 Step 4: Share Your Game!

Your game is now live! Share it:

- **Live URL**: `https://infinite-path-puzzle.vercel.app`
- **GitHub**: `https://github.com/YOUR_USERNAME/infinite-path-puzzle`
- **Twitter**: Share on [X/Twitter](https://x.com/d0r1h)

---

## 🔄 Future Updates

When you make changes:

```bash
# Make your changes
# ...

# Commit changes
git add .
git commit -m "Description of changes"
git push

# Vercel will automatically redeploy!
```

---

## 🎉 You're Done!

Your Infinite Path Puzzle is now:
- ✅ Hosted on GitHub
- ✅ Deployed on Vercel
- ✅ Automatically deploys on push
- ✅ Live and playable worldwide!

Enjoy! 🎮
