
import type { WebhookEvent } from "@clerk/clerk-sdk-node";
import { httpRouter } from "convex/server";
import { Webhook } from "svix";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

const handleClerkWebhook = httpAction(async (ctx, request) => {
  const event = await validateRequest(request);
  if (!event) {
    return new Response("Invalid request", { status: 400 });
  }
  switch (event.type) {
    case "user.created":
      // Check if the user already exists
      const existingUser = await ctx.runQuery(internal.people.getPersonByUserId, {
        userId: event.data.id,
      });

      if (existingUser) {
        console.log(`User ${event.data.id} already exists, skipping creation.`);
        break;
      }

      // Create the new user
      await ctx.runMutation(internal.people.createPerson, {
        user_id: event.data.id,
        email: event.data.email_addresses[0]?.email_address ?? "No email",
        full_name: `${event.data.first_name ?? ''} ${event.data.last_name ?? ''}`.trim(),
        role: "student", // Default role for new users
        approval_status: "approved", // Auto-approve new users
      });
      break;
    case "user.updated":
      // Add logic here to update user data if needed
      console.log("User updated webhook received:", event.data);
      break;
    case "user.deleted":
      // Add logic here to handle user deletion if needed
      console.log("User deleted webhook received:", event.data);
      break;
    default: {
      console.log("Unhandled webhook event type:", event.type);
    }
  }
  return new Response(null, {
    status: 200,
  });
});

// The route for the webhook, ensure this matches the one in your Clerk dashboard
http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: handleClerkWebhook,
});

// Function to validate the incoming request
async function validateRequest(
  req: Request
): Promise<WebhookEvent | undefined> {
  // Get the secret from your Convex environment variables
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("CLERK_WEBHOOK_SECRET is not set in environment variables");
  }
  const payloadString = await req.text();
  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };
  const wh = new Webhook(webhookSecret);
  try {
    const event = wh.verify(payloadString, svixHeaders) as WebhookEvent;
    return event;
  } catch (error) {
    console.error("Error verifying Clerk webhook:", error);
    return undefined;
  }
}

export default http;

