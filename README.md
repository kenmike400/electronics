# Jumia Kenya Electronics Shop

Next.js + Supabase ecommerce demo with:

- Product catalog (Supabase)
- Cart (localStorage)
- Checkout → records orders in Supabase
- M-Pesa / PayPlus placeholder (ready for STK push)

## Setup

1. **Supabase**  
   Run `supabase/schema.sql` in the SQL Editor.  
   This creates `products` + `orders` tables and seeds one sample TV.

2. **Environment variables** (Vercel / `.env.local`)  
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://icspfidiczxpiicpikvs.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```
   Never commit the service role key.

3. **Deploy**  
   Push to GitHub → Vercel auto-deploys.

## Local

```bash
npm install
npm run dev
```

## Payment

Checkout creates a `pending` order. Wire PayPlus / M-Pesa STK in `src/app/api/orders/route.ts` and update status on webhook.
