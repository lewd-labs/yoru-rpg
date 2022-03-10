import { dotEnvConfig } from "./deps.ts";

// Get the .env file that the user should have created, and get the token
const env = dotEnvConfig({ export: true });
const token = env.DISCORD_BOT_TOKEN || "";

export interface Config {
  token: string;
  botId: bigint;
  invite_url: string;
  applicationId: bigint;
  development_mode: boolean;
  userIds: {
    botSupporters: string[]
    botDevs: string[]
    botOwners: string[]
  }
  prefix: string;
}

export const configs = {
  /** Get token from ENV variable */
  token,
  /** Get the BotId from the token */
  botId: BigInt(atob(token.split(".")[0])),
  /** The server id where you develop your bot and want dev commands created. */
  devGuildId: BigInt(env.DEV_GUILD_ID!),
  supportServerId: "837830514130812970",
  invite_url:
    "https://discord.com/api/oauth2/authorize?client_id=946398697254703174&permissions=466812794944&scope=bot%20applications.commands",
  applicationId: BigInt(946398697254703174n),
  development_mode: true,
  userIds: {
    // You can delete the `as string[]` when you add least 1 id in them.
    // The user ids for the support team
    botSupporters: [] as string[],
    // The user ids for the other devs on your team
    botDevs: [] as string[],
    // The user ids who have complete 100% access to your bot
    botOwners: [] as string[],
  },
  prefix: "y!",
};

export const MISSING_TRANSLATION_WEBHOOK = env.MISSING_TRANSLATION_WEBHOOK ||
  "";
