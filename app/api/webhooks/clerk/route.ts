import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createOrUpdateUser } from "@/utils/db/action";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get the headers
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  // Return 400 error if svix headers are missing
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Error: Request could not be verified", {
      status: 400,
    });
  }

  // Get the request body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload/body with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification failed", { status: 400 });
  }

  // Save user to database & send welcome email
  if (evt.type === "user.created" || evt.type === "user.updated") {
    const { id, email_addresses, first_name, last_name } = evt.data;
    const email = email_addresses[0]?.email_address;
    const name = `${first_name || ""} ${last_name || ""}`.trim();

    if (email) {
      try {
        await createOrUpdateUser(id, email, name);
        return new Response("User created or updated", { status: 200 });
      } catch (err) {
        console.error("Error: Failed to create or update user:", err);
        return new Response("Error processing user data", {
          status: 500,
        });
      }
    }
  }

  // // Sample: Log payload to console
  // const { id } = evt.data; 
  // const eventType = evt.type;
  // console.log(
  //   `Received webhook with ID ${id} and event type of ${eventType}`,
  // );
  // console.log("Webhook payload:", body);

  // return new Response("Webhook received", { status: 200 });
}
