import { MailtrapClient } from "mailtrap";

let client: MailtrapClient;

export const initMailtrap = async () => {
  // typeof window === "undefined" ensures that code is executed on server not client
  if (typeof window === "undefined") {
    const { MailtrapClient } = await import("mailtrap");
    client = new MailtrapClient({
      token: process.env.MAILTRAP_TOKEN!,
    });
  }
};

export const sendWelcomeEmail = async (toEmail: string, name: string) => {
  if (typeof window !== "undefined") {
    console.error("Error: sendWelcomeEmail can only be called from the server");
    return null;
  }

  if (!client) {
    await initMailtrap();
  }

  const sender = {
    name: "[Development] SocialSpark",
    email: process.env.SENDER_EMAIL!,
  };

  await client.send({
    from: sender,
    to: [{ email: toEmail }],
    subject: "Welcome to SocialSpark!",
    html: `
      <h1>Welcome to SocialSpark!</h1>
      <p>Hi ${name}, welcome to SocialSpark!</p>
      <p>We're excited to have you on board. Get started by...</p>
    `,
  });
};
