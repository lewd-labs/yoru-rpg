import { log } from "@utils";
import { Bot } from "../../bot.ts";
import { ActivityTypes } from "@deps";

Bot.events.ready = (_, payload) => {
  log.info(`[READY] Shard ID ${payload.shardId} of ${Bot.gateway.maxShards} shards is ready!`);

  if (payload.shardId + 1 === Bot.gateway.maxShards) {
    botFullyReady();
  }
};

// This function lets you run custom code when all your bot's shards are online.
function botFullyReady() {
  // DO STUFF YOU WANT HERE ONCE BOT IS FULLY ONLINE.
  log.info("[READY] Bot is fully online.");

  Bot.gateway.presence = {
    status: "online",
    activities: [
      {
        name: "To Lofi Music",
        type: ActivityTypes.Listening,
        createdAt: Date.now(),
      },
    ],
  };
}
