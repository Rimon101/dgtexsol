-- ==============================================================================
-- Migration: 005_add_customer_address_to_orders.sql
-- Description: Adds customer_address column to orders table for delivery details
-- ==============================================================================

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS customer_address TEXT;
