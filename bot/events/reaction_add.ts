import {Bot} from "../../bot.ts";
import {processReactionCollectors} from "../../packages/helpers/collectors_helper.ts";


Bot.events.reactionAdd = function (_, payload) {
    // Process reaction collectors.
    if (payload) {
        processReactionCollectors(payload.messageId, payload.emoji, payload.userId);
    }
};