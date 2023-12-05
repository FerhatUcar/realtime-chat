import {
  app,
  CONNECTION_COUNT_UPDATED_CHANNEL,
  NEW_MESSAGE_CHANNEL,
  PORT,
} from "./main";
import { randomUUID } from "crypto";
import Redis from "ioredis";

export const subscribeMessage = ({ subscribe, on }: Redis) => {
  subscribe(NEW_MESSAGE_CHANNEL, (err, count) => {
    if (err) {
      console.error(`Error subscribing to ${NEW_MESSAGE_CHANNEL}`);
      return;
    }

    console.log(
      `${count} clients subscribes to ${NEW_MESSAGE_CHANNEL} channel`,
    );
  });

  on("message", (channel, text) => {
    if (channel === CONNECTION_COUNT_UPDATED_CHANNEL) {
      app.io.emit(CONNECTION_COUNT_UPDATED_CHANNEL, {
        count: text,
      });

      return;
    }

    if (channel === NEW_MESSAGE_CHANNEL) {
      app.io.emit(NEW_MESSAGE_CHANNEL, {
        message: text,
        id: randomUUID(),
        createdAt: new Date(),
        port: PORT,
      });

      return;
    }
  });
};
