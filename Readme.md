# 🎶 Event Management Platform (Concert Ticketing MVP)

A simple, clean, and responsive platform where event organizers can create, manage, and promote music events, while users can browse, register, and review events.

---

## ✨ Features

### 1. Event Discovery, Details, Creation, and Promotion (4 point)
- Landing page listing upcoming music events (Jazz, K-Pop, EDM, Rock, etc.)
- Search bar with debounce (500ms) and location/category filters
- Responsive design for mobile and desktop
- Event creation for organizers (title, price, start date, end date, available seats, description, promotions)
- Support for free and paid events
- Promotion system with voucher codes and discounts

### 2. Event Transactions (4 point)
- Checkout system for purchasing event tickets
- 6 Transaction statuses: `waiting_payment`, `waiting_confirmation`, `done`, `rejected`, `expired`, `canceled`
- Upload payment proof (image upload)
- 2-hour auto-expired transaction if no payment uploaded
- 3-day auto-cancel transaction if organizer does not confirm
- Automatic seat and voucher restoration after cancellation
- Point system: use points to reduce ticket price
- All transactions in IDR (Indonesian Rupiah)

### 3. Event Reviews and Ratings (2 point)
- Users can review events only after attending
- Organizer profile page showing all ratings and reviews

---

## 🏗 Tech Stack

| Layer | Stack |
|:---|:---|
| Frontend | Next.js (App Router), React 19, TailwindCSS, Axios, React-hot-toast |
| Backend | Express.js, TypeScript, Prisma ORM, Supabase PostgreSQL, Multer, Node-cron |
| Development Tools | Prettier, ESLint, Husky (optional setup) |

---

## 🛠 Folder Structure (Frontend)

# 📜 Frontend Directory Structure (Next.js App Router)

src/
├── app/
│   ├── page.tsx (Landing page)
│   ├── login/
│   ├── signup/
│   ├── create-event/
│   ├── dashboard/
│   ├── events/
│   │   ├── [id]/ (Event detail)
│   │   ├── [id]/edit/
│   │   ├── [id]/checkout/
│   ├── transactions/
│   │   ├── [id]/upload/ (Upload payment proof)
│   ├── organizers/[id]/ (Organizer profile + reviews)
├── components/ (All React components)
├── lib/ (Axios instance, auth utils)
├── hooks/ (Custom hooks like useDebounce)
├── types/ (TypeScript types and interfaces)
---

backend/
├── prisma/
│   ├── schema.prisma (Database schema)
│   ├── client.ts (Prisma client instance)
├── src/
│   ├── controllers/ (auth, event, transaction, review)
│   ├── middlewares/ (auth, upload)
│   ├── routes/ (Route definitions)
│   ├── services/ (Event, transaction logic)
│   ├── jobs/ (transaction-expire.job.ts)
│   ├── uploads/ (for payment proof images)
│   ├── index.ts (Express app entrypoint)

---
## 🔥 Important Backend Endpoints

| Method | Endpoint | Description |
|:------:|:--------:|:------------|
| `GET` | `/events` | List and filter events |
| `POST` | `/events` | Create a new event |
| `GET` | `/events/:id` | Get event detail |
| `POST` | `/transactions` | Create a new transaction |
| `PUT` | `/transactions/:id/upload-proof` | Upload payment proof |
| `PUT` | `/transactions/:id/confirm` | Organizer confirm/reject payment |
| `POST` | `/reviews` | Submit event review |
| `GET` | `/organizers/:id/reviews` | Fetch organizer's reviews and ratings |

---

## ✅ Project Completion Status

- [x] Landing Page
- [x] Browse Events
- [x] Filter Events
- [x] Search Bar
- [x] Event Creation
- [x] Checkout + Payment
- [x] Transaction Statuses
- [x] Auto Expire 2h + Auto Cancel 3d
- [x] Point Usage on Checkout
- [x] Reviews & Rating System
- [x] Organizer Profile + Review
- [x] Responsive + Mobile friendly

---

## 👨‍💻 Author

Built with love by [Your Name Here] ❤️
