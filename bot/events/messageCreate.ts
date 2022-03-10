
import {Bot} from "../../bot.ts";
import {
    botHasChannelPermissions,
    botHasGuildPermissions, ChannelTypes, DiscordenoMember, fetchMembers,
    hasChannelPermissions,
    hasGuildPermissions,
} from "../../deps.ts";

Bot.events.messageCreate = (_, message) => {
     Bot.monitors.forEach(async(monitor) => {
        // The !== false is important because when not provided we default to true
        if (monitor.ignoreBots !== false && message.isBot) return;

        const channel = Bot.channels.get(message.channelId);
        if (!channel) return;

        if (monitor.ignoreDM !== false && channel.type === ChannelTypes.DM) {
            return;
        }

        if (monitor.ignoreEdits && message.editedTimestamp) return;
        if (monitor.ignoreOthers && message.authorId !== Bot.id) return;

        // Permission checks

        // No permissions are required
        if (
            !monitor.botChannelPermissions?.length &&
            !monitor.botServerPermissions?.length &&
            !monitor.userChannelPermissions?.length &&
            !monitor.userServerPermissions?.length
        ) {
            return monitor.execute(message);
        }

        // If some permissions is required it must be in a guild
        if (!message.guildId) return;

        // Fetch the member if not in cache in rare edge cases it can be undefined
        const member = await fetchMembers(Bot, message.guildId, 1, {
            limit: 1,
            userIds: [message.authorId]
        }) as DiscordenoMember | undefined;

        if (!member) return;

        const permissionCheckResults = await Promise.all([
            // Check if the message author has the necessary channel permissions to run this monitor
            monitor.userChannelPermissions
                ? hasChannelPermissions(Bot, message.channelId, member, monitor.userChannelPermissions)
                : undefined,
            // Check if the message author has the necessary guild permissions to run this monitor
            monitor.userServerPermissions
                ? hasGuildPermissions(Bot, message.guildId, member, monitor.userServerPermissions)
                : undefined,
            // Check if the bot has the necessary channel permissions to run this monitor in this channel.
            monitor.botChannelPermissions
                ? botHasChannelPermissions(Bot, message.channelId, monitor.botChannelPermissions)
                : undefined,
            // Check if the bot has the necessary guild permissions to run this monitor
            monitor.botServerPermissions ? botHasGuildPermissions(Bot, message.guildId, monitor.botServerPermissions) : undefined,
        ]);

        if (permissionCheckResults.includes(false)) return;

        return monitor.execute(message);
    });
};