import { configs } from "@configs";
import {
  BotWithCache,
  BotWithHelpersPlugin,
  Collection,
  createBot,
  enableCachePlugin,
  enableCacheSweepers,
  enableHelpersPlugin,
  enablePermissionsPlugin,
} from "./deps.ts";
import { ICommand } from "@interfaces";
import { log } from "@utils";
import { fileLoader, importDirectory } from "./packages/helpers/loader.ts";

log.info("Starting bot...");

/** Handles our modules to load with deno */
// Forces deno to read all the files which will fill the commands/inhibitors cache etc.
await Promise.all(
    [
        "./bot/commands",
        "./bot/events",
        // "./src/tasks",
    ].map((path: string) => importDirectory(Deno.realPathSync(path))),
);
await fileLoader();

// MAKE THE BASIC BOT OBJECT
export const bot = enableCachePlugin(
  createBot({
    token: configs.token,
    botId: configs.botId,
    intents: ["GuildMembers", "GuildMessages", "GuildWebhooks", "Guilds"],
    events: {},
  }),
);

// ENABLE ALL THE PLUGINS THAT WILL HELP MAKE IT EASIER TO CODE YOUR BOT
enableHelpersPlugin(bot);
enableCachePlugin(bot);
enableCacheSweepers(bot as BotWithCache);
enablePermissionsPlugin(bot as BotWithCache);

export interface BotClient extends BotWithCache<BotWithHelpersPlugin> {
  /**
   * The commands that the bot has loaded. A custom cache to access the commands.
   */
  commands: Collection<string, ICommand>;
}

// THIS IS THE BOT YOU WANT TO USE EVERYWHERE IN YOUR CODE! IT HAS EVERYTHING BUILT INTO IT!
export const Bot = bot as BotClient;

/** The bots collections, addons, and custom helpers */
Bot.commands = new Collection();
