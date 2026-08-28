-- Run once in Supabase SQL Editor

create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  phone text,
  created_at timestamptz default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  price numeric(12,2) not null,
  compare_at_price numeric(12,2),
  image_url text,
  brand text,
  category text default 'Electronics',
  stock integer default 10,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_name text,
  customer_email text,
  customer_phone text,
  shipping_address text,
  total numeric(12,2) not null,
  status text default 'pending',
  payment_method text default 'mpesa',
  payment_ref text,
  items jsonb not null default '[]',
  profile_id uuid references profiles(id),
  created_at timestamptz default now()
);

alter table products enable row level security;
alter table orders enable row level security;
alter table profiles enable row level security;

drop policy if exists "Public read products" on products;
create policy "Public read products" on products for select using (active = true);

drop policy if exists "Service insert orders" on orders;
create policy "Service insert orders" on orders for insert with check (true);
drop policy if exists "Service read orders" on orders;
create policy "Service read orders" on orders for select using (true);

drop policy if exists "Public insert profiles" on profiles;
create policy "Public insert profiles" on profiles for insert with check (true);
drop policy if exists "Public read own profile" on profiles;
create policy "Public read own profile" on profiles for select using (true);

insert into products (name, slug, description, price, compare_at_price, image_url, brand, category, stock) values
('32 Inch QLED Smart TV Frameless Bluetooth', '32-inch-qled-smart-tv-frameless-bluetooth', '32" QLED Smart TV with frameless design, Bluetooth, and streaming apps.', 24999.00, 29999.00, '/images/tv-sample.jpg', 'Generic', 'TVs', 25),
('Baby Wipes 80pcs', 'baby-wipes-80pcs', 'Soft baby wipes 80pcs pack.', 166.00, 250.00, '/images/jumia-logo.png', 'Softcare', 'Baby Products', 50),
('220ml Capacity Cute Humidifier', '220ml-capacity-cute-humidifier', 'Cute 220ml humidifier for home or baby room.', 1299.00, 1899.00, '/images/jumia-logo.png', 'Generic', 'Home', 30),
('Hisense 43 Inch Smart TV', 'hisense-43-inch-smart-tv', 'Hisense 43" Smart LED TV with apps.', 32999.00, 39999.00, '/images/jumia-logo.png', 'Hisense', 'TVs', 12),
('USB Type-C Fast Charging Cable 1m', 'usb-type-c-fast-charging-cable-1m', 'Durable 1m USB-C fast charge cable.', 450.00, 799.00, '/images/jumia-logo.png', 'Generic', 'Mobile Accessories', 100),
('Water Dispenser Hot & Cold', 'water-dispenser-hot-cold', 'Hot and cold water dispenser for office or home.', 8999.00, 11999.00, '/images/jumia-logo.png', 'Generic', 'Appliances', 18),
('Bluetooth Soundbar 2.1', 'bluetooth-soundbar-21', '2.1 channel Bluetooth soundbar with subwoofer.', 7499.00, 9999.00, '/images/jumia-logo.png', 'Generic', 'Audio', 20),
('Diapers Size 3 - 48pcs', 'diapers-size-3-48pcs', 'Comfortable baby diapers size 3, pack of 48.', 1299.00, 1599.00, '/images/jumia-logo.png', 'Softcare', 'Baby Products', 40)
on conflict (slug) do nothing;
