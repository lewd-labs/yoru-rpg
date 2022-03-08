import { createCommand } from "../mod.ts";
import { ApplicationCommandTypes, InteractionResponseTypes } from "@deps";
import { snowflakeToTimestamp } from "@packages";

createCommand({
  name: "ping",
  description: "Ping the Bot!",
  type: ApplicationCommandTypes.ChatInput,
  devOnly: true,
  execute: async (Bot, interaction) => {
    const ping = Date.now() - snowflakeToTimestamp(interaction.id);
    await Bot.helpers.sendInteractionResponse(
      interaction.id,
      interaction.token,
      {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          content: `🏓 Pong! ${ping}ms`,
        },
      },
    );
  },
});
