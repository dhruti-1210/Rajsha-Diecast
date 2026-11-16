# Rajsha Diecast

```
client/   Next.js 14 + TypeScript storefront (port 3001)
server/   Express + TypeScript API          (port 3000)
```

## Run
Terminal 1 — API
    cd server
    cp .env 
    # Edit .env and set DB_URL (and SMTP/OTP settings for email OTP login).
    npm install
    npm run dev

Terminal 2 — Website
    cd client && cp .env.local.example .env.local && npm install && npm run dev

## API
GET  /api/products?brand=&maxPrice=   GET /api/products/:id
GET  /api/brands                      GET /api/budgets
POST /api/orders      { items:[{id,qty}] }   -> saved to server/storage/orders.json
POST /api/newsletter  { email }              -> saved to server/storage/subscribers.json
GET  /api/health

Edit stock in server/src/products.ts. Put images in client/public/images/.
