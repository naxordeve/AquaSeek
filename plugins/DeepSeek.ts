import axios from "axios";
import { CreatePlug, getLang } from "../lib/index";

CreatePlug({
  command: "deepseek",
  category: "Artificial",
  desc: "Chat with DeepSeek AI",
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    const msgs = getLang();
    if (!match) return void (await message.reply(msgs.deepseek_msg));
    await message.react("✅");
    const { data } = await axios
      .post("https://ai.clauodflare.workers.dev/chat", {
        model: "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",
        messages: [{ role: "user", content: match }],
      })
      .catch((e) => e.response);
    const v = data?.data?.response?.split("</think>").pop()?.trim() || "_No response received_";
    return void (await message.reply(v));
  },
});
