const axios = require("axios");
const { CreatePlug } = require("../lib/commands");

CreatePlug({
  command: "deepseek",
  category: "Artficial",
  desc: "Chat with DeepSeek AI",
  execute: async (message, conn, match) => {
    if (!match) return await message.reply("_Please provide a message_");
    await message.react("⏳");
    await message.reply("_Thinking..._");
    let { data } = await axios
      .post("https://ai.clauodflare.workers.dev/chat", {
        model: "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",
        messages: [{ role: "user", content: match }],
      })
      .catch((e) => e.response);
       let voidi = data.data.response.split("</think>").pop().trim();
       await message.reply(voidi);
  }
});
