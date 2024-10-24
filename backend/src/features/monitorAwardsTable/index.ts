import { AlertType } from "@/types/Alert";
import { Payload } from "@/types/AwardNotifications";
import { useAwardTableNotifications } from "@/postgresql/awards-table";
import processAward from "./processAward";

export default async function monitorAwardsTable() {
  useAwardTableNotifications((payload: Payload) => {
    const { new: award, old: oldAward, operationType } = payload;

    console.log("Award updated:", award);

    Object.values(AlertType).forEach((alertType) => {
      processAward(award, alertType);
    });
  });
}
