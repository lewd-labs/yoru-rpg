import { Config, configs } from "@configs";
import {
  BotWithCache,
  BotWithHelpersPlugin,
  Collection,
  createBot, DiscordenoMember,
  DiscordenoMessage,
  enableCachePlugin,
  enableCacheSweepers,
  enableHelpersPlugin,
  enablePermissionsPlugin,
} from "./deps.ts";
import { ICommand } from "@interfaces";
import { Language } from "./bot/languages/lang.ts";
import { log } from "@utils";
import { _runningTaskInterface, Task } from "./interfaces/bot/task.ts";
import { ButtonCollector, MessageCollector, ReactionCollector } from "./interfaces/bot/collectors.ts";
import { Monitor } from "./interfaces/bot/monitor.ts";

// MAKE THE BASIC BOT OBJECT
export const bot = enableCachePlugin(
  createBot({
    token: configs.token,
    botId: configs.botId,
    intents: ["GuildMessages", "Guilds"],
    events: {},
    applicationId: configs.applicationId,
  }),
);

// ENABLE ALL THE PLUGINS THAT WILL HELP MAKE IT EASIER TO CODE YOUR BOT
enableHelpersPlugin(bot);
enableCachePlugin(bot);
enableCacheSweepers(bot as BotWithCache);
enablePermissionsPlugin(bot as BotWithCache);

export interface BotClient extends BotWithCache<BotWithHelpersPlugin> {
  log: typeof log;
  configs: Config;
  /** Status of the bot */
  fullyReady: boolean;
  /** The bot commands and their data */
  commands: Collection<string, ICommand<any>>;
  /** The languages the bot is using */
  languages: Collection<string, Language>;
  /** Stores all guild prefixes for the bot. */
  prefixs: Collection<bigint, string>;
  /** Modules used for blocking bot events and function for an end user*/
  inhibitors: Collection<
    string,
    (
      message: DiscordenoMessage,
      command: ICommand<any>,
    ) => Promise<boolean> | boolean
  >;
  activeGuildIDs: Set<bigint>;
  dispatchedGuildIDs: Set<bigint>;
  dispatchedChannelIDs: Set<bigint>;
  messageCollectors: Collection<bigint, MessageCollector>;
  reactionCollectors: Collection<bigint, ReactionCollector>;
  buttonCollectors: Collection<bigint, ButtonCollector>;
  monitors: Collection<string, Monitor>;
  tasks: Collection<string, Task>;
  runningTask: _runningTaskInterface;
}

// The source of all magic!
export const Bot = bot as BotClient;

/** Init to all our interface bot values */
Bot.log = log;
Bot.commands = new Collection();
Bot.languages = new Collection();
Bot.fullyReady = false;
Bot.inhibitors = new Collection();
Bot.activeGuildIDs = new Set();
Bot.dispatchedGuildIDs = new Set();
Bot.dispatchedChannelIDs = new Set();
Bot.monitors = new Collection();
Bot.tasks = new Collection();
Bot.runningTask = { initialTimeouts: [] as number[], intervals: [] as number[] };
Bot.messageCollectors = new Collection();
Bot.reactionCollectors = new Collection();
Bot.buttonCollectors = new Collection();
Bot.prefixs = new Collection();
Bot.configs = configs;
