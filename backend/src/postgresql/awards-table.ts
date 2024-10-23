import sql from "@/postgresql/connect";
import { Payload } from "@/types";

export async function useAwardTableNotifications(callbackFn: Function) {
  await sql.listen("update_awards", (payload: string) => {
    const json: Payload = JSON.parse(payload);

    if (!payload) {
      console.log("No payload received");
      return;
    }

    callbackFn(json);
  });
}
