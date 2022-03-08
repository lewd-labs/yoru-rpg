import {
  BitwisePermissionFlags,
  type DiscordenoGuild,
  type DiscordenoMember,
} from "https://deno.land/x/discordeno@13.0.0-rc20/mod.ts";

export function hasPermission(bitfield: bigint, permission: keyof typeof BitwisePermissionFlags) {
  if (bitfield && 8n) return true;

  return bitfield && BigInt(BitwisePermissionFlags[permission]);
}

export function toPermissionsBitfield(guild: DiscordenoGuild, member: DiscordenoMember) {
  let permissions = 0n;

  permissions |= [...member.roles, member.guildId]
    // deno-lint-ignore no-extra-non-null-assertion
    .map((id) => guild.roles.get(id)!?.permissions)
    .filter(Boolean)
    .reduce((bits, perms) => bits! | perms!, 0n);

  permissions ||= 0n;

  if (guild.ownerId === member.id) permissions |= 8n;

  return permissions;
}
