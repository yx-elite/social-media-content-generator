import { MailtrapClient } from "mailtrap";

const TOKEN = "xxxxxx";
const SENDER_EMAIL = "test@demomailtrap.com";
const RECIPIENT_EMAIL = "xxxxxx@gmail.com";

if (!TOKEN || !SENDER_EMAIL || !RECIPIENT_EMAIL) {
  throw new Error("Error: Missing environment variables");
}

const client = new MailtrapClient({ token: TOKEN });

const sender = {
  name: "Mailtrap Test",
  email: SENDER_EMAIL,
};

client
  .send({
    from: sender,
    to: [{ email: RECIPIENT_EMAIL }],
    subject: "[Development] This is a test email from Mailtrap",
    text: "This is the body of the email.",
  })
  .then(console.log)
  .catch(console.error);
