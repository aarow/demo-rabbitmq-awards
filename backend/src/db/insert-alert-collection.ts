import constants from "../constants/constants";
import { AlertType } from "../types/Alert";
import { Award } from "../types/Award";
import getCollection from "./connect";
import timestamp from "../utils/timestamp";

export default async function insertAlertCollection(
  award: Award,
  alert_type: AlertType
) {
  // insert into alerts collection
  const collection = await getCollection(constants.ALERTS_COLLECTION_NAME);
  if (!collection) {
    throw new Error("Alerts collection not found");
  }
  await collection.insertOne({
    award_number: award.award_number,
    alert_type,
    alert_sent_at: null,
    created_at: timestamp(),
  });
}
