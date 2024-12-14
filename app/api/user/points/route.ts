import { NextResponse } from "next/server";
import { getUserPoints, updateUserPoints } from "@/utils/db/action";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const points = await getUserPoints(userId);
    return NextResponse.json({ points });
  } catch (error) {
    console.error("Error fetching user points:", error);
    return NextResponse.json(
      { error: "Failed to fetch points" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId, points } = await request.json();

    if (!userId || points === undefined || points > 0) {
      return NextResponse.json(
        { error: "Invalid user ID or points" },
        { status: 400 },
      );
    }

    // Check if the user has enough points
    const balance = await getUserPoints(userId);
    if (balance + points < 0) {
      return NextResponse.json(
        { error: "Insufficient points" },
        { status: 400 },
      );
    }

    const updatedUser = await updateUserPoints(userId, points);
    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating user points:", error);
    return NextResponse.json(
      { error: "Failed to update points" },
      { status: 500 },
    );
  }
}
