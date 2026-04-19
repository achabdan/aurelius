# 💎 AURELIUS — Luxury Jewelry & Accessories E-Commerce

A complete, production-ready full-stack e-commerce platform for selling jewelry and accessories for men and women. Built with React + Vite, Node.js + Express, PostgreSQL + Prisma, and multi-language (EN/FR/ES) support.

---

## ✨ Features

- **Modern luxury UI** — Playfair Display typography, gold accents, Shopify-inspired design
- **Responsive** — Mobile-first, works beautifully on all screen sizes
- **Multi-language** — English, French, Spanish with react-i18next + language switcher
- **COD Checkout** — Cash on Delivery form (no payment gateway needed)
- **Cart** — Persistent cart with Zustand + localStorage
- **Admin Panel** — Secure JWT-protected dashboard with full CRUD
- **Product Management** — Add/edit/delete with image upload + multi-language names
- **Order Management** — View all orders, update statuses (Pending → Delivered)
- **Analytics Dashboard** — Order counts, revenue, status breakdown
- **Search & Filters** — By category, gender, price range + pagination
- **REST API** — Clean Express routes with Prisma ORM

---

## 🗂 Project Structure

```
aurelius/
├── frontend/                 # React + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/       # Navbar, Footer, Layout, AdminLayout
│   │   │   ├── product/      # ProductCard, ProductSkeleton
│   │   │   └── cart/         # CartDrawer
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProductsPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── ConfirmationPage.jsx
│   │   │   └── admin/
│   │   │       ├── AdminLogin.jsx
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminProducts.jsx
│   │   │       └── AdminOrders.jsx
│   │   ├── context/          # Zustand stores (cart, auth)
│   │   ├── i18n/             # i18next config + EN/FR/ES locales
│   │   └── utils/            # API client, helpers
│   └── ...config files
│
└── backend/                  # Node.js + Express
    ├── prisma/
    │   └── schema.prisma     # Database models
    ├── src/
    │   ├── index.js           # Server entry point
    │   ├── routes/
    │   │   ├── products.js   # GET/POST/PUT/DELETE /products
    │   │   ├── orders.js     # POST/GET /orders + analytics
    │   │   ├── admin.js      # POST /admin/login
    │   │   └── upload.js     # POST /upload/image
    │   ├── middleware/
    │   │   └── auth.js       # JWT middleware
    │   └── prisma/
    │       ├── client.js     # Prisma singleton
    │       └── seed.js       # Database seeder
    └── ...config files
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### 1. Clone & Install

```bash
git clone <repo-url>
cd aurelius
npm install         # root devDependencies (concurrently)
cd frontend && npm install
cd ../backend && npm install
```

### 2. Configure Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/aurelius_db"
JWT_SECRET="change-this-to-a-long-random-string"
FRONTEND_URL="http://localhost:5173"
ADMIN_EMAIL="admin@aurelius.com"
ADMIN_PASSWORD="Admin@123456"
```

### 3. Setup Database

```bash
cd backend
npx prisma generate           # Generate Prisma client
npx prisma migrate dev --name init   # Run migrations
node src/prisma/seed.js       # Seed admin + sample products
```

### 4. Run Development Servers

From the project root:
```bash
npm run dev
```

Or separately:
```bash
# Terminal 1 — Backend (port 5000)
cd backend && npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend && npm run dev
```

### 5. Access

| URL | Description |
|-----|-------------|
| http://localhost:5173 | Storefront |
| http://localhost:5173/admin | Admin Panel |
| http://localhost:5000/api | REST API |

**Default admin login:**
- Email: `admin@aurelius.com`
- Password: `Admin@123456`

---

## 🌐 API Reference

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/products | — | List products (filters: category, gender, price, search, page) |
| GET | /api/products/:id | — | Get single product |
| POST | /api/products | Admin | Create product |
| PUT | /api/products/:id | Admin | Update product |
| DELETE | /api/products/:id | Admin | Delete product |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/orders | — | Place order (COD) |
| GET | /api/orders | Admin | List all orders |
| GET | /api/orders/analytics | Admin | Dashboard stats |
| GET | /api/orders/:id | Admin | Get order details |
| PUT | /api/orders/:id/status | Admin | Update order status |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/admin/login | — | Login → JWT token |
| GET | /api/admin/me | Admin | Current admin info |

### Upload
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/upload/image | Admin | Upload product image |

---

## 📦 Database Models

```prisma
model Product {
  id              String    // UUID
  name            String    // Default name
  nameEn/Fr/Es    String    // Multi-language names
  description     String    // Default description
  descriptionEn/Fr/Es  String  // Multi-language descriptions
  price           Float
  images          String[]  // Array of image URLs
  category        Category  // RINGS, NECKLACES, BRACELETS, EARRINGS, WATCHES, BAGS, BELTS, SUNGLASSES
  gender          Gender    // MEN, WOMEN, UNISEX
  stock           Int
  featured        Boolean
}

model Order {
  id           String
  customerName String
  phone        String
  address      String
  city         String
  status       OrderStatus  // PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
  total        Float
  items        OrderItem[]
  notes        String?
}
```

---

## ☁️ Deployment

### Option A: Render (Recommended — Free Tier)

**Backend:**
1. Create a **Web Service** on [render.com](https://render.com)
2. Root directory: `backend`
3. Build command: `npm install && npx prisma generate && npx prisma migrate deploy`
4. Start command: `npm start`
5. Add environment variables (DATABASE_URL, JWT_SECRET, FRONTEND_URL)

**Frontend:**
1. Create a **Static Site** on Render
2. Root directory: `frontend`
3. Build command: `npm install && npm run build`
4. Publish directory: `dist`
5. Add env var: `VITE_API_URL=https://your-backend.onrender.com`

**Database:**
- Use Render's **PostgreSQL** add-on (free tier available)

---

### Option B: Vercel (Frontend) + Railway (Backend)

**Frontend → Vercel:**
```bash
cd frontend
npm run build
npx vercel --prod
```

**Backend → Railway:**
1. Connect your repo to [railway.app](https://railway.app)
2. Add PostgreSQL plugin
3. Set environment variables
4. Railway auto-deploys on push

---

### Option C: VPS (Ubuntu)

```bash
# Install Node 18 + PM2 + Nginx
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs nginx
sudo npm install -g pm2

# Clone & setup
git clone <repo> /var/www/aurelius
cd /var/www/aurelius
npm run install:all

# Build frontend
cd frontend && npm run build

# Setup backend
cd ../backend
cp .env.example .env  # Edit with production values
npx prisma migrate deploy
node src/prisma/seed.js

# Start with PM2
pm2 start src/index.js --name aurelius-api
pm2 startup && pm2 save

# Nginx config: proxy /api to :5000, serve dist/ for frontend
```

---

## 🔐 Security Notes

- Change `JWT_SECRET` to a long random string in production
- Change default admin password immediately after first login
- Set `FRONTEND_URL` to your actual domain to restrict CORS
- Consider adding rate limiting (express-rate-limit) for production
- Use HTTPS in production (Render/Vercel handle this automatically)

---

## 🌍 Adding a Language

1. Create `frontend/src/i18n/locales/de.json` (copy from `en.json`)
2. Import and register in `frontend/src/i18n/i18n.js`
3. Add to `LANGUAGES` array in `Navbar.jsx`

---

## 📝 License

MIT — Free to use for personal and commercial projects.

---

Built with ❤️ — AURELIUS Luxury E-Commerce
