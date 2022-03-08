import { ICommand } from "../../interfaces/bot/command.ts";
import { Bot } from "@bot";

/**
 * Function that creates slash command for us and sets them to cache.
 * @param command Command to register.
 */
export function createCommand(command: ICommand): void {
  if (command.devOnly === undefined) {
    command.devOnly = true;
  }
  Bot.commands.set(command.name, command);
}
