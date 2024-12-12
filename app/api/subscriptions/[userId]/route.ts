import { NextResponse } from "next/server";
import { getUserSubscription } from "@/utils/db/action";

export async function GET(
  request: Request,
  context: { params: { userId: string } }
) {
  try {
    const { userId } = await context.params;
    const subscription = await getUserSubscription(userId);
    
    return NextResponse.json({ subscription }, { status: 200 });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
} 