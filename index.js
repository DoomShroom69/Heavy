import { Client, GatewayIntentBits } from "discord.js";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

// Tạo client Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,             // quản lý server
    GatewayIntentBits.GuildMessages,      // đọc tin nhắn
    GatewayIntentBits.MessageContent      // nội dung tin nhắn
  ],
});

// Tạo client OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Khi bot online
client.on("ready", () => {
  console.log(`✅ Bot đã đăng nhập với tên: ${client.user.tag}`);
});

// Lắng nghe tin nhắn
client.on("messageCreate", async (message) => {
  // Bỏ qua tin nhắn của bot khác
  if (message.author.bot) return;

  // Chỉ phản hồi khi có lệnh !ask
  if (message.content.startsWith("!ask")) {
    const prompt = message.content.replace("!ask", "").trim();

    if (!prompt) {
      message.reply("❌ Bạn cần nhập câu hỏi sau lệnh `!ask`.");
      return;
    }

    try {
      // Gửi prompt đến OpenAI
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", // model rẻ & nhanh
        messages: [{ role: "user", content: prompt }],
      });

      // Gửi câu trả lời vào Discord
      const reply = response.choices[0].message.content;
      message.reply(reply);
    } catch (error) {
      console.error("❌ Lỗi API:", error);
      message.reply("⚠️ Có lỗi xảy ra khi gọi API.");
    }
  }
});

// Đăng nhập bot bằng token
client.login(process.env.DISCORD_BOT_TOKEN);
