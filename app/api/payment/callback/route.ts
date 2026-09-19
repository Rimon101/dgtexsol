import { NextRequest, NextResponse } from "next/server";
import { updateOrderFromWebhook } from "@/actions/orders";
import { timingSafeEqual } from "crypto";

/**
 * Waitmark Pay Webhook Callback Handler.
 *
 * Receives POST with JSON payload and X-Waitmark-Signature header.
 * Verifies the HMAC SHA256 signature, then updates the order in the database.
 */
export async function POST(request: NextRequest) {
  const secretKey = process.env.WAITMARK_SECRET_KEY;

  if (!secretKey) {
    console.error("WAITMARK_SECRET_KEY is not configured");
    return NextResponse.json(
      { error: "Payment gateway not configured" },
      { status: 500 }
    );
  }

  // 1. Get raw body and signature header
  const rawBody = await request.text();
  const signature = request.headers.get("x-waitmark-signature") ?? "";

  if (!signature) {
    return NextResponse.json(
      { error: "Missing signature header" },
      { status: 400 }
    );
  }

  // 2. Generate HMAC SHA256 Hash
  const crypto = await import("crypto");
  const expectedSignature = crypto
    .createHmac("sha256", secretKey)
    .update(rawBody)
    .digest("hex");

  // 3. Compare signatures using timing-safe comparison
  let isValid = false;
  try {
    const sigBuffer = Buffer.from(signature, "hex");
    const expectedBuffer = Buffer.from(expectedSignature, "hex");

    if (sigBuffer.length === expectedBuffer.length) {
      isValid = timingSafeEqual(sigBuffer, expectedBuffer);
    }
  } catch {
    isValid = false;
  }

  if (!isValid) {
    console.error("Webhook signature verification failed — potential spoofing attempt");
    return NextResponse.json(
      { error: "Unauthorized — invalid signature" },
      { status: 403 }
    );
  }

  // 4. Parse verified payload
  let payload: {
    order_id: string;
    trx_id: string;
    amount: string;
    currency: string;
    status: string;
    paid_at: string;
  };

  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  // 5. Process the payment result
  if (payload.status === "completed") {
    const result = await updateOrderFromWebhook(
      payload.order_id,
      payload.trx_id,
      "completed",
      payload.paid_at || null
    );

    if (!result.success) {
      console.error("Failed to update order:", result.error);
      return NextResponse.json(
        { error: "Failed to process payment" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "OK" }, { status: 200 });
  }

  // Handle other statuses (failed, etc.)
  if (payload.status === "failed") {
    await updateOrderFromWebhook(
      payload.order_id,
      payload.trx_id || "",
      "failed",
      null
    );
  }

  return NextResponse.json({ message: "OK" }, { status: 200 });
}

/**
 * Waitmark also redirects the user's browser via GET to the success_url.
 * Redirect them to the payment success page.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("order_id") ?? "";

  // Redirect user to the success page
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return NextResponse.redirect(
    `${siteUrl}/payment/success?order_id=${orderId}`
  );
}

