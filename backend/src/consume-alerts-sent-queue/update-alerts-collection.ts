import dotenv from "dotenv";
import constants from "../constants/constants";
import getCollection from "../db/connect";

dotenv.config();

export default async function updateAlertsCollection(data: any) {
  const collection = await getCollection(constants.ALERTS_COLLECTION_NAME);

  if (!collection) {
    throw new Error("Alerts collection not found");
  }

  await collection.updateOne(
    { award_number: data.award_number, alert_type: data.alert_type },
    { $set: { alert_sent: true } }
  );
}
