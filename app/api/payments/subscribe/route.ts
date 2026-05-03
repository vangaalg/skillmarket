import { NextResponse } from "next/server";

// PHASE 2 — Stripe checkout session.
// Wire-up plan:
//   1. Read { tier, user_id } from body (Basic | Pro).
//   2. Look up the matching Stripe price ID from env.
//   3. stripe.checkout.sessions.create({ mode: "subscription", line_items, success_url, cancel_url, customer_email })
//   4. Return { url } for the client to redirect to.
//   5. A separate /api/payments/webhook route handles
//      checkout.session.completed → update users.subscription_status.
export async function POST() {
  return NextResponse.json(
    { error: "Not implemented", phase: 2 },
    { status: 501 },
  );
}
