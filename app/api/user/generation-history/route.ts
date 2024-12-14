import { NextResponse } from "next/server";
import {
  saveGeneratedContent,
  getUserGenerationHistory,
} from "@/utils/db/action";

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

    const history = await getUserGenerationHistory(userId);
    return NextResponse.json({ history });
  } catch (error) {
    console.error("Error fetching generation history:", error);
    return NextResponse.json(
      { error: "Failed to fetch generation history" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const { userId, content, prompt, contentType, imageData } =
      await req.json();

    if (!userId || !content || !prompt || !contentType) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const savedContent = await saveGeneratedContent(
      userId,
      content,
      prompt,
      contentType,
      imageData,
    );
    return NextResponse.json({ savedContent });
  } catch (error) {
    console.error("Error saving generation history:", error);
    return NextResponse.json(
      { error: "Failed to save generation history" },
      { status: 500 },
    );
  }
}
