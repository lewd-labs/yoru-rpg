import { Bot } from "../../bot.ts";
import { Task } from "../../interfaces/bot/task.ts";
import { bgYellow, black, Collection } from "../../deps.ts";
import { log } from "../utils/log/logger.ts";

export function registerTasks() {
  for (const task of Bot.tasks.values()) {
    Bot.runningTasks.initialTimeouts.push(
      setTimeout(async () => {
        log.info(`[TASK: ${bgYellow(black(task.name))}] Started.`);
        try {
          await task.execute();
        } catch (error) {
          log.error(error);
        }

        Bot.runningTasks.initialTimeouts.push(
          setInterval(async () => {
            if (!bot.fullyReady) return;
            log.info(`[TASK: ${bgYellow(black(task.name))}] Started.`);
            try {
              await task.execute();
            } catch (error) {
              log.error(error);
            }
          }, task.interval),
        );
      }, task.interval - (Date.now() % task.interval)),
    );
  }
}

export function clearTasks() {
  for (const timeout of bot.runningTasks.initialTimeouts) clearTimeout(timeout);
  for (const task of Bot.runningTasks.intervals) clearInterval(task);

  Bot.tasks = new Collection<string, Task>();
  Bot.runningTasks = { initialTimeouts: [], intervals: [] };
}
