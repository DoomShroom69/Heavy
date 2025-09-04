import { Client, GatewayIntentBits } from "discord.js";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

client.on("ready", () => {
  console.log(`✅ Heavy đã đăng nhập với tên: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith("!ask")) {
    const prompt = message.content.replace("!ask", "").trim();
    if (!prompt) {
      message.reply("❌ Hãy nhập câu hỏi sau `!ask`.");
      return;
    }

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      });

      message.reply(response.choices[0].message.content);
    } catch (error) {
      console.error("❌ Lỗi API:", error);
      message.reply("⚠️ Heavy gặp sự cố khi gọi API.");
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
