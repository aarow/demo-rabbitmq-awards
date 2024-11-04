import { AlertType } from "@/types/Alert";
import { Payload } from "@/types/AwardNotifications";
import { useAwardTableNotifications } from "@/postgresql/awards-table";
import processAward from "./processAward";

export default async function monitorAwardsTable() {
  useAwardTableNotifications((payload: Payload) => {
    const { new: log_no } = payload;

    console.log("Award updated:", payload);

    Object.values(AlertType).forEach((alertType) => {
      console.log(alertType, log_no)
      processAward(log_no, alertType);
    });
  });
}
