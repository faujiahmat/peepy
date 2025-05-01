# Peepy

Peepy adalah aplikasi **To-Do List** sederhana yang dibangun menggunakan **Next.js**, **PostgreSQL**, dan **JWT Authentication**. Aplikasi ini memungkinkan pengguna untuk mencatat, mengelola, dan menyelesaikan tugas harian mereka dengan mudah dan aman.

## 🛠 Teknologi yang Digunakan

- Next.js
- PostgreSQL
- JSON Web Token (JWT)

## 🚀 Instalasi

1. **Clone repository ini:**

   ```bash
   git clone https://github.com/username/peepy.git
   cd peepy
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Environment variables:**

   Buat file `.env.local` atau `.env.production` (production) untuk menyimpan variabel lingkungan dan tambahkan konfigurasi berikut:

   ```bash
   DATABASE_URL=postgres://username:password@localhost:5432/peepy
   JWT_SECRET=your-secret-key
   JWT_EXPIRES_IN=7d
   NODE_ENV="development"
   ```

4. **Generate Prisma Client:**

   ```bash
   npx prisma generate
   ```

5. **Run development server:**

   ```bash
   npm run dev
   ```

6. **Run production build:**

   ```bash
   npm run build
   npm start
   ```

7. **Access the app:**

   ```bash
   http://localhost:3000
   ```
