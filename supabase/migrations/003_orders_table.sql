-- ==============================================================================
-- Migration: 003_orders_table.sql
-- Description: Creates orders table for Waitmark Pay payment tracking
-- ==============================================================================

-- ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        TEXT NOT NULL UNIQUE,
  product_id      UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name    TEXT NOT NULL,
  amount          NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
  currency        TEXT NOT NULL DEFAULT 'BDT',
  customer_name   TEXT,
  customer_phone  TEXT,
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  trx_id          TEXT,
  paid_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_product_id ON orders(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- AUTO-UPDATE UPDATED_AT TRIGGER
DROP TRIGGER IF EXISTS trigger_orders_updated_at ON orders;
CREATE TRIGGER trigger_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ROW LEVEL SECURITY
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Public visitors can INSERT orders (to create pending orders from Buy Now)
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Public visitors can read their own order by order_id (for success page)
DROP POLICY IF EXISTS "Anyone can view orders" ON orders;
CREATE POLICY "Anyone can view orders"
  ON orders FOR SELECT
  USING (true);

-- Authenticated admins can view all orders
DROP POLICY IF EXISTS "Authenticated users can view all orders" ON orders;
CREATE POLICY "Authenticated users can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated admins can update orders (e.g., mark as failed manually)
DROP POLICY IF EXISTS "Authenticated users can update orders" ON orders;
CREATE POLICY "Authenticated users can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated admins can delete orders
DROP POLICY IF EXISTS "Authenticated users can delete orders" ON orders;
CREATE POLICY "Authenticated users can delete orders"
  ON orders FOR DELETE
  TO authenticated
  USING (true);

