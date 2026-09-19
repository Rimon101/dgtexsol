"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionUser } from "@/actions/auth";
import { getSiteUrl } from "@/lib/seo";
import { revalidatePath } from "next/cache";

export interface OrderRecord {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  amount: number;
  currency: string;
  customer_name: string | null;
  customer_phone: string | null;
  status: "pending" | "completed" | "failed";
  trx_id: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderResult {
  success?: boolean;
  error?: string;
  checkoutUrl?: string;
}

/**
 * Generate a unique order tracking ID.
 */
function generateOrderId(): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

/**
 * Server Action: Create a pending order and return the Waitmark checkout URL.
 */
export async function createOrderAction(
  productId: string,
  customerName: string,
  customerPhone: string
): Promise<CreateOrderResult> {
  // Validate inputs
  if (!customerName || customerName.trim().length < 2) {
    return { error: "Please enter your name (at least 2 characters)." };
  }
  if (!customerPhone || customerPhone.trim().length < 6) {
    return { error: "Please enter a valid phone number." };
  }

  const publicKey = process.env.WAITMARK_PUBLIC_KEY;
  if (!publicKey) {
    return { error: "Payment gateway is not configured. Please contact the store owner." };
  }

  // Fetch the product details
  const supabase = await createClient();
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, name, price, is_active, is_sold_out")
    .eq("id", productId)
    .single();

  if (productError || !product) {
    return { error: "Product not found." };
  }

  if (!product.is_active) {
    return { error: "This product is no longer available." };
  }

  if (product.is_sold_out) {
    return { error: "This product is currently sold out." };
  }

  // Create the order record
  const orderId = generateOrderId();
  const siteUrl = getSiteUrl();
  const successUrl = `${siteUrl}/payment/success?order_id=${orderId}`;

  const { error: insertError } = await supabase.from("orders").insert({
    order_id: orderId,
    product_id: product.id,
    product_name: product.name,
    amount: product.price,
    currency: "BDT",
    customer_name: customerName.trim(),
    customer_phone: customerPhone.trim(),
    status: "pending",
  });

  if (insertError) {
    console.error("Error creating order:", insertError);
    return { error: "Failed to create order. Please try again." };
  }

  // Build the Waitmark checkout URL
  const checkoutParams = new URLSearchParams({
    public_key: publicKey,
    amount: product.price.toFixed(2),
    order_id: orderId,
    success_url: `${siteUrl}/api/payment/callback`,
  });

  const checkoutUrl = `https://pay.waitmark.com/checkout?${checkoutParams.toString()}`;

  return { success: true, checkoutUrl };
}

/**
 * Fetch a single order by its order_id (for success page).
 */
export async function getOrderByOrderId(orderId: string): Promise<OrderRecord | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_id", orderId)
    .single();

  if (error || !data) {
    return null;
  }

  return data as OrderRecord;
}

/**
 * Admin: Fetch all orders, newest first.
 */
export async function getOrders(): Promise<OrderRecord[]> {
  const user = await getSessionUser();
  if (!user) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }

  return (data as OrderRecord[]) ?? [];
}

/**
 * Admin: Get order statistics for the dashboard.
 */
export async function getOrderStats(): Promise<{
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  totalRevenue: number;
}> {
  const user = await getSessionUser();
  if (!user) {
    return { totalOrders: 0, completedOrders: 0, pendingOrders: 0, totalRevenue: 0 };
  }

  const supabase = await createClient();

  const { data: orders, error } = await supabase
    .from("orders")
    .select("status, amount");

  if (error || !orders) {
    return { totalOrders: 0, completedOrders: 0, pendingOrders: 0, totalRevenue: 0 };
  }

  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.status === "completed").length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const totalRevenue = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + Number(o.amount), 0);

  return { totalOrders, completedOrders, pendingOrders, totalRevenue };
}

/**
 * Admin: Update the order status in the webhook callback.
 * Uses the admin (service role) client to bypass RLS.
 */
export async function updateOrderFromWebhook(
  orderId: string,
  trxId: string,
  status: "completed" | "failed",
  paidAt: string | null
): Promise<{ success: boolean; error?: string }> {
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("orders")
    .update({
      status,
      trx_id: trxId,
      paid_at: paidAt,
    })
    .eq("order_id", orderId);

  if (error) {
    console.error("Error updating order from webhook:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/orders");
  revalidatePath("/admin/dashboard");

  return { success: true };
}

