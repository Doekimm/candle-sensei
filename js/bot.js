const TelegramBot = require("node-telegram-bot-api");

// Replace with your Bot Token from BotFather
const token = "8576267063:AAF9V3VoLKk977t3STGKH32Gg_XWyupbv-w";
const bot = new TelegramBot(token, { polling: true });

console.log("Candle Sensei Bot is running...");

// When user sends any message
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text.toLowerCase();

  if (text.includes("order") || text.includes("new order")) {
    bot.sendMessage(
      chatId,
      "✅ Order received!\n\n" +
        "Please choose your payment method:\n\n" +
        "1️⃣ M-Pesa\n" +
        "2️⃣ PayPal\n" +
        "3️⃣ Bank Transfer\n\n" +
        "Reply with the number (1, 2 or 3)",
    );
  } else if (text === "1" || text === "2" || text === "3") {
    let method = "";
    if (text === "1") method = "M-Pesa";
    else if (text === "2") method = "PayPal";
    else if (text === "3") method = "Bank Transfer";

    bot.sendMessage(
      chatId,
      `You chose: ${method}\n\n` +
        `Please send your payment proof to this chat.\n` +
        `Once I confirm payment, I will send your files immediately.`,
    );
  } else {
    bot.sendMessage(
      chatId,
      "Hello! Send me your order and I will help you with payment.",
    );
  }
});

console.log("Bot is ready and listening for orders.");
