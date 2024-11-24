import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const webhookUrl = process.env.DISCORD_WEBHOOK;

export async function sendDiscordMessage(message) {
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message }),
    });
    if (response.ok) {
      console.log("Message sent successfully");
    } else {
      console.error(
        "Failed to send message:",
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error("Error sending message:", error.message);
  }
}
