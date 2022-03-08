import {ApplicationCommandOption, ApplicationCommandTypes, DiscordenoInteraction, Permission} from "../../deps.ts";
import { BotClient } from "@bot";
import {PermissionLevelHandlers} from "../../packages/permissions/mod.ts";

export interface ICommand {
  /** The name of this command. */
  name: string;
  /** What does this command do? */
  description: string;
  /** The type of command this is. */
  type: ApplicationCommandTypes;
  /** Defaults to `Guild` */
  scope?: "Global" | "Guild" | "Development";
  /** The options for this command */
  options?: ApplicationCommandOption[];
  /** Subcommand options */
  subcommands?: Array<subCommandGroup | subCommand>;
  /** This will be executed when the command is run. */
  execute: (bot: BotClient, interaction: DiscordenoInteraction) => unknown;
  /** Whether the command should have a cool down */
  cooldown?: {
    /** How long the user needs to wait after the first execution until he can use the command again */
    seconds: number;
    /** How often the user is allowed to use the command until he is in cool down */
    allowedUses?: number;
  };
  nsfw?: boolean;
  /** Dm only by default false */
  dmOnly?: boolean;
  /** Whether this slash command should be enabled right now. Defaults to true. */
  enabled?: boolean;
  permissionLevels?:
      | (keyof typeof PermissionLevelHandlers)[]
      | ((
      data: DiscordenoInteraction,
      command: ICommand,
  ) => boolean | Promise<boolean>);
  botServerPermissions?: Permission[];
  botChannelPermissions?: Permission[];
  userServerPermissions?: Permission[];
  userChannelPermissions?: Permission[];
}

export type subCommand = Omit<ICommand, "subcommands">;
export type subCommandGroup = {
  name: string;
  subCommands: subCommand[];
};
