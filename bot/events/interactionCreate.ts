import { log } from "@utils";
import { Bot } from "../../bot.ts";
import { InteractionTypes } from "https://deno.land/x/discordeno@13.0.0-rc20/types/interactions/interactionTypes.ts";
import slashLogWebhook from "../../packages/utils/slashWebhook.ts";

Bot.events.interactionCreate = async (_, interaction) => {
  if (!interaction.data) return;

  switch (interaction.type) {
    case InteractionTypes.ApplicationCommand:
      log.info(
        `[Application Command] ${interaction.data.name} command executed.`,
      );
      Bot.commands.get(interaction.data.name!)?.execute(Bot, interaction);
      await slashLogWebhook(_, interaction, interaction.data.name ?? "unknown");
      break;
  }
};
