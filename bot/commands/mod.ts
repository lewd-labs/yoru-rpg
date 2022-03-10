import { ICommand } from "../../interfaces/bot/command.ts";
import { Bot } from "@bot";
import {ArgumentDefinition} from "../../interfaces/bot/command_types.ts";

/**
 * Function that creates slash command for us and sets them to cache.
 * @param command Command to register.
 */
export function createCommand<T extends readonly ArgumentDefinition[]>(command: ICommand<T>): void {
  // Setting default values for all commands.
  (command.botChannelPermissions = [
    "ADD_REACTIONS",
    "USE_EXTERNAL_EMOJIS",
    "READ_MESSAGE_HISTORY",
    "VIEW_CHANNEL",
    "SEND_MESSAGES",
    "EMBED_LINKS",
    ...(command.botChannelPermissions ?? []),
  ])
  if (command.scope === undefined) {
    command.scope = "Development";
  }
  Bot.commands.set(command.name, command);
}
