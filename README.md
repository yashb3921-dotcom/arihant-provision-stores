# Arihant Provision Stores - Vercel Deployment Guide

## Method 1: Deploy via Vercel Dashboard (Easiest - No Code Required)

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Click "Sign Up"
3. Sign up with GitHub, GitLab, or Bitbucket (FREE)

### Step 2: Deploy Website
1. Click "Add New" → "Project"
2. Import your GitHub repository OR
3. Drag and drop your project folder
4. Vercel will auto-detect settings
5. Click "Deploy"
6. Wait 30-60 seconds
7. Your website is LIVE! 🎉

**Live URL:** https://your-project.vercel.app

### Step 3: Deploy Firestore Rules
1. Go to https://console.firebase.google.com
2. Select project: arihant-provision-stores
3. Navigate to Firestore Database → Rules
4. Copy-paste the rules from this README
5. Click "Publish"

---

## Method 2: Deploy via Vercel CLI (For Developers)

### Prerequisites
1. Install Node.js from nodejs.org
2. Install Vercel CLI: `npm install -g vercel`

### Deployment Steps
```bash
# 1. Navigate to your project folder
cd arihant-provision-stores

# 2. Login to Vercel
vercel login

# 3. Deploy to production
vercel --prod

# 4. Follow the prompts:
#    - Set up and deploy? Yes
#    - Which scope? (Select your account)
#    - Link to existing project? No
#    - Project name? arihant-provision-stores
#    - In which directory is your code? ./
#    - Want to override settings? No

# 5. Deployment complete!
# Your URL: https://arihant-provision-stores.vercel.app
```

---

## Method 3: Deploy via GitHub (Continuous Deployment)

### Step 1: Push to GitHub
```bash
# 1. Create new repository on GitHub
# 2. In your project folder:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/arihant-provision.git
git push -u origin main
```

### Step 2: Connect Vercel to GitHub
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Click "Deploy"
5. Done! Auto-deploys on every git push

---

## Custom Domain (Optional - FREE)

### Add Your Own Domain
1. Buy domain from GoDaddy/Namecheap (₹99-500/year)
2. In Vercel Dashboard → Settings → Domains
3. Add your domain (e.g., arihantprovision.com)
4. Update DNS records as shown by Vercel
5. Wait 24-48 hours for DNS propagation
6. Your site is live on custom domain!

---

## Firebase Setup (Backend)

### Firestore Rules (One-time Setup)
1. Go to Firebase Console: https://console.firebase.google.com
2. Select: arihant-provision-stores
3. Firestore Database → Rules → Paste rules → Publish

### Enable Authentication
1. Firebase Console → Authentication
2. Sign-in method → Email/Password → Enable
3. Save

### Create Initial Settings Document
1. Firestore Database → Start collection
2. Collection ID: `settings`
3. Document ID: `shop_status`
4. Field: `shopStatus` (string) = `open`
5. Save

---

## Firestore Security Rules

**COPY AND PASTE THESE INTO FIREBASE CONSOLE:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products are public read, no client write
    match /products/{productId} {
      allow read: if true;
      allow write: if false; // Admin manages through dashboard
    }
    
    // Orders: users can read their own, create new.
    // MODIFIED: Allowed all authenticated users (like Admin) to read all orders for Dashboard.
    match /orders/{orderId} {
      allow read: if request.auth != null; 
      allow create: if request.auth != null;
      allow update, delete: if false;
    }
    
    // Settings: public read, no client write
    match /settings/{docId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

---

## Cost Breakdown

| Service | Free Tier Limits | Cost |
|---------|------------------|------|
| **Vercel Hosting** | Unlimited projects, 100GB bandwidth | ₹0 |
| **Firebase Auth** | Unlimited users | ₹0 |
| **Firestore** | 50K reads, 20K writes/day | ₹0 |
| **Total** | Good for 100-200 orders/day | **₹0** |

