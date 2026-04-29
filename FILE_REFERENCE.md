# File Reference Guide

This document explains what each file does in your Kids Schedule App.

## Root Files

### `package.json`
- Lists all dependencies (libraries) your app needs
- Contains npm scripts (dev, build)
- Do not edit unless adding new packages

### `vite.config.js`
- Configuration for the build tool (Vite)
- Tells React how to build the app
- Usually no changes needed

### `index.html`
- Main HTML file that loads the app
- Your browser loads this first
- Contains the `<div id="root">` where React mounts

### `README.md`
- Overview of the entire project
- Features, tech stack, how it works
- Good reference for understanding the app

### `SETUP_GUIDE.md`
- **Start here!** Complete deployment instructions
- Step-by-step for Firebase, GitHub, and Vercel
- Includes troubleshooting

### `.gitignore`
- Tells GitHub which files to ignore
- Keeps sensitive data off GitHub
- Ignores node_modules, .env files, etc.

### `.env.example`
- Template for environment variables
- Copy this to `.env.local` and fill in your Firebase config
- **Never commit .env.local to GitHub**

---

## `src/` Folder - Application Code

### `main.jsx`
- Entry point for React
- Mounts the app to index.html
- Imports and renders the App component

### `App.jsx`
- **Main app controller**
- Handles authentication state
- Routes between Parent Dashboard and Child Interface
- Manages login/logout

### `firebase.js`
- **Firebase configuration**
- You need to edit this with your Firebase credentials
- Initializes Firebase, Auth, and Firestore

---

## `src/components/` - Reusable Pieces

### `AuthPage.jsx`
- Login/signup screen
- Email/password forms
- User authentication
- Error handling

### `ParentDashboard.jsx`
- **Main parent interface**
- Manage children
- Create schedules
- View progress
- Switch to child view

### `ChildManager.jsx`
- Form for creating new children
- Age group selection
- Avatar picker
- Used by ParentDashboard

### `ScheduleManager.jsx`
- Form for creating schedules
- Add multiple tasks
- Set times and task types
- Task removal

### `ChildInterface.jsx`
- **Main child-facing interface**
- Handles view switching (daily/calendar/tasks)
- Loads schedules from Firebase
- Manages completed tasks
- Tracks points

### `DailySchedule.jsx`
- Shows today's tasks
- Large, colorful task cards
- Celebration animations on completion
- Age-aware display (graphics for young, text for old)

### `CalendarView.jsx`
- Monthly calendar display
- Navigate between months
- Show which days have schedules
- Visual task indicators

### `TaskTracker.jsx`
- Progress visualization
- Completion statistics
- Checklist-style task display
- Circular progress indicator

---

## `src/styles/` - Styling

### `App.css`
- **All styling for the entire app**
- CSS variables at top for easy customization
- Responsive design
- Animations and transitions
- Mobile-optimized

---

## Data Structure in Firebase

### Firestore Collections

#### `children`
```javascript
{
  id: "auto-generated",
  parentId: "parent@email.com",
  name: "Tommy",
  age: "4-6",
  avatar: "😊",
  points: 45,
  createdAt: "timestamp"
}
```

#### `schedules`
```javascript
{
  id: "auto-generated",
  childId: "child_id",
  parentId: "parent_id",
  name: "Morning Routine",
  description: "Get ready for school",
  tasks: [
    {
      id: "timestamp",
      title: "Brush teeth",
      time: "07:30",
      type: "Morning Routine",
      image: "brush teeth"
    },
    // ... more tasks
  ],
  createdAt: "timestamp"
}
```

---

## How Files Work Together

```
index.html
    ↓
main.jsx (loads App)
    ↓
App.jsx
    ├─→ AuthPage.jsx (not logged in)
    └─→ ParentDashboard.jsx (logged in, parent mode)
        ├─→ ChildManager.jsx (add child form)
        └─→ ScheduleManager.jsx (add schedule form)
    
    OR
    
    └─→ ChildInterface.jsx (logged in, child mode)
        ├─→ DailySchedule.jsx
        ├─→ CalendarView.jsx
        └─→ TaskTracker.jsx
```

---

## What to Edit

### To customize colors:
Edit `src/styles/App.css` (search for `:root`)

### To add/remove task types:
Edit `TASK_TYPES` in `src/components/ScheduleManager.jsx`

### To change emojis:
Edit `EMOJI_MAP` in `src/components/DailySchedule.jsx`

### To add more avatars:
Edit `AVATARS` in `src/components/ChildManager.jsx`

### To add Firebase config:
Edit `src/firebase.js` with your credentials

---

## What NOT to Edit (unless you know React)

- `src/main.jsx` - Entry point logic
- `src/App.jsx` - Complex state management
- Component logic files (unless adding features)
- Build configuration

---

## File Size Guide

```
package.json        ~1 KB   (dependencies list)
vite.config.js      ~0.2 KB (build config)
index.html          ~1 KB   (HTML template)
src/firebase.js     ~1 KB   (Firebase setup)
src/main.jsx        ~0.3 KB (Entry point)
src/App.jsx         ~3 KB   (Main controller)
src/components/
  AuthPage.jsx      ~2 KB   (Auth screen)
  ParentDashboard   ~5 KB   (Parent main)
  ChildInterface    ~4 KB   (Child main)
  ChildManager      ~2 KB   (Add child form)
  ScheduleManager   ~3 KB   (Add schedule form)
  DailySchedule     ~2 KB   (Daily view)
  CalendarView      ~2 KB   (Calendar view)
  TaskTracker       ~2 KB   (Task list)
src/styles/App.css  ~25 KB  (All styling)
```

Total: ~58 KB of code (very lightweight!)

---

## Common Edits

### Change the gradient background color
In `App.css`, find these lines:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```
Replace hex colors with your choice

### Change button colors
In `App.css`, find `:root` section:
```css
--primary-color: #667eea;
--secondary-color: #764ba2;
--success-color: #4CAF50;
```

### Change heading font size
In `App.css`, search for font-size and modify numbers

### Add new task type
In `ScheduleManager.jsx`, find:
```javascript
const TASK_TYPES = ['Morning Routine', 'Breakfast', ...]
```
Add your new type to the array

---

## Testing Locally

1. Have Node.js installed
2. In terminal: `cd path/to/outputs`
3. Run: `npm install`
4. Run: `npm run dev`
5. Browser opens to localhost:3000
6. Test signup, add child, create schedule

---

## Deploying Changes

After editing files:

1. Save changes
2. Commit to GitHub:
   ```bash
   git add .
   git commit -m "describe your changes"
   git push
   ```
3. Vercel automatically redeploys
4. Wait 1-2 minutes
5. Hard refresh in browser (Ctrl+Shift+R)
6. See your changes live!

---

## Need Help?

1. Read SETUP_GUIDE.md for setup issues
2. Check README.md for feature overview
3. Look at component files for how features work
4. Check browser console (F12) for errors
5. Review Firebase Console for data

---

That's it! You now understand your entire app! 🎉
