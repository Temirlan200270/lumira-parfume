alter table public.orders
  add column if not exists legal_accepted_at timestamptz,
  add column if not exists city text;

update public.orders
set legal_accepted_at = created_at
where legal_accepted_at is null;

alter table public.orders
  alter column legal_accepted_at set default now();

alter table public.orders
  alter column legal_accepted_at set not null;
