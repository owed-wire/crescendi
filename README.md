# 📅 Kids Schedule App

A beautiful, interactive schedule app designed for children of all ages to help them stay organized and engaged with their daily tasks.

## Features

### 👨‍👩‍👧‍👦 Parent Dashboard
- Create and manage multiple child profiles
- Set up daily/weekly schedules with custom tasks
- Track children's points and progress
- Manage tasks with times and types
- Switch between children easily
- Secure email/password authentication

### 👶 Child-Friendly Interface
- **Age-customized views** (graphics for young kids, text for older kids)
- **Daily task display** with big, colorful task cards
- **Calendar view** to see schedules at a glance
- **Task tracker** with progress visualization
- **Reward system** with points for task completion
- **Celebration animations** when tasks are completed
- **Sound effects** for positive reinforcement

### 🎨 Visual Features
- Colorful, engaging interface designed for children
- Emoji-based task icons
- Progress bars and statistics
- Smooth animations and transitions
- Responsive design (works on phones, tablets, computers)

### 🔒 Security & Data
- Firebase authentication
- Secure Firestore database
- Data encryption
- Account-based access

---

## Quick Start

### Prerequisites
- Node.js (v14 or higher) - [Download](https://nodejs.org)
- Firebase account (free) - [Create one](https://firebase.google.com)
- GitHub account (free) - [Create one](https://github.com)

### Option 1: Run Locally (Development)

1. **Clone or download this repo**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase config**
   - Copy `.env.example` to `.env.local`
   - Fill in your Firebase credentials
   - See `SETUP_GUIDE.md` for detailed instructions

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   - Go to `http://localhost:3000`

### Option 2: Deploy to Vercel (Production)

See `SETUP_GUIDE.md` for complete step-by-step deployment instructions.

**TL;DR:**
1. Push code to GitHub
2. Connect repo to Vercel
3. Add Firebase config as environment variables
4. Deploy!

---

## Project Structure

```
kids-schedule-app/
├── index.html              # Entry HTML file
├── src/
│   ├── main.jsx            # React entry point
│   ├── App.jsx             # Main app component
│   ├── firebase.js         # Firebase configuration
│   ├── components/
│   │   ├── AuthPage.jsx    # Login/signup
│   │   ├── ParentDashboard.jsx
│   │   ├── ChildInterface.jsx
│   │   ├── CalendarView.jsx
│   │   ├── DailySchedule.jsx
│   │   ├── TaskTracker.jsx
│   │   ├── ChildManager.jsx
│   │   └── ScheduleManager.jsx
│   └── styles/
│       └── App.css         # All styling
├── vite.config.js          # Build config
├── package.json            # Dependencies
├── SETUP_GUIDE.md          # Deployment instructions
└── README.md               # This file
```

---

## Customization

### Change Colors
Edit `src/styles/App.css` - modify the `:root` CSS variables at the top

### Add Task Types
Edit `TASK_TYPES` in `src/components/ScheduleManager.jsx`

### Change Emojis
Edit `EMOJI_MAP` in `src/components/DailySchedule.jsx`

### Add More Avatars
Edit `AVATARS` in `src/components/ChildManager.jsx`

---

## How It Works

### For Parents:
1. Sign up with email/password
2. Create child profiles (with age group)
3. Create schedules with daily tasks
4. Set task times and types
5. Share app link with devices in home
6. Monitor progress on dashboard

### For Children:
1. Parent creates account and schedules
2. Child opens app
3. Sees their name/avatar at top
4. Clicks on task to mark complete
5. Gets celebration animation + points
6. Earns rewards for completing tasks
7. Can view calendar and progress tracker

---

## Technology Stack

- **Frontend**: React 18, Vite
- **Backend**: Firebase (Authentication + Firestore)
- **Hosting**: Vercel
- **Styling**: CSS3 with animations
- **Version Control**: Git + GitHub

---

## Firebase Setup

### Create Database Structure
The app automatically creates these collections in Firestore:

**Collections:**
- `children` - Child profiles with age, avatar, points
- `schedules` - Daily/weekly schedules
- `tasks` - Individual tasks (time, type, completion status)

### Authentication
- Email/Password auth enabled
- Parent creates account
- Children share parent's account
- Each child has own profile

---

## Deployment

### Environment Variables Needed
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

### Build
```bash
npm run build
```

Output will be in `dist/` folder

---

## Browser Support

- Chrome/Chromium (all versions)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Troubleshooting

### Empty page / Won't load
- Check browser console (F12)
- Verify Firebase config in `.env.local`
- Make sure Firestore is created in Firebase Console

### Can't sign up
- Enable Email/Password auth in Firebase Console
- Check email format is valid
- Password must be 6+ characters

### Tasks don't save
- Verify Firestore database exists
- Check browser console for errors
- Ensure parent is authenticated

### Points not updating
- Hard refresh (Ctrl+Shift+R)
- Check Firebase rules allow updates
- Verify child profile has correct ID

---

## Performance

- Optimized for tablets and mobile devices
- Lazy loads components
- Optimized animations
- Firebase real-time updates

---

## Privacy & Security

- ✅ All data stored securely on Firebase
- ✅ HTTPS encryption in transit
- ✅ Test mode Firestore (restrict when live)
- ✅ No analytics or tracking
- ✅ No ads or external scripts
- ✅ Parent controls access

---

## Future Enhancements

Potential features to add:
- [ ] Recurring schedules (daily/weekly)
- [ ] Custom task images via AI image generation
- [ ] Sound notification options
- [ ] Reward shop / redemptions
- [ ] Parent notifications
- [ ] Multiple parent accounts per child
- [ ] Export/import schedules
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Time zone support

---

## License

This project is provided as-is for personal and family use.

---

## Support

For questions or issues:
1. Check `SETUP_GUIDE.md` for setup help
2. See Troubleshooting section above
3. Check Firebase Console for errors
4. Review browser console (F12)

---

## Credits

Built with ❤️ for families!

Features:
- React & Vite for fast development
- Firebase for reliable backend
- Vercel for easy deployment
- Icons from react-icons

---

**Ready to get started?** Follow the [SETUP_GUIDE.md](./SETUP_GUIDE.md) to deploy your app!
