import constants from "../constants/constants";
import getCollection from "./connect";

export default async function updateAlertInCollection(
  filter: object,
  fields: object
) {
  const collection = await getCollection(constants.ALERTS_COLLECTION_NAME);
  if (!collection) {
    throw new Error("Alerts collection not found");
  }

  await collection.updateOne(filter, { $set: fields });
}
