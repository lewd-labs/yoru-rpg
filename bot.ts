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

// MAKE THE BASIC BOT OBJECT
const bot = createBot({
  token: configs.token,
  botId: configs.botId,
  intents: ["GuildMembers", "GuildMessages", "GuildWebhooks", "Guilds"],
  events: {},
});

// ENABLE ALL THE PLUGINS THAT WILL HELP MAKE IT EASIER TO CODE YOUR BOT
enableHelpersPlugin(bot);
enableCachePlugin(bot);
enableCacheSweepers(bot as BotWithCache);
enablePermissionsPlugin(bot as BotWithCache);

export interface BotClient extends BotWithCache<BotWithHelpersPlugin> {
  /**
   * The commands that the bot has loaded.
   * A custom cache to access the commands.
   */
  commands: Collection<string, ICommand>;
}

// THIS IS THE BOT YOU WANT TO USE EVERYWHERE IN YOUR CODE! IT HAS EVERYTHING BUILT INTO IT!
export const Bot = bot as BotClient;

/** The bots collections, addons, and custom helpers */
Bot.commands = new Collection();
