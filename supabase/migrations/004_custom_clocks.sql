-- ==============================================================================
-- Migration: 004_custom_clocks.sql
-- Description: Creates custom_clocks table for showcase gallery with WhatsApp ordering
-- ==============================================================================

-- 1. CUSTOM CLOCKS TABLE
CREATE TABLE IF NOT EXISTS custom_clocks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url   TEXT NOT NULL,
  title       TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_custom_clocks_active ON custom_clocks(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_custom_clocks_sort ON custom_clocks(sort_order ASC, created_at DESC);

-- 3. AUTO-UPDATE UPDATED_AT TRIGGER
DROP TRIGGER IF EXISTS trigger_custom_clocks_updated_at ON custom_clocks;
CREATE TRIGGER trigger_custom_clocks_updated_at
  BEFORE UPDATE ON custom_clocks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 4. ROW LEVEL SECURITY (RLS)
ALTER TABLE custom_clocks ENABLE ROW LEVEL SECURITY;

-- Public visitors can only view active clocks
DROP POLICY IF EXISTS "Active custom clocks are viewable by everyone" ON custom_clocks;
CREATE POLICY "Active custom clocks are viewable by everyone"
  ON custom_clocks FOR SELECT
  USING (is_active = true);

-- Authenticated admins can view all custom clocks
DROP POLICY IF EXISTS "Authenticated users can view all custom clocks" ON custom_clocks;
CREATE POLICY "Authenticated users can view all custom clocks"
  ON custom_clocks FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated admins can insert custom clocks
DROP POLICY IF EXISTS "Authenticated users can insert custom clocks" ON custom_clocks;
CREATE POLICY "Authenticated users can insert custom clocks"
  ON custom_clocks FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated admins can update custom clocks
DROP POLICY IF EXISTS "Authenticated users can update custom clocks" ON custom_clocks;
CREATE POLICY "Authenticated users can update custom clocks"
  ON custom_clocks FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated admins can delete custom clocks
DROP POLICY IF EXISTS "Authenticated users can delete custom clocks" ON custom_clocks;
CREATE POLICY "Authenticated users can delete custom clocks"
  ON custom_clocks FOR DELETE
  TO authenticated
  USING (true);

