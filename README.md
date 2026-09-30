# Realtime Chat App

A full-stack chat application with a group chatroom, private 1-to-1 messaging
(including to offline users), user accounts, live presence, and desktop
notifications — built with Socket.IO, Express, MongoDB, and vanilla JS.

## Features

- Group chatroom, visible to everyone
- Private messaging between two users — messages persist even if the
  recipient is offline, and load automatically the next time they open the chat
- Signup/login with hashed passwords (bcrypt) and JWT-based session auth
- Live online/offline status for every registered user, updated in real time
- Unread message badges per conversation
- Desktop notifications for new messages (click one to jump straight into
  that conversation)
- Typing indicator
- Fully responsive layout (phone / tablet / laptop / desktop)

## Tech stack

- **Backend:** Node.js, Express, Socket.IO, MongoDB (Mongoose), bcryptjs, jsonwebtoken
- **Frontend:** Plain HTML/CSS/JS — no framework, no build step

## Project structure

```
backend/
  server.js
  package.json
  routes/
    routes.js            # signup / login / users REST endpoints
  messge/
    messageschema.js      # chat message model
    userschema.js          # user account model
  config/
    db.js                  # MongoDB connection
frontend/
  login.html
  signup.html
  client.html              # the chat app itself
  client.css
  auth.css
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) running locally, **or** a free
  [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- [VS Code](https://code.visualstudio.com/) with the
  [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
  extension

## How to run it

**1. Install backend dependencies** (first time only)

```bash
cd backend
npm install
```

**2. Start the backend**

Open a terminal in the `backend` folder and run:

```bash
node server.js
```

You should see:
```
Server is live on 3000
```
Leave this terminal open — the server needs to keep running the whole time
you're using the app.

**3. Open the frontend**

In VS Code, go to the `frontend` folder. Right-click **`signup.html`**
(or **`login.html`** if you already have an account) → **"Open with Live
Server"**. It'll open in your browser at something like
`http://127.0.0.1:5500/frontend/signup.html`.

> ⚠️ **Don't just double-click the HTML file to open it.** That loads it as
> a `file://` URL, which breaks the API/socket calls due to CORS. It has to
> be served over `http://`, which is exactly what Live Server does.

**4. Sign up, then start chatting.**

To test private messaging or multiple accounts, open a second browser (or
an incognito window) and sign up a different account there — a single
browser can only be logged into one account at a time (same
`localStorage`).

**5. Allow notifications (optional but recommended)**

Click the **🔔 Enable notifications** button in the chat header once, and
accept the browser prompt, to get desktop notifications for new messages
when the tab isn't focused.

## Notes / known limitations

- `JWT_SECRET` is currently hardcoded in `routes/routes.js` for local
  development convenience. **Move this to an environment variable before
  deploying anywhere public.**
- The CORS allow-list in `server.js` (`allowedorigin`) is set for local
  development ports (`localhost`/`127.0.0.1` on `3000` and `5500`) — update
  it with your real frontend URL once deployed.
- The full contact list (used for offline messaging) refreshes on an
  interval, on tab focus, and instantly whenever a new user is detected
  online — not via a dedicated push event on signup.
- Desktop notifications only fire while the tab is open (even in the
  background) — there's no service worker/push setup, so a fully closed
  tab won't notify you.

## Possible next steps

- Deploy the backend (Render / Railway) and frontend (Netlify / Vercel) for
  a live public demo
- Photo/file sharing in messages
- Audio notifications
- Message delivery/read receipts
