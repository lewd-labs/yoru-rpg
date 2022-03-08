import { configs } from "../../configs.ts";
import { Bot } from "../../bot.ts";
import { log } from "../utils/log/logger.ts";
import { MakeRequired } from "https://deno.land/x/discordeno@13.0.0-rc20/types/util.ts";
import { EditGlobalApplicationCommand, upsertApplicationCommands } from "@deps";

/**
 * Updates slash commands on the discord api
 */
export async function updateApplicationCommands() {
  log.info("Updating application commands");
  await globalCommand();
  await guildCommand();
}

async function globalCommand() {
  /** Checks if command is global or not */
  await Bot.helpers.upsertApplicationCommands(
    Bot.commands
      /** Filters out commands that are not devOnly */
      .filter((command) => !(command.devOnly ?? false))
      .array(),
  );
}

async function guildCommand() {
  /** Checks if command is guild only or not */
  await Bot.helpers.upsertApplicationCommands(
    Bot.commands
      .filter((command) => !!command.devOnly)
      .array(),
    configs.devGuildId,
  );
}

/**
 * Updates the command information in the discord api
 * @param scope The scope of the command | options are "global" or "guild"
 */
export async function uploadCommands(scope: "Guild" | "Global") {
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
     Bot.guilds.forEach((guild) => upsertApplicationCommands(Bot, perGuildCommands, guild.id))
  }
}
