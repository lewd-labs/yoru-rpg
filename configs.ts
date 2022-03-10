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
}

export const configs = {
  /** Get token from ENV variable */
  token,
  /** Get the BotId from the token */
  botId: BigInt(atob(token.split(".")[0])),
  /** The server id where you develop your bot and want dev commands created. */
  devGuildId: BigInt(env.DEV_GUILD_ID!),
  invite_url:
    "https://discord.com/api/oauth2/authorize?client_id=946398697254703174&permissions=466812794944&scope=bot%20applications.commands",
  applicationId: BigInt(946398697254703174n),
  development_mode: true,
};

export const MISSING_TRANSLATION_WEBHOOK = env.MISSING_TRANSLATION_WEBHOOK ||
  "";
