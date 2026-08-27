-- Expected RLS behaviour for Lumira MVP.
-- Apply after migrations. Run as a privileged role, then test with anon JWT.

-- anon can read active catalog
--   select * from products;  -- only is_active = true
--   select * from offers;    -- only is_active = true joined to active products

-- anon cannot write catalog
--   insert/update/delete on products and offers must fail

-- anon cannot read or write orders
--   select/insert/update/delete on orders must fail

-- service_role / secret key bypasses RLS and is used only by Next.js server code.
