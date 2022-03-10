import { Bot } from "../../bot.ts";

Bot.events.guildCreate = (_, guild) => {
  Bot.log.info(`[EVENT=GuildCreate]: ${guild.name} with ${guild.memberCount} members.`);
};
