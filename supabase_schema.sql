-- Database Schema for Compro

-- 1. Profiles Table (Extends Supabase Auth)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  email text,
  full_name text,
  compro_id text unique,
  coins integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Orders Table
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  brand text not null,      -- e.g., 'Amazon', 'Zomato'
  item_name text not null,  -- e.g., 'Sony Headphones'
  price text not null,      -- e.g., '₹24,999' (Storing as text for flexibility or use numeric)
  status text check (status in ('processed', 'shipped', 'out-for-delivery', 'delivered')) default 'processed',
  logo_bg text,             -- Tailwind class for UI
  logo_text text,           -- Tailwind class for UI
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.orders enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

create policy "Users can view own orders." on public.orders for select using (auth.uid() = user_id);
create policy "Users can insert own orders." on public.orders for insert with check (auth.uid() = user_id);

-- 4. Realtime Setup
-- Enable realtime for orders table to support Smart Inbox updates
alter publication supabase_realtime add table public.orders;
