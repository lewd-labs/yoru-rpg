import { log } from "@utils";
import { Bot } from "../../bot.ts";
import { ActivityTypes } from "../../deps.ts";
import { sweepInactiveGuildsCache } from "./dispatch.ts";
import { Milliseconds } from "../../packages/utils/helpers.ts";
import { updateApplicationCommands } from "../../packages/helpers/updateCommands.ts";

Bot.events.ready = (_, payload) => {
  log.info(`[READY] Shard ID ${payload.shardId} of ${Bot.gateway.maxShards} shards is ready!`);

  if (payload.shardId + 1 === Bot.gateway.maxShards) {
    botFullyReady();
  }
};

// This function lets you run custom code when all your bots shards are online.
async function botFullyReady() {
  // log.info(`Loaded ${bot.arguments.size} Argument(s)`);
  log.info(`Loaded ${Bot.commands.size} Command(s)`);
  log.info(`Loaded ${Object.keys(Bot.events).length} Event(s)`);
  log.info(`Loaded ${Bot.inhibitors.size} Inhibitor(s)`);
  // log.info(`Loaded ${Bot.monitors.size} Monitor(s)`);
  // log.info(`Loaded ${Bot.tasks.size} Task(s)`);

  // Special task which should only run every hour AFTER STARTUP
  setInterval(sweepInactiveGuildsCache, Milliseconds.Hour);

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

  // UPDATES YOUR COMMANDS TO LATEST COMMANDS
  await updateApplicationCommands();

  log.info(`[READY] Bot is online and ready in ${Bot.guilds.size} guild(s)!`);

  // Set bots activity for other functions
  Bot.fullyReady = true;
}
