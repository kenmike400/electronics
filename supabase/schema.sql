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
('Solarmax Maintenance Free Battery 80AH + Digital Solar Charge Controller', 'solarmax-80ah-battery-controller', 'Maintenance Free Battery 80AH Battery + Digital Solar Charge Controller. Official Store · Jumia Festival Deal.', 3999, 10000, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/70/3862723/1.jpg?7797', 'Solarmax', 'Electronics', 25),
('Itel TV 32 inch QLED Smart TV Frameless Bluetooth Android14', 'itel-32-qled-smart-tv', '32" QLED Smart TV, Frameless, Bluetooth, Android 14, Wifi, Netflix, YouTube, Prime. Jumia Express.', 17019, 20502, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/80/0139523/1.jpg?6818', 'Itel', 'Televisions', 12),
('JP Jamesport 10 Pieces Heavy Granite Non-Stick Cookware Set', 'jp-jamesport-10pc-cookware', '10 Pieces Heavy granite coated Non-Stick Cooking Pot Sufuria Set with glass lid.', 4989, 6990, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/70/3862723/1.jpg?7797', 'JP Jamesport', 'Cookware', 30),
('Oraimo CordForce Plus Corded Stick Vacuum 500W', 'oraimo-cordforce-plus-vacuum', 'CordForce Plus Corded Stick Vacuum 500W Motor. Official Store.', 8900, 11926, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/67/2126523/1.jpg?3147', 'Oraimo', 'Small Appliances', 18),
('Nunix 50x55cm Cooker 3 Gas + 1 Electric Hotplate + Gas Oven', 'nunix-50-55-cooker', '50 * 55cm Cooker - 3 Gas Burners, 1 Electric Hotplate + Gas Oven (1YR WRTY).', 14500, 23999, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/23/7778781/1.jpg?5735', 'Nunix', 'Cookers', 8),
('Hisense 55A6QKEN 55 Inch Smart 4K UHD Frameless', 'hisense-55a6qken-4k', '55 Inch Smart 4k UHD Frameless (2YRs WRTY).', 39999, 57000, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/47/4815513/1.jpg?5601', 'Hisense', 'Televisions', 6),
('TCL S5K 50 Inch Smart QLED Full HD Google TV', 'tcl-s5k-50-qled', 'S5K 50 Inch Smart QLED, Full HD Google TV - Black (1YR WRTY).', 34070, 100000, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/74/3823523/1.jpg?0835', 'TCL', 'Televisions', 7),
('Xiaomi 43 Full HD Frameless A Series 2025 Google TV', 'xiaomi-43-a-series-2025', '43" Full HD Frameless A Series 2025 Google Dolby Audio TV (1YR WRTY).', 24045, 44995, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/95/8830623/1.jpg?7021', 'XIAOMI', 'Televisions', 10),
('AILYONS FK-0319 Stainless Steel 1.8L Electric Kettle 1500W', 'ailyons-fk0319-kettle', 'Stainless Steel 1.8L Electric Water Kettle-1500W (1YR WRTY).', 959, 2099, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/19/8635703/1.jpg?2889', 'AILYONS', 'Small Appliances', 40),
('Redmi 15C By Xiaomi 8GB+256GB 6000mAh Black', 'redmi-15c-8-256-black', '15C By Xiaomi, 4G, 6.9", 8GB RAM + 256GB, 6000mAh, Black (25 Months Warranty).', 20840, 23000, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/87/4376723/1.jpg?6249', 'Redmi', 'Phones', 20),
('Apple iPhone 17 256GB White', 'apple-iphone-17-256-white', 'Official Store · Apple IPhone 17 256gb - White.', 121400, 135000, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/58/5540923/1.jpg?0243', 'Apple', 'Phones', 5),
('Apple iPhone 17 Pro Max 512GB Silver', 'apple-iphone-17-pro-max-512-silver', 'Official Store · IPhone 17 Pro Max 512GB Silver.', 207800, 224000, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/44/4640923/1.jpg?0686', 'Apple', 'Phones', 4),
('Vitron V54SB 2.1 Ch Multimedia Speaker System', 'vitron-v54sb-speakers', 'V54SB, 2.1 Ch Multimedia Speaker System AC/DC - Black (1YR WRTY).', 5618, 6999, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/26/3941623/1.jpg?9429', 'Vitron', 'Electronics', 15),
('USB Powered Remote Control 20-Color Sunset Lamp', 'sunset-lamp-20-color', 'USB Powered Remote Control 20-Color Sunset Lamp/Projector Night Light.', 489, 2010, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/59/9747523/1.jpg?6564', 'Generic', 'Lighting', 60),
('Baby Wipes 80pcs Softcare', 'baby-wipes-80pcs', 'Baby Wipes 80pcs available for delivery in Kenya.', 166, 250, '/images/jumia-logo.png', 'Softcare', 'Baby Products', 100),
('Pardini Kaluworks Shiny Mrembo Sufuria Set 4pc', 'pardini-mrembo-sufuria-4pc', 'Kaluworks Shiny Mrembo Sufuria Set 4pc (1.2–4L) with Lids.', 2600, 3500, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/44/2185723/1.jpg?4928', 'Pardini', 'Cookware', 28),
('Softcare Baby Wipes 80pcs', 'softcare-baby-wipes-80pcs', 'Softcare Baby Wipes 80pcs', 166.0, NULL, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/89/5555523/1.jpg?9802', 'Generic', 'Electronics', 30),
('  Charger Cables Fast 60W 3A  Type-C available for most mobile phones iphone 15/16/17 available for most mobile phones Huawei, Samsung, Transsion, Xiaomi, iphone,OPPO, Realme', 'charger-cables-fast-60w-3a-type-c-available-for-most-mobile-phones-iphone-15-16-', '  Charger Cables Fast 60W 3A  Type-C available for most mobile phones iphone 15/16/17 available for most mobile phones Huawei, Samsung, Transsion, Xiaomi, iphone,OPPO, Realme', 168.0, 469.0, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/89/5555523/1.jpg?9802', 'Generic', 'Electronics', 30),
('NUOSHI   Charger Cables Fast 60W 3A  Type-C available for most mobile phones iphone 15/16/17 available for most mobile phones Huawei, Samsung, Transsion, Xiaomi, iphone,OPPO, Realm', 'nuoshi-charger-cables-fast-60w-3a-type-c-available-for-most-mobile-phones-iphone', 'NUOSHI   Charger Cables Fast 60W 3A  Type-C available for most mobile phones iphone 15/16/17 available for most mobile phones Huawei, Samsung, Transsion, Xiaomi, iphone,OPPO, Realme', 168.0, NULL, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/89/5555523/1.jpg?9802', 'Generic', 'Electronics', 30),
('Aryuv Aryuv Baby Wipes - 80 pieces', 'aryuv-aryuv-baby-wipes-80-pieces', 'Aryuv Aryuv Baby Wipes - 80 pieces', 198.0, NULL, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/89/5555523/1.jpg?9802', 'Generic', 'Electronics', 30),
('Aryuv Baby Wipes - 80 pieces', 'aryuv-baby-wipes-80-pieces', 'Aryuv Baby Wipes - 80 pieces', 198.0, NULL, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/89/5555523/1.jpg?9802', 'Generic', 'Electronics', 25),
('4-in-1 USB-C & Lightning Mechanical Data Cable – Fast Charging & Data Sync for iPhone, Android, Laptop & Power Bank', '4-in-1-usb-c-lightning-mechanical-data-cable-fast-charging-data-sync-for-iphone-', '4-in-1 USB-C & Lightning Mechanical Data Cable – Fast Charging & Data Sync for iPhone, Android, Laptop & Power Bank', 204.0, 415.0, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/89/5555523/1.jpg?9802', 'Generic', 'Electronics', 30),
(' B100 Wired USB Mouse – Comfortable, Reliable, and Optical Mouse.', 'b100-wired-usb-mouse-comfortable-reliable-and-optical-mouse', ' B100 Wired USB Mouse – Comfortable, Reliable, and Optical Mouse.', 249.0, 555.0, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/89/5555523/1.jpg?9802', 'Generic', 'Electronics', 30),
('HP  B100 Wired USB Mouse – Comfortable, Reliable, and Optical Mouse.', 'hp-b100-wired-usb-mouse-comfortable-reliable-and-optical-mouse', 'HP  B100 Wired USB Mouse – Comfortable, Reliable, and Optical Mouse.', 249.0, NULL, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/89/5555523/1.jpg?9802', 'Generic', 'Electronics', 30),
('CordForce Plus Corded Stick Vacuum 500W Motor', 'cordforce-plus-corded-stick-vacuum-500w-motor-OR019HA6', 'CordForce Plus Corded Stick Vacuum 500W Motor', 58.99, NULL, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/89/5555523/1.jpg?9802', 'Oraimo', 'Vacuum Cleaners', 25),
('Redmi Note 15, 6.77" Curved Screen, 8GB RAM + 256GB, 6000mAh Battery, Black (25 Months Warranty) - B', 'redmi-note-15-6-77-curved-screen-8gb-ram-256gb-6000mah-battery-black-25-months-w-XI996MP6', 'Redmi Note 15, 6.77" Curved Screen, 8GB RAM + 256GB, 6000mAh Battery, Black (25 Months Warranty) - B', 198.17, NULL, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/89/5555523/1.jpg?9802', 'XIAOMI', 'Android Phones', 25),
('HP WIRED MOUSE X500', 'hp-wired-mouse-x500', 'HP WIRED MOUSE X500', 358.0, NULL, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/89/5555523/1.jpg?9802', 'Generic', 'Electronics', 30),
('Dual Charger Set with USB Cable - White', 'dual-charger-set-with-usb-cable-white', 'Dual Charger Set with USB Cable - White', 380.0, 795.0, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/89/5555523/1.jpg?9802', 'Generic', 'Electronics', 30),
('Rashnik Electric Water Dispenser Pump - Black', 'rashnik-electric-water-dispenser-pump-black', 'Rashnik Electric Water Dispenser Pump - Black', 387.0, NULL, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/89/5555523/1.jpg?9802', 'Generic', 'Electronics', 30),
('Dual Charging Cable 3 in 1 USB-A & Type-C to Micro USB/Type-C/Lightning Tangle-Free Charge 6A for Sumsung Iphone Tecno Xiaomi Charger Blue', 'dual-charging-cable-3-in-1-usb-a-type-c-to-micro-usb-type-c-lightning-tangle-fre', 'Dual Charging Cable 3 in 1 USB-A & Type-C to Micro USB/Type-C/Lightning Tangle-Free Charge 6A for Sumsung Iphone Tecno Xiaomi Charger Blue', 397.98, 1081.0, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/89/5555523/1.jpg?9802', 'Generic', 'Electronics', 30),
('20W Dual Port Fast Charger UK Plug USB-C PD + USB-A QC Foldable Plug（Cable Not Included）', '20w-dual-port-fast-charger-uk-plug-usb-c-pd-usb-a-qc-foldable-plug-cable-not-inc', '20W Dual Port Fast Charger UK Plug USB-C PD + USB-A QC Foldable Plug（Cable Not Included）', 402.0, 1124.0, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/89/5555523/1.jpg?9802', 'Generic', 'Electronics', 30),
('Baby Diapers – Medium - 44 Count', 'baby-diapers-medium-44-count', 'Baby Diapers – Medium - 44 Count', 472.0, 525.0, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/89/5555523/1.jpg?9802', 'Generic', 'Electronics', 30),
('24+5 DVI Male to VGA Female', '24-5-dvi-male-to-vga-female', '24+5 DVI Male to VGA Female', 499.0, 800.0, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/89/5555523/1.jpg?9802', 'Generic', 'Electronics', 30),
('Vision Plus Dual Fast Charger Set 20W With USB C Cable - White', 'vision-plus-dual-fast-charger-set-20w-with-usb-c-cable-white', 'Vision Plus Dual Fast Charger Set 20W With USB C Cable - White', 550.0, NULL, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/89/5555523/1.jpg?9802', 'Generic', 'Electronics', 30),
('120W USB C Plug 4-Port Fast Wall Charger+4 In 1 Super Fast Cable', '120w-usb-c-plug-4-port-fast-wall-charger-4-in-1-super-fast-cable', '120W USB C Plug 4-Port Fast Wall Charger+4 In 1 Super Fast Cable', 612.38, 1608.0, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/89/5555523/1.jpg?9802', 'Generic', 'Electronics', 30),
('GUEETON Fast Charge Powers Bank 20000mAh ', 'gueeton-fast-charge-powers-bank-20000mah', 'GUEETON Fast Charge Powers Bank 20000mAh ', 671.0, NULL, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/89/5555523/1.jpg?9802', 'Generic', 'Electronics', 30),
('Ultra-long battery life, full-screen digital display, sports noise-canceling neckband wireless Bluetooth headphones', 'ultra-long-battery-life-full-screen-digital-display-sports-noise-canceling-neckb', 'Ultra-long battery life, full-screen digital display, sports noise-canceling neckband wireless Bluetooth headphones', 683.4, 1340.0, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/89/5555523/1.jpg?9802', 'Generic', 'Electronics', 30),
('Original Super Fast 45W USB C Charger Adapter For Type C Devices', 'original-super-fast-45w-usb-c-charger-adapter-for-type-c-devices', 'Original Super Fast 45W USB C Charger Adapter For Type C Devices', 698.0, 898.0, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/89/5555523/1.jpg?9802', 'Generic', 'Electronics', 30),
('XY XY Brand 200W GaN Charger 3USB-A 2USB-C 5-Port Super Fast Charging Adapter Compatible with iPhone, Huawei, Xiaomi, Redmi, Tecno, Infinix, itel & more brands(black).', 'xy-xy-brand-200w-gan-charger-3usb-a-2usb-c-5-port-super-fast-charging-adapter-co', 'XY XY Brand 200W GaN Charger 3USB-A 2USB-C 5-Port Super Fast Charging Adapter Compatible with iPhone, Huawei, Xiaomi, Redmi, Tecno, Infinix, itel & more brands(black).', 699.48, NULL, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/89/5555523/1.jpg?9802', 'Generic', 'Electronics', 30),
('Pot and Pan Protectors, Set of 12 and 3 Different Size, Cookware Protector Set/Pots and Pans Dividers/Pans Separator Anti-Slip to Avoid Scratching or Marring When Stacking', 'pot-and-pan-protectors-set-of-12-and-3-different-size-cookware-protector-set-pot', 'Pot and Pan Protectors, Set of 12 and 3 Different Size, Cookware Protector Set/Pots and Pans Dividers/Pans Separator Anti-Slip to Avoid Scratching or Marring When Stacking', 754.0, 2143.0, 'https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/89/5555523/1.jpg?9802', 'Generic', 'Electronics', 30)
on conflict (slug) do nothing;

-- Reviews (run if not already applied)
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_slug text not null,
  author text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  title text,
  body text not null,
  verified boolean default false,
  helpful integer default 0,
  order_number text,
  created_at timestamptz default now()
);
create index if not exists reviews_slug_idx on reviews(product_slug);
alter table reviews enable row level security;
drop policy if exists "Public read reviews" on reviews;
create policy "Public read reviews" on reviews for select using (true);
drop policy if exists "Public insert reviews" on reviews;
create policy "Public insert reviews" on reviews for insert with check (true);

alter table orders add column if not exists payment_status text default 'pending';
alter table orders add column if not exists discount numeric(12,2) default 0;
alter table orders add column if not exists promo_code text;
alter table orders add column if not exists subtotal numeric(12,2);
alter table orders add column if not exists county text;
alter table orders add column if not exists sublocation text;
