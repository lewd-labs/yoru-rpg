import { startBot } from "./deps.ts";
import { log } from "@utils";
import { Bot } from "@bot";
import { fileLoader, importDirectory } from "./packages/helpers/loader.ts";

log.info("Starting bot...");

/** Handles our modules to load with deno */
// Forces deno to read all the files which will fill the commands/inhibitors cache etc.
await Promise.all(
  [
    "./bot/commands",
    "./bot/events",
    "./bot/languages",
  ].map((path: string) => importDirectory(Deno.realPathSync(path))),
);
await fileLoader();

// STARTS THE CONNECTION TO DISCORD
await startBot(Bot);
