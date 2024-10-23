import { Payload } from "@/types/AwardNotifications";
import sql from "@/postgresql/connect";

export default async function useAwardNotifications(callbackFn: Function) {
  await sql.listen("update_awards", (payload: string) => {
    const json: Payload = JSON.parse(payload);

    if (!payload) {
      console.log("No payload received");
      return;
    }

    callbackFn(json);
  });
}
