import { db } from "@/utils/db";
import { Users } from "@/utils/db/schema";
import { eq } from "drizzle-orm";
import { sendWelcomeEmail } from "@/utils/mailtrap";

export async function createOrUpdateUser(
  clerkUserId: string,
  email: string,
  name: string,
) {
  try {
    const [existingUser] = await db
      .select()
      .from(Users)
      .where(eq(Users.stripeCustomerId, clerkUserId))
      .limit(1)
      .execute();

    if (existingUser) {
      const [updatedUser] = await db
        .update(Users)
        .set({ email, name })
        .where(eq(Users.stripeCustomerId, clerkUserId))
        .returning()
        .execute();
      console.log("Updated user", updatedUser);
      return updatedUser;
    }

    const [newUser] = await db
      .insert(Users)
      .values({ email, name, stripeCustomerId: clerkUserId, points: 150 })
      .returning()
      .execute();
    console.log("Created new user", newUser);

    // Send welcome email
    await sendWelcomeEmail(email, name);
    return newUser;
    
  } catch (err) {
    console.error("Error creating or updating user:", err);
    return null;
  }
}
