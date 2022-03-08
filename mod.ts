import { startBot } from "./deps.ts";
import { log } from "@utils";
import { updateApplicationCommands } from "./packages/helpers/updateCommands.ts";
import { Bot } from "@bot";

log.info("Starting bot...");

// UPDATES YOUR COMMANDS TO LATEST COMMANDS
await updateApplicationCommands();

// STARTS THE CONNECTION TO DISCORD
await startBot(Bot);
