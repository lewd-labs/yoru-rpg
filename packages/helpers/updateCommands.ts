import { Bot } from "../../bot.ts";
import { log } from "../utils/log/logger.ts";
import { MakeRequired } from "https://deno.land/x/discordeno@13.0.0-rc20/types/util.ts";
import { EditGlobalApplicationCommand, upsertApplicationCommands } from "@deps";
import { DiscordenoGuild } from "https://deno.land/x/discordeno@13.0.0-rc20/transformers/guild.ts";

/**
 * Updates the command information in the discord api
 * @param scope The scope of the command | options are "global" or "guild"
 */
export async function updateApplicationCommands(scope?: "Guild" | "Global") {
  const globalCommands: MakeRequired<EditGlobalApplicationCommand, "name">[] = [];
  const perGuildCommands: MakeRequired<EditGlobalApplicationCommand, "name">[] = [];

  for (const command of Bot.commands.values()) {
    if (command.scope) {
      if (command.scope === "Guild") {
        perGuildCommands.push({
          name: command.name,
          description: command.description,
          type: command.type,
          options: command.options ? command.options : undefined,
        });
      } else if (command.scope === "Global") {
        globalCommands.push({
          name: command.name,
          description: command.description,
          type: command.type,
          options: command.options ? command.options : undefined,
        });
      } else {
        perGuildCommands.push({
          name: command.name,
          description: command.description,
          type: command.type,
          options: command.options ? command.options : undefined,
        });
      }
    }
  }
  if (globalCommands.length && (scope === "Global" || scope === undefined)) {
    log.info(
      "Updating Global Commands, this takes up to 1 hour to take effect...",
    );
    await Bot.helpers.upsertApplicationCommands(globalCommands).catch(
      log.error,
    );
  }

  if (perGuildCommands.length && (scope === "Guild" || scope === undefined)) {
    log.info(
      "Updating Guild Commands, this takes up to 1 minute to take effect...",
    );
    Bot.guilds.forEach((guild) => upsertApplicationCommands(Bot, perGuildCommands, guild.id));
  }
}

/** Update commands for a guild */
export async function updateGuildCommands(guild: DiscordenoGuild) {
  const perGuildCommands: MakeRequired<EditGlobalApplicationCommand, "name">[] = [];

  for (const command of Bot.commands.values()) {
    if (command.scope) {
      if (command.scope === "Guild") {
        perGuildCommands.push({
          name: command.name,
          description: command.description,
          type: command.type,
          options: command.options ? command.options : undefined,
        });
      }
    }
  }

  if (perGuildCommands.length) {
    await upsertApplicationCommands(Bot, perGuildCommands, guild.id);
  }
}
