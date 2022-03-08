import { ApplicationCommandOption, ApplicationCommandTypes, DiscordenoInteraction } from "../../deps.ts";
import { BotClient } from "@bot";

export interface ICommand {
  /** The name of this command. */
  name: string;
  /** What does this command do? */
  description: string;
  /** The type of command this is. */
  type: ApplicationCommandTypes;
  /** Whether this command is for the dev server only. */
  devOnly?: boolean;
  /** Defaults to `Guild` */
  scope?: "Global" | "Guild";
  /** The options for this command */
  options?: ApplicationCommandOption[];
  /** Subcommand options */
  subcommands?: Array<subCommandGroup | subCommand>;
  /** This will be executed when the command is run. */
  execute: (bot: BotClient, interaction: DiscordenoInteraction) => unknown;
}

export type subCommand = Omit<ICommand, "subcommands">;
export type subCommandGroup = {
  name: string;
  subCommands: subCommand[];
};
