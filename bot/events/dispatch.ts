import { Bot } from "../../bot.ts";
import { snowflakeToBigint } from "https://deno.land/x/discordeno@13.0.0-rc20/util/bigint.ts";
import { log } from "../../packages/utils/log/logger.ts";
import { delay } from "https://deno.land/x/discordeno@13.0.0-rc20/util/utils.ts";
import { GatewayPayload, getChannels, getGuild, getMember, Guild } from "../../deps.ts";
const dispatch_local_storage = new Set<BigInt>();

Bot.events.dispatchRequirements = async (_, payload: GatewayPayload) => {
  if (!Bot.fullyReady) return;

  // If the payload is already in the set, we don't need to dispatch it again
  if (payload.t && ["GUILD_CREATE", "GUILD_DELETE"].includes(payload.t)) return;

  const id = snowflakeToBigint(
    (payload.t && ["GUILD_UPDATE"].includes(payload.t)
      ? // deno-lint-ignore no-explicit-any
        (payload.d as any)?.id
      : // deno-lint-ignore no-explicit-any
        (payload.d as any)?.guild_id) ?? "",
  );

  if (!id || Bot.activeGuildIds.has(id)) return;

  // If this guild is in cache, it has not been swept, and we can cancel
  if (Bot.guilds.has(id)) {
    log.info(`Cancelling dispatch for ${id}`);
    Bot.activeGuildIds.add(id);
    return;
  }

  // If this guild is in the local storage, we don't need to dispatch it again
  if (dispatch_local_storage.has(id)) {
    log.info(`[DISPATCH] New Guild ID already being processed: ${id} in ${payload.t} event`);
    let runs = 0;
    do {
      await delay(1000);
      ++runs;
    } while (dispatch_local_storage.has(id) && runs < 40);
  }

  // add to local storage if not already in it
  dispatch_local_storage.add(id);

  // New guild id has appeared, fetch all relevant data
  log.info(`[DISPATCH] New Guild ID has appeared: ${id} in ${payload.t} event`);

  const rawGuild = (await getGuild(Bot, id, {
    counts: true,
  }).catch(log.info)) as Guild | undefined;

  if (!rawGuild) {
    dispatch_local_storage.delete(id);
    return log.info(`[DISPATCH] Guild ID ${id} failed to fetch.`);
  }

  log.info(`[DISPATCH] Guild ID ${id} has been found. ${rawGuild.name}`);

  const [channels, botMember] = await Promise.all([
    getChannels(Bot, id),
    getMember(Bot, id, Bot.id),
  ]).catch((error) => {
    log.info(error);
    return [];
  });

  if (!botMember || !channels) {
    dispatch_local_storage.delete(id);
    return log.info(`[DISPATCH] Guild ID ${id} Name: ${rawGuild.name} failed. Unable to get botMember or channels`);
  }
};

// Events that have
/**
 * channelCreate
 * channelUpdate
 * channelDelete
 * channelPinsUpdate
 * guildBanAdd
 * guildBanRemove
 * guildEmojisUpdate
 * guildIntegrationsUpdate
 * guildMemberAdd
 * guildMemberRemove
 * guildMemberUpdate
 * guildMembersChunk
 * guildRoleCreate
 * guildRoleUpdate
 * guildRoleDelete
 * inviteCreate
 * inviteDelete
 * messageCreate
 * messageUpdate
 * messageDelete
 * messageDeleteBulk
 * messageReactionAdd
 * messageReactionRemove
 * messageReactionRemoveAll
 * messageReactionRemoveEmoji
 * presenceUpdate
 * typingStart
 * voiceStateUpdate
 * voiceServerUpdate
 * webhooksUpdate
 */

// Events that don't have guild_id
/**
 * guildCreate id
 * guildUpdate id
 * guildDelete id
 */

export function sweepInactiveGuildsCache() {
  for (const guild of Bot.guilds.values()) {
    if (Bot.activeGuildIDs.has(guild.id)) continue;

    // This is inactive guild. Not a single thing has happened for least 30 minutes.
    // Not a reaction, not a message, not any event!
    Bot.guilds.delete(guild.id);
    Bot.dispatchedGuildIDs.add(guild.id);
  }

  // Remove all channel if they were dispatched
  Bot.channels.forEach((channel) => {
    if (!Bot.dispatchedGuildIDs.has(channel.guildId)) return;

    Bot.channels.delete(channel.id);
    Bot.dispatchedChannelIDs.add(channel.id);
  });

  // Reset activity for next interval
  Bot.activeGuildIDs.clear();
}
