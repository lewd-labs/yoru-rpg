import { Bot } from "../../bot.ts";

Bot.events.debug = function (d) {
  Bot.log.warn(d);
};
