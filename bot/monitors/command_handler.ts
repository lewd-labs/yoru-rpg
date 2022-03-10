import {Bot} from "../../bot.ts";

/**
 * Finds the current prefix
 * @param guildId The guild ID
 * @returns The prefix
 */
export function parsePrefix(guildId: bigint | undefined) {
    const prefix = guildId ? Bot.prefixs.get(guildId) : Bot.configs.prefix;
    return prefix || Bot.configs.prefix;
}

export function parseCommand(commandName: string) {
    commandName = commandName.toLowerCase();
    const command = Bot.commands.get(commandName);
    if (command) return command;

    // Check aliases if the command wasn't found
    return Bot.commands.find((cmd) => Boolean(cmd.aliases?.includes(commandName)));
}

