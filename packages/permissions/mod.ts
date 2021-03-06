import { ICommand } from "../../interfaces/bot/command.ts";
import { DiscordenoInteraction, validatePermissions } from "../../deps.ts";

export default async function hasPermissionLevel(
  command: ICommand,
  payload: DiscordenoInteraction,
) {
  // This command doesnt require a perm level so allow the command.
  if (!command.permissionLevels) return true;

  // If a custom function was provided
  if (typeof command.permissionLevels === "function") {
    return command.permissionLevels(payload, command);
  }

  // If an array of perm levels was provided
  for (const permLevel of command.permissionLevels) {
    // If this user has one of the allowed perm level, the loop is canceled and command is allowed.
    if (await PermissionLevelHandlers[permLevel](payload, command)) return true;
  }

  // None of the perm levels were met. So cancel the command
  return false;
}

export const PermissionLevelHandlers: Record<
  keyof typeof PermissionLevels,
  (
    payload: DiscordenoInteraction,
    command: ICommand,
  ) => boolean | Promise<boolean>
> = {
  MEMBER: () => true,
  MODERATOR: (payload: DiscordenoInteraction) =>
    Boolean(payload.member?.permissions) &&
    validatePermissions(payload.member!.permissions!, ["MANAGE_GUILD"]),
  ADMIN: (payload: DiscordenoInteraction) =>
    Boolean(payload.member?.permissions) &&
    validatePermissions(payload.member!.permissions!, ["ADMINISTRATOR"]),
  SERVER_OWNER: () => false,
  BOT_SUPPORT: () => false,
  BOT_DEVS: () => false,
  BOT_OWNERS: () => false,
};

export enum PermissionLevels {
  MEMBER,
  MODERATOR,
  ADMIN,
  SERVER_OWNER,
  BOT_SUPPORT,
  BOT_DEVS,
  BOT_OWNERS,
}
