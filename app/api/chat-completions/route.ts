import { NextResponse } from "next/server";

const VISIONARY_API_KEY = process.env.VISIONARY_API_KEY;

export async function POST(req: Request) {
  const { prompt, contentType, imageData } = await req.json();

  let promptText = `Generate ${contentType} content about "${prompt}". Direct into the content field.`;
  let messagesContent: any[] | string = "";

  switch (contentType) {
    case "twitter":
    case "linkedin":
      if (contentType === "twitter") {
        promptText +=
          " Provide a thread of 5 tweets, each under 280 characters. Separate each tweet with 2 new lines (\n\n).";
      }
      messagesContent = promptText;
      break;

    case "instagram":
      promptText +=
        " Describe the image and incorporate it into the caption. The maximum generated word is 500 words";
      messagesContent = [
        {
          type: "text",
          text: promptText,
        },
        {
          type: "image_url",
          image_url: {
            url: imageData,
          },
        },
      ];
      break;
  }

  const response = await fetch(
    `${process.env.VISIONARY_API_URL}/v1/chat/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${VISIONARY_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: messagesContent,
          },
        ],
      }),
    },
  );

  const data = await response.json();
  return NextResponse.json(data);
}
