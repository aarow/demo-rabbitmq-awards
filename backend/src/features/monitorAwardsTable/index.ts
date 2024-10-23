import { AlertType } from "@/types/Alert";
import { Payload } from "@/types/AwardNotifications";
import checkAward from "./checkAward";
import { useAwardNotifications } from "@/postgresql/awards-table";

export default async function monitorAwardsTable() {
  useAwardNotifications((payload: Payload) => {
    const { new: award, old: oldAward, operationType } = payload;

    console.log("Award updated:", award);

    Object.values(AlertType).forEach((alertType) => {
      checkAward(award, alertType);
    });
  });
}
