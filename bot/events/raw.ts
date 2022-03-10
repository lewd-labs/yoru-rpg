import { Bot } from "../../bot.ts";

Bot.events.raw = function (_, data) {
  Bot.log.debug(`[RAW] ${data}`);
};
