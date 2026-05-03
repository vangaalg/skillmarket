import { NextResponse } from "next/server";

// PHASE 2 — Creator payout (70% creator / 30% platform).
// Plan:
//   1. Aggregate paid sessions per creator since last payout.
//   2. Compute creator_share = revenue * 0.7.
//   3. Use stripe.transfers.create or a connected-account
//      transfer to send funds to the creator's Stripe account.
//   4. Record the payout row + reset the rolling balance.
export async function POST() {
  return NextResponse.json(
    { error: "Not implemented", phase: 2 },
    { status: 501 },
  );
}
