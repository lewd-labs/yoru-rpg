import { Bot } from "../../bot.ts";
import { snowflakeToBigint } from "https://deno.land/x/discordeno@13.0.0-rc20/util/bigint.ts";
import { log } from "../../packages/utils/log/logger.ts";
import { delay } from "https://deno.land/x/discordeno@13.0.0-rc20/util/utils.ts";
import { Channel, getChannels, getGuild, getMember, Guild } from "../../deps.ts";
const dispatch_local_storage = new Set<BigInt>();

Bot.events.dispatchRequirements = async (bot, payload) => {
  if (!bot.fullyReady) return;

  // If the payload is already in the set, we don't need to dispatch it again
  if (payload.t && ["GUILD_CREATE", "GUILD_DELETE"].includes(payload.t)) return;

  const id = snowflakeToBigint(
    (payload.t && ["GUILD_UPDATE"].includes(data.t)
      ? // deno-lint-ignore no-explicit-any
        (payload.d as any)?.id
      : // deno-lint-ignore no-explicit-any
        (payload.d as any)?.guild_id) ?? "",
  );

  if (!id || bot.activeGuildIds.has(id)) return;

  // If this guild is in cache, it has not been swept, and we can cancel
  if (bot.guilds.has(id)) {
    log.info(`Cancelling dispatch for ${id}`);
    bot.activeGuildIds.add(id);
    return;
  }

  // If this guild is in the local storage, we don't need to dispatch it again
  if (dispatch_local_storage.has(id)) {
    log.info(`[DISPATCH] New Guild ID already being processed: ${id} in ${payload.t} event`);
    let runs: number = 0;
    do {
      await delay(1000);
      ++runs;
    } while (dispatch_local_storage.has(id) && runs < 40);
  }

  // add to local storage if not already in it
  dispatch_local_storage.add(id);

  // New guild id has appeared, fetch all relevant data
  log.info(`[DISPATCH] New Guild ID has appeared: ${id} in ${data.t} event`);

  const rawGuild = (await getGuild(id, {
    counts: true,
    addToCache: false,
  }).catch(log.info)) as Guild | undefined;

  if (!rawGuild) {
    dispatch_local_storage.delete(id);
    return log.info(`[DISPATCH] Guild ID ${id} failed to fetch.`);
  }

  log.info(`[DISPATCH] Guild ID ${id} has been found. ${rawGuild.name}`);

  const [channels, botMember] = await Promise.all([
    getChannels(id, false),
    getMember(id, botId, { force: true }),
  ]).catch((error) => {
    log.info(error);
    return [];
  });

  if (!botMember || !channels) {
    processing.delete(id);
    return log.info(`[DISPATCH] Guild ID ${id} Name: ${rawGuild.name} failed. Unable to get botMember or channels`);
  }

  const guild = await structures.createDiscordenoGuild(rawGuild, shardID);

  // Add to local storage
  bot.guilds.set(id, guild);
  bot.dispatchedGuildIDs.delete(id);
  channels.forEach((channel: Channel) => {
    bot.dispatchedChannelIDs.delete(channel.id);
    cache.channels.set(channel.id, channel);
  });

  dispatch_local_storage.delete(id);

  log.info(`[DISPATCH] Guild ID ${id} Name: ${guild.name} completely loaded.`);
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
  for (const guild of cache.guilds.values()) {
    if (Bot.activeGuildIDs.has(guild.id)) continue;

    // This is inactive guild. Not a single thing has happened for least 30 minutes.
    // Not a reaction, not a message, not any event!
    Bot.guilds.delete(guild.id);
    Bot.dispatchedGuildIDs.add(guild.id);
  }

  // Remove all channel if they were dispatched
  Bot.channels.forEach((channel: Channel) => {
    if (!Bot.dispatchedGuildIDs.has(channel.guildId)) return;

    Bot.channels.delete(channel.id);
    Bot.dispatchedChannelIDs.add(channel.id);
  });

  // Reset activity for next interval
  bot.activeGuildIDs.clear();
}
