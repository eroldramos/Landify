# Landify 🏡

A full-stack real estate listings web application built with a **monorepo** structure.  
Includes a **React (Vite) frontend** and an **Express + Prisma + Supabase backend**.

---

## 📦 Tech Stack

**Frontend (`ui`)**

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Shadcn/UI Components

**Backend (`api`)**

- Node.js + Express
- Prisma ORM
- Supabase (PostgreSQL & Storage)
- JWT Authentication

**General**

- Monorepo managed with `npm` workspaces
- ESLint + Prettier formatting

---

## 🛠 Prerequisites

Before running locally, make sure you have:

- **Node.js** v20+
- **npm** v10+ (or pnpm/yarn if you prefer)
- **Supabase** account & project (for database and storage)
- **Git** installed

---

## 📂 Project Structure

```
Landify/
│
├── api/        # Backend API service
|    ├──        package.json
├── ui/         # Frontend React app
|    ├──        package.json
└── README.md
```

---

## ⚙️ Environment Variables

Create the following `.env` files:

**api/.env**

```env

DATABASE_URL="your supabase postgres, change into pooling url if will be deploy in serverless platform"

PORT="4000"
HOST="localhost"
JWT_SECRET="secret"

SUPABASE_URL="your supabase url"
SUPABASE_KEY="your supabase key"

SUPABASE_SERVICE_ROLE_KEY="your supabase admin key for storage transaction"


ALLOWED_HOSTS="localhost,127.0.0.1"
ALLOWED_ORIGINS="http://localhost,http://localhost:5173"

```

**ui/.env**

```env
VITE_LANDIFY_SERVER_URL = http://localhost:4000
```

---

## 🚀 Local Development Setup

1️⃣ **Clone the repository**

```bash
git clone https://github.com/eroldramos/Landify.git
cd Landify
```

2️⃣ **Install dependencies for api**

````bash
cd api
npm install

2️⃣ **Install dependencies for ui**

```bash
cd ui
npm install
````

````

3️⃣ **Set up the database**

```bash
cd api
npx prisma migrate dev
npx prisma generate
cd ..
````

4️⃣ **Run backend**

```bash
cd api
npm run dev
```

Backend will be running at **http://localhost:5000**

5️⃣ **Run frontend**

```bash
cd ui
npm run dev
```

Frontend will be running at **http://localhost:5173**

---

## 🧪 Useful Commands

| Command                                 | Description                     |
| --------------------------------------- | ------------------------------- |
| `npm install`                           | Install all dependencies (root) |
| `npm run dev` (per app)                 | Start dev server                |
| `npm run build` (per app)               | Build project                   |
| `npx prisma migrate dev` (backend only) | Mirgation to DB                 |
| `npx prisma generate` (backend only)    | Create prisma client locally    |

---

## 📜 License

MIT License © 2025 [Erold Ramos](https://github.com/eroldramos)
