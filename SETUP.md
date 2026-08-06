# Threads Clone — Setup Guide

## What you're getting
- A Next.js web app that **looks and feels like the Threads Android app** on your phone
- Full control over **likes, views, comments** via a simple admin script
- Zero cost — everything used is free tier

---

## Step 1 —Start a free MongoDB Atlas cluster

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up (free)
3. Create a **free shared cluster** (M0 tier)
4. Create a database user (username + password)
5. Click **"Connect"** → **"Connect your application"**
6. Copy the connection string — it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. Replace `<username>` and `<password>` with your actual credentials

---

## Step 2 —Start a free Clerk account (for auth)

1. Go to [clerk.com](https://clerk.com)
2. Sign up (free)
3. Create a new application
4. Go to **API Keys** in the dashboard
5. Copy:
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

---

## Step 3 —Configure environment variables

In the project root (`/home/user/threads-clone`), create a `.env` file:

```env
MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
UPLOADTHING_SECRET=...
UPLOADTHING_APP_ID=...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
```

> **Minimum required for the app to run:** `MONGODB_URL` and the two Clerk keys.
> UploadThing is only needed if you want image uploads — skip it for now if you just want text threads.

---

## Step 4 —Install & run locally

```bash
cd /home/user/threads-clone
npm install
npm run dev
```

Then open **http://localhost:3000** in your browser.

> You'll need to sign up via Clerk first (the app redirects to onboarding after sign-up).

---

## Step 5 —Use the admin script to control likes/views/comments

The `seed.js` script lets you control everything. Here are the commands:

### List all threads
```bash
node seed.js --list
```

### Set likes and views on a thread
```bash
node seed.js --thread <THREAD_ID> --likes 99999 --views 500000
```

### Add fake comments to a thread
```bash
node seed.js --thread <THREAD_ID> --comments 50
```

### Create a new thread
```bash
node seed.js --create --text "This is my first controlled thread!"
```

### Reset everything
```bash
node seed.js --reset
```

### Get help
```bash
node seed.js --help
```

> **Note:** The thread ID comes from the URL when you view a thread, or from the `--list` command output.

---

## Step 6 —Make it feel like an Android app (PWA)

### On your phone (Chrome on Android):

1. Open your deployed app URL (or localhost if testing locally)
2. Tap the **three-dot menu** (top right)
3. Tap **"Add to Home screen"** (or "Install app")
4. Give it a name like "Threads"
5. It will appear on your home screen like a real app
6. When you open it, it launches **full-screen with no browser UI**

### What makes this work:
- `manifest.json` — tells Android it's an installable app
- `display: "standalone"` — hides browser chrome
- App icons in `/public/icons/`

---

## Step 7 —Deploy to Vercel (free, optional)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add new project**
3. Import your repo
4. Add the same env variables from Step 3
5. Click **Deploy**

Your app will be live at `https://your-project.vercel.app` — accessible from any phone.

---

## Project structure (what we changed)

```
threads-clone/
├── app/
│   ├── (root)/
│   │   ├── layout.tsx          ← Added PWA manifest + icons metadata
│   │   ├── page.tsx            ← Now passes likes/views to ThreadCard
│   │   └── thread/[id]/page.tsx ← Now passes likes/views to ThreadCard
│   └── ...
├── components/
│   └── cards/
│       └── ThreadCard.tsx      ← Now shows like count + view count
├── lib/
│   ├── models/
│   │   └── thread.model.ts     ← Added likes & views fields
│   └── actions/
│       └── like.actions.ts     ← Placeholder for future like logic
├── public/
│   ├── icons/
│   │   ├── icon-192.png        ← PWA icon (192x192)
│   │   └── icon-512.png        ← PWA icon (512x512)
│   └── manifest.json           ← PWA manifest
├── seed.js                     ← Admin script — your control panel
└── .env                        ← Your secrets (create this)
```

---

## FAQ

**Q: Do I need Android Studio?**  
A: No. This is entirely browser-based. The PWA makes it feel like an app on your phone.

**Q: Can I really set likes to any number?**  
A: Yes. The `seed.js` script writes directly to MongoDB. No limits, no validation on the admin side.

**Q: What about image uploads?**  
A: The app supports them via UploadThing, but you need to set up an UploadThing account (free tier available). For now you can skip it and just post text threads.

**Q: Will push notifications work?**  
A: Not out of the box for the web app. That requires Firebase Cloud Messaging integration. You can add it later if needed.

**Q: Is this really free?**  
A: Yes. MongoDB Atlas (free tier), Clerk (free tier), Vercel (free tier), Node.js (free), everything here is $0.
