import { Bot } from "../../bot.ts";
import { log } from "../../packages/utils/log/logger.ts";

Bot.events.debug = function (d: string) {
  log.warn(d);
};
