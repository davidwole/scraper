import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";

dotenv.config();

// Replace 'YOUR_BOT_TOKEN' with the token you get from BotFather
const token = process.env.BOT_TOKEN;

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

// Store the group chat ID after the bot is added to the group
let groupChatId = -4625508947;

// Listen for any kind of message
bot.on("message", (msg) => {
  // If the message is from a group, store its chat ID
  if (msg.chat.type === "group" || msg.chat.type === "supergroup") {
    groupChatId = msg.chat.id;
    console.log(`Group chat ID stored: ${groupChatId}`);
  }
});

// Add a command that triggers the button
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  // Create an inline keyboard button
  const inlineKeyboard = {
    inline_keyboard: [
      [
        {
          text: "Click Me!",
          callback_data: "button_clicked",
        },
      ],
    ],
  };

  // Send message with the inline keyboard
  bot.sendMessage(chatId, "Welcome! Click the button below:", {
    reply_markup: inlineKeyboard,
  });
});

// Handle button clicks
bot.on("callback_query", (callbackQuery) => {
  const message = callbackQuery.message;
  bot
    .answerCallbackQuery(callbackQuery.id)
    .then(() => bot.sendMessage(message.chat.id, "Button clicked!"));
});

// Function to send message to the group
export function sendMessageToGroup(message) {
  if (!groupChatId) {
    console.log("No group chat ID stored. Add the bot to a group first.");
    return;
  }

  bot
    .sendMessage(groupChatId, message, { parse_mode: "Markdown" })
    .then(() => {
      console.log("Message sent successfully");
    })
    .catch((error) => {
      console.error("Error sending message:", error);
    });
}

// Error handling
bot.on("polling_error", (error) => {
  console.error("Polling error:", error);
});

export function stopBot() {
  bot.stopPolling();
  console.log("Bot polling stopped");
}
