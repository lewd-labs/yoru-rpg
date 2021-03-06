import { Bot, DiscordenoInteraction } from "@deps";
import { getUserTag } from "./helpers.ts";
import { Embeds } from "../builders/mod.ts";
import { log } from "./log/logger.ts";

export async function slashLogWebhook(
  bot: Bot,
  payload: DiscordenoInteraction,
  name: string,
) {
  const webhook = Deno.env.get("DISCORD_LOGS_WEBHOOK");
  if (!webhook) return;

  const [id, token] = webhook.substring(webhook.indexOf("webhooks/") + 9).split(
    "/",
  );

  const embeds = new Embeds(bot)
    .setAuthor(`${getUserTag(payload.user)} used ${name}`, payload.user)
    .addField(
      "Channel",
      payload.channelId?.toString() || "Channel ID unavailable",
      true,
    )
    .addField(
      "Guild",
      payload.guildId?.toString() || "Guild ID unavailable",
      true,
    ).setTimestamp();

  try {
    await bot.helpers
      .sendWebhook(bot.transformers.snowflake(id), token, {
        embeds,
        wait: false,
      });
  } catch (e) {
    log.error(e);
  }
}

export default slashLogWebhook;
