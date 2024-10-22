import { Notification } from "pg";
import connect from "../postgresql/connect";

// TODO: figure out how to stream notifications from the database

export default async function useNotifications(callbackFn: Function) {
  // listen to database changes to Awards table/collection
  const pgClient = await connect();

  // Listen for the PostgreSQL notify events
  pgClient.on("notification", async (msg: Notification) => {
    console.log("Message received:", msg);

    if (!msg.payload) {
      console.log("No payload received");
      return;
    }

    const payload = JSON.parse(msg.payload);
    callbackFn(payload);
  });
}
