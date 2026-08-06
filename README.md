# Thread-Clone

A Threads clone built with Next.js 14, MongoDB, Clerk, TailwindCSS, and UploadThing.

## Features

- Full stack Threads clone UI
- Authentication via Clerk
- Thread creation, comments, likes, views
- Admin control panel via `seed.js`
- PWA support (add to home screen on Android)

## Setup

1. Copy `.env.example` to `.env` and fill in your credentials
2. `npm install`
3. `npm run dev`

## Admin Script

Use `seed.js` to control likes, views, and comments:

```bash
node seed.js --list                  # List all threads
node seed.js --thread <id> --likes 50000 --views 1000000
node seed.js --thread <id> --comments 50
node seed.js --create --text "Hello world!"
```
