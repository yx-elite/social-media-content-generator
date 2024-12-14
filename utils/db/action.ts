import { db } from "@/utils/db";
import { Users, Subscriptions, GeneratedContent } from "@/utils/db/schema";
import { eq, sql, desc } from "drizzle-orm";
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

export async function createOrUpdateUserSubscription(
  userId: string,
  stripeSubscriptionId: string,
  plan: string,
  status: string,
  currentPeriodStart: Date,
  currentPeriodEnd: Date,
) {
  try {
    const [user] = await db
      .select({ id: Users.id })
      .from(Users)
      .where(eq(Users.stripeCustomerId, userId))
      .limit(1);

    if (!user) {
      console.error("Error: User not found with stripeCustomerId", userId);
      return null;
    }

    const existingSubscription = await db
      .select()
      .from(Subscriptions)
      .where(eq(Subscriptions.stripeSubscriptionId, stripeSubscriptionId))
      .limit(1);

    // If subscription exists, update it, otherwise create a new one
    let subscription;
    if (existingSubscription.length > 0) {
      [subscription] = await db
        .update(Subscriptions)
        .set({
          userId: user.id,
          stripeSubscriptionId,
          plan,
          status,
          currentPeriodStart,
          currentPeriodEnd,
        })
        .where(eq(Subscriptions.stripeSubscriptionId, stripeSubscriptionId))
        .returning()
        .execute();
    } else {
      [subscription] = await db
        .insert(Subscriptions)
        .values({
          userId: user.id,
          stripeSubscriptionId,
          plan,
          status,
          currentPeriodStart,
          currentPeriodEnd,
        })
        .returning()
        .execute();
    }
    return subscription;
  } catch (err) {
    console.error("Error creating or updating subscription:", err);
    return null;
  }
}

export async function getUserPoints(userId: string) {
  try {
    const [user] = await db
      .select({ points: Users.points, id: Users.id, email: Users.email })
      .from(Users)
      .where(eq(Users.stripeCustomerId, userId))
      .execute();
    return user?.points ?? 0;
  } catch (err) {
    console.error("Error: Failed to get user points:", err);
    return 0;
  }
}

export async function updateUserPoints(userId: string, points: number) {
  try {
    const [updatedUser] = await db
      .update(Users)
      .set({ points: sql`${Users.points} + ${points}` })
      .where(eq(Users.stripeCustomerId, userId))
      .returning()
      .execute();
    return updatedUser;
  } catch (err) {
    console.error("Error: Failed to update user points:", err);
    return null;
  }
}

export async function getUserSubscription(userId: string) {
  try {
    const [user] = await db
      .select()
      .from(Users)
      .where(eq(Users.stripeCustomerId, userId))
      .limit(1);

    if (!user) {
      return null;
    }

    const [subscription] = await db
      .select()
      .from(Subscriptions)
      .where(eq(Subscriptions.userId, user.id))
      .limit(1);

    return subscription;
  } catch (error) {
    console.error("Error: Failed to get user subscription:", error);
    return null;
  }
}

export async function saveGeneratedContent(
  userId: string,
  content: string[],
  prompt: string,
  contentType: string,
  imageData: string | null,
) {
  try {
    const [savedContent] = await db
      .insert(GeneratedContent)
      .values({
        userId: sql`(SELECT id FROM ${Users} WHERE stripe_customer_id = ${userId})`,
        content: content.join("\n\n"),
        prompt,
        contentType,
        imageData,
      })
      .returning()
      .execute();
    return savedContent;
  } catch (err) {
    console.error("Error: Failed to save generated content:", err);
    return null;
  }
}

export async function getUserGenerationHistory(
  userId: string,
  limit: number = 10,
) {
  try {
    const history = await db
      .select({
        id: GeneratedContent.id,
        content: GeneratedContent.content,
        prompt: GeneratedContent.prompt,
        contentType: GeneratedContent.contentType,
        imageData: GeneratedContent.imageData,
        createdAt: GeneratedContent.createdAt,
      })
      .from(GeneratedContent)
      .where(
        eq(
          GeneratedContent.userId,
          sql`(SELECT id FROM ${Users} WHERE stripe_customer_id = ${userId})`,
        ),
      )
      .orderBy(desc(GeneratedContent.createdAt))
      .limit(limit)
      .execute();
    return history;
  } catch (err) {
    console.error("Error: Failed to get user generation history:", err);
    return [];
  }
}
