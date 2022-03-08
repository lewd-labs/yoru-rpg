import { configs } from "../../configs.ts";
import { Bot } from "../../bot.ts";
import { log } from "../utils/log/logger.ts";

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
