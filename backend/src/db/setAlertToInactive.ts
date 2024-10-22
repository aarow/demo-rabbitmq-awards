import { AlertType } from "../types/Alert";
import { Award } from "../types/Award";
import timestamp from "../utils/timestamp";
import updateAlertInCollection from "./updateAlertInCollection";

export async function setAlertToInactive(award: Award) {
  const filter = {
    award_number: award.award_number,
    alert_type: AlertType.REC,
  };
  const fields = { inactive_at: timestamp() };
  updateAlertInCollection(filter, fields);
}
