import monitorAwardsTable from "@/features/monitorAwardsTable";
import seedAwards from "@/postgresql/seedAwards";
import { monitorAlertsSentQueue } from "./features/monitorAlertsSentQueue";
import { monitorAlertsQueue } from "./features/monitorAlertsQueue";

main();

export default async function main() {
  try {
    await seedAwards();
    monitorAwardsTable();
    monitorAlertsQueue();
    monitorAlertsSentQueue();
  } catch (error) {
    console.error(error);
  }
}
