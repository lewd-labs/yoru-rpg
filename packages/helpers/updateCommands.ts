import { Bot } from "../../bot.ts";
import { log } from "../utils/log/logger.ts";
import { MakeRequired } from "https://deno.land/x/discordeno@13.0.0-rc20/types/util.ts";
import { EditGlobalApplicationCommand, upsertApplicationCommands } from "../../deps.ts";
import { DiscordenoGuild } from "https://deno.land/x/discordeno@13.0.0-rc20/transformers/guild.ts";
import { configs } from "../../configs.ts";

/**
 * Updates the command information in the discord api
 * @param scope The scope of the command | options are "global" or "guild"
 */
export async function updateApplicationCommands(scope?: "Guild" | "Global" | "Development") {
  const globalCommands: MakeRequired<EditGlobalApplicationCommand, "name">[] = [];
  const perGuildCommands: MakeRequired<EditGlobalApplicationCommand, "name">[] = [];
  const developmentCommands: MakeRequired<EditGlobalApplicationCommand, "name">[] = [];

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
      } else if (command.scope === "Development") {
        developmentCommands.push({
          name: command.name,
          description: command.description,
          type: command.type,
          options: command.options ? command.options : undefined,
        });
      }
    }
  }
  /**
   * Updates the global application commands
   */
  if (globalCommands.length && (scope === "Global" || scope === undefined)) {
    log.info(
      "Updating Global Commands, this takes up to 1 hour to take effect...",
    );
    log.info(`Commands added: ${globalCommands.join(", ")}`);
    await Bot.helpers.upsertApplicationCommands(globalCommands).catch(
      log.error,
    );
  }
  /**
   * Updates the guild application commands
   */
  if (perGuildCommands.length && (scope === "Guild" || scope === undefined)) {
    log.info(
      "Updating Guild Commands, this takes up to 1 minute to take effect...",
    );
    log.info(`Commands added: ${perGuildCommands.join(", ")}`);
     Bot.guilds.forEach((guild) => {
       upsertApplicationCommands(Bot, perGuildCommands, guild.id);
    });
  }

  /**
   * Update the development commands
   */
  if (developmentCommands.length && (scope === "Development" || scope === undefined)) {
    log.info(
      "Updating Development Commands, this takes up to 1 minute to take effect...",
    );
    log.info(`Commands added: ${developmentCommands.join(", ")}`);
    upsertApplicationCommands(Bot, developmentCommands, configs.devGuildId).catch(
      log.error,
    );
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
