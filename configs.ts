import { dotEnvConfig } from "./deps.ts";

// Get the .env file that the user should have created, and get the token
const env = dotEnvConfig({ export: true });
const token = env.DISCORD_BOT_TOKEN || "OTQ2Mzk4Njk3MjU0NzAzMTc0.YheIeA.B1P9zNvtJQENwjOK21p27eXgujY";

export interface Config {
  token: string;
  botId: bigint;
  invite_url: string;
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
};

export const MISSING_TRANSLATION_WEBHOOK = env.MISSING_TRANSLATION_WEBHOOK ||
  "";
