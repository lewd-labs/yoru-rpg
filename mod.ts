import { startBot } from "./deps.ts";
import { log } from "@utils";
import { fileLoader, importDirectory } from "./packages/helpers/loader.ts";
import { updateApplicationCommands } from "./packages/helpers/updateCommands.ts";
import { Bot } from "@bot";

log.info("Starting bot...");

// Forces deno to read all the files which will fill the commands/inhibitors cache etc.
await Promise.all(
  [
    "./bot/commands",
    "./bot/events",
    // "./bot/tasks",
  ].map((path) => importDirectory(Deno.realPathSync(path))),
);
await fileLoader();

// UPDATES YOUR COMMANDS TO LATEST COMMANDS
await updateApplicationCommands();

// STARTS THE CONNECTION TO DISCORD
await startBot(Bot);
