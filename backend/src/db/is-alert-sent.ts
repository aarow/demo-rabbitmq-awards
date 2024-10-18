import constants from "../constants/constants";
import { Alert, AlertType } from "../types/Alert";
import { Award } from "../types/Award";
import getCollection from "./connect";

/**
 * Checks if an alert has already been sent for a given award.
 * Queries the alerts collection to determine if an alert of type REC
 * has been sent for the specified award number.
 *
 * @param {Award} award - The award for which to check alert status.
 * @returns {Promise<boolean>} - A promise that resolves to true if the alert
 * has been sent, false otherwise.
 * @throws {Error} - Throws an error if the alerts collection is not found.
 */
export default async function isAlertSent(award: Award, alertType: AlertType) {
  const collection = await getCollection(constants.ALERTS_COLLECTION_NAME);

  if (!collection) {
    throw new Error("Alerts collection not found");
  }

  const alertSent = await collection.findOne<Alert>({
    award_number: award.award_number,
    alert_type: alertType,
  });

  if (!alertSent) {
    return false;
  }

  return alertSent.alert_sent;
}
