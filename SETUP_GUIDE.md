# Kids Schedule App - Complete Setup Guide

Welcome! This guide will walk you through setting up and deploying your Kids Schedule App. Even if you're not technical, you can follow these steps!

## Overview

Your app has 3 main parts:
1. **Frontend** - What users see in the browser
2. **Backend** - Where data is stored (Firebase)
3. **Hosting** - Where the app lives online (Vercel)

---

## Step 1: Set Up Firebase (Backend Storage)

Firebase is where all your data will be stored securely. It's free for most use cases!

### 1.1 Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Create a project"**
3. Enter project name: `kids-schedule-app`
4. Click through the setup (accept defaults)
5. Wait for it to finish creating

### 1.2 Create a Web App in Firebase

1. In Firebase Console, click the **</> (Web icon)** to add a web app
2. App nickname: `kids-schedule-web`
3. Click **"Register app"**
4. You'll see a config object that looks like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "...",
  projectId: "...",
  ...
};
```
5. **SAVE THIS** - You'll need it in Step 3

### 1.3 Set Up Firestore Database

1. In Firebase Console, go to **"Firestore Database"** (left menu)
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select closest region to you
5. Click **"Enable"**

### 1.4 Set Up Authentication

1. Go to **"Authentication"** (left menu)
2. Click **"Get started"**
3. Click **"Email/Password"**
4. Toggle **"Enable"** to ON
5. Click **"Save"**

✅ **Firebase is ready!**

---

## Step 2: Prepare Your Code

### 2.1 Download the Code

All the files have been created for you in a folder called `outputs`

### 2.2 Get Ready for GitHub

To deploy to Vercel, we need to use GitHub (it's free and safe). This is the easiest way!

1. Create a FREE account at [GitHub.com](https://github.com) if you don't have one
2. Remember your username and password

### 2.3 Set Up GitHub Repository

1. Go to [GitHub.com/new](https://github.com/new)
2. Repository name: `kids-schedule-app`
3. Description: `A visual schedule app for children`
4. Choose **"Public"** (Vercel works best with this)
5. **DO NOT** check "Add README" or other options
6. Click **"Create repository"**

### 2.4 Upload Your Code to GitHub

You have two options:

**OPTION A: Using GitHub's Web Interface (Easiest)**
1. On your new GitHub repo page, click **"Add file" → "Upload files"**
2. Drag and drop all your files from the `outputs` folder
3. At the bottom, click **"Commit changes"**

**OPTION B: Using Git (If comfortable with command line)**
```bash
cd path/to/your/outputs/folder

git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/kids-schedule-app.git
git push -u origin main
```

✅ **Your code is now on GitHub!**

---

## Step 3: Connect Firebase to Your App

Edit the file `src/firebase.js` with your Firebase config:

1. Open `src/firebase.js` in a text editor
2. Replace the placeholder values with your Firebase config from Step 1.2
3. It should look like:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

4. Save the file
5. Upload the updated file to your GitHub repo

---

## Step 4: Deploy to Vercel (Make It Live!)

Vercel is completely free and will host your app. It automatically updates whenever you push code to GitHub.

### 4.1 Create Vercel Account

1. Go to [Vercel.com](https://vercel.com)
2. Click **"Sign up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access GitHub (you'll be prompted)

### 4.2 Deploy Your App

1. On Vercel dashboard, click **"New Project"**
2. You should see your `kids-schedule-app` repo
3. Click **"Import"** next to it
4. Keep default settings, click **"Deploy"**
5. Wait 2-3 minutes for deployment
6. When done, you'll see a **live URL** (looks like: `https://kids-schedule-app-xxxxxx.vercel.app`)
7. Click the URL to see your app live! 🎉

### 4.3 (Optional) Set Up Environment Variables

For extra security, add your Firebase config as environment variables:

1. In Vercel, go to **Project Settings → Environment Variables**
2. Add these variables (use your actual Firebase config values):
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
3. Re-deploy by going to Deployments → click the latest one → click "Redeploy"

---

## Step 5: Use Your App!

### 5.1 First Time Setup

1. Go to your live URL
2. Click **"Sign Up"**
3. Create your parent account with email and password
4. You're in!

### 5.2 Create Children

1. Click **"👨‍👩‍👧‍👦 Children"** tab
2. Click **"Add Child"**
3. Enter name, age group, pick avatar
4. Click **"Create Child Profile"**

### 5.3 Create Schedules

1. Click **"📅 Schedules"** tab
2. Select which child from dropdown
3. Click **"Add Schedule"**
4. Create schedule with tasks (name, time, type)
5. Click **"Create Schedule"**

### 5.4 Let Kids Use It

1. Share the URL with kids or open on their tablet
2. They click **"View"** next to their name
3. They see calendar, daily tasks, and task tracker
4. They tap tasks to mark complete
5. They earn points for completing tasks!

---

## Troubleshooting

### "I see a blank screen"
- Check your browser console (F12) for errors
- Make sure Firebase config is correct in `src/firebase.js`
- Try redeploying on Vercel

### "Firebase error - not initialized"
- Verify your `src/firebase.js` has correct config
- Make sure Firestore is enabled in Firebase Console
- Redeploy on Vercel after fixing

### "Can't sign up"
- Make sure you enabled Email/Password auth in Firebase
- Check Firebase → Authentication → Email/Password is toggled ON

### "My changes aren't showing"
- Push changes to GitHub
- Vercel will automatically redeploy
- Wait 1-2 minutes
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

---

## Features Overview

### For Parents:
- ✅ Create multiple child profiles with age groups
- ✅ Set up daily/weekly schedules
- ✅ Add tasks with times and types
- ✅ View child's points and progress
- ✅ Switch between children easily

### For Children:
- ✅ See today's tasks in colorful format
- ✅ Mark tasks complete with celebration animations
- ✅ Earn points for completing tasks
- ✅ View calendar
- ✅ Track overall progress
- ✅ Age-customized interface (graphics for young kids, text for older kids)

---

## Next Steps & Customization

Once deployed, you can:

1. **Customize colors**: Edit `src/styles/App.css` - look for `:root` section
2. **Add more emojis**: Edit `EMOJI_MAP` in `src/components/DailySchedule.jsx`
3. **Change task types**: Edit `TASK_TYPES` in `src/components/ScheduleManager.jsx`
4. **Add more avatars**: Edit `AVATARS` in `src/components/ChildManager.jsx`

For any of these, edit the file, push to GitHub, and Vercel redeploys automatically!

---

## Support Resources

- **Firebase Help**: https://firebase.google.com/docs
- **Vercel Help**: https://vercel.com/docs
- **GitHub Help**: https://docs.github.com

---

## Security Notes

- ✅ All data stored securely on Firebase
- ✅ Email/password authentication
- ✅ Test mode firestore (change to production when ready)
- ✅ Never share your Firebase config online
- ✅ Use strong passwords

---

Congratulations! Your app is live! 🎉

Share the link with family and let kids enjoy organized scheduling with rewards!
