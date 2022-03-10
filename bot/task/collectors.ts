import {Bot} from "../../bot.ts";
import {Milliseconds} from "../../packages/utils/helpers.ts";
import {ButtonCollector, MessageCollector, ReactionCollector} from "../../interfaces/bot/collectors.ts";

Bot.tasks.set(`collectors`, {
    name: `collectors`,
    // Runs this function once a minute
    interval: Milliseconds.Minute,
    execute: function () {
        const now = Date.now();

        Bot.messageCollectors.forEach((collector: MessageCollector, key: bigint) => {
            // This collector has not finished yet.
            if (collector.createdAt + collector.duration > now) return;

            // Remove the collector
            Bot.messageCollectors.delete(key);
            // Reject the promise so code can continue in commands.
            return collector.reject("User did not send a message in time.");
        });

        Bot.reactionCollectors.forEach((collector: ReactionCollector, key: bigint) => {
            // This collector has not finished yet.
            if (collector.createdAt + collector.duration > now) return;

            // Remove the collector
            Bot.reactionCollectors.delete(key);
            // Reject the promise so code can continue in commands.
            return collector.reject("User did not react in time.");
        });

        Bot.buttonCollectors.forEach((collector: ButtonCollector, key:  bigint) => {
            // This collector has not finished yet.
            if (collector.createdAt + collector.duration > now) return;

            // Remove the collector
            Bot.buttonCollectors.delete(key);
            // Reject the promise so code can continue in commands.
            return collector.reject("The button was not pressed in time.");
        });
    },
});