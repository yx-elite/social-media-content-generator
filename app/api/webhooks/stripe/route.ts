import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import {
  createOrUpdateUserSubscription,
  updateUserPoints,
} from "@/utils/db/action";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export async function POST(req: Request) {
  const body = await req.text();
  const headerList = await headers();
  const signature = headerList.get("Stripe-Signature") as string;

  // Return 400 error if signature is missing
  if (!signature) {
    console.error("Error: Missing Stripe signature");
    return new NextResponse("Missing Stripe signature", { status: 400 });
  }

  let evt: Stripe.Event;

  // Verify payload/body with headers
  try {
    evt = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    console.error("Error: Could not verify webhook:", err);
    return NextResponse.json(
      { error: "Verification failed", details: err.message },
      { status: 400 },
    );
  }

  // Save subscription to database
  if (evt.type === "checkout.session.completed") {
    const session = evt.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id;
    const subscriptionId = session.subscription as string;

    if (!userId || !subscriptionId) {
      console.error("Error: Missing userId or subscriptionId");
      return NextResponse.json(
        { error: "Invalid session data" },
        { status: 400 },
      );
    }

    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      if (!subscription.items.data.length) {
        console.error("Error: No subscription items found");
        return NextResponse.json(
          { error: "Invalid subscription data" },
          { status: 400 },
        );
      }

      const priceId = subscription.items.data[0].price.id;

      let plan: string = "free";
      let pointsToAdd: number = 0;

      switch (priceId) {
        case "price_1QV32wFdrnY8S7ejWhlnS0GT":
          plan = "basic";
          pointsToAdd = 100;
          break;
        case "price_1QV33UFdrnY8S7ej2WEbTMe3":
          plan = "pro";
          pointsToAdd = 500;
          break;
      }

      // Update subscription in database
      const updateSubscription = await createOrUpdateUserSubscription(
        userId,
        subscriptionId,
        plan,
        "active",
        new Date(subscription.current_period_start * 1000),
        new Date(subscription.current_period_end * 1000),
      );

      if (!updateSubscription) {
        console.error("Error: Failed to create or update subscription");
        return NextResponse.json(
          { error: "Failed to create or update subscription" },
          { status: 500 },
        );
      }

      // Add points to user based on priceId
      await updateUserPoints(userId, pointsToAdd);
      if (!updateUserPoints) {
        console.error("Error: Failed to update user points");
        return NextResponse.json(
          { error: "Failed to update user points" },
          { status: 500 },
        );
      }
    } catch (err: any) {
      console.error("Error: Failed to process subscription:", err);
      return NextResponse.json(
        { error: "Failed to process subscription", details: err.message },
        { status: 500 },
      );
    }
  }

  return NextResponse.json(
    { message: "Subscription processed" },
    { status: 200 },
  );
}
