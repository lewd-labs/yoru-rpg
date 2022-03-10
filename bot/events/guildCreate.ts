import { Bot } from "../../bot.ts";
import { Guild } from "../../deps.ts";

Bot.events.guildCreate = (_, guild: Guild) => {
  Bot.log.info(`[EVENT=GuildCreate]: ${guild.name} with ${guild.memberCount} members.`);
};
