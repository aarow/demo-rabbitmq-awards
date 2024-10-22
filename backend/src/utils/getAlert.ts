import constants from "../constants/constants";
import getCollection from "../db/connect";
import { Alert } from "../types/Alert";

export default async function getAlert(filters: object) {
  const collection = await getCollection(constants.ALERTS_COLLECTION_NAME);

  if (!collection) {
    throw new Error("Alerts collection not found");
  }

  const alert = await collection.findOne<Alert>(filters);

  return alert;
}
