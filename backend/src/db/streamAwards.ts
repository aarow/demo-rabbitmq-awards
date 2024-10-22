import { type Award } from "../types/Award";
import checkChecklists from "./checkChecklists";
import checkREC from "./checkREC";
import getCollection from "./connect";
import constants from "../constants/constants";
import checkAward from "./checkAward";
import { AlertType } from "../types/Alert";

export default async function streamAwards() {
  const collection = await getCollection(constants.AWARDS_COLLECTION_NAME);
  if (!collection) {
    throw new Error("Awards collection not found");
  }

  const changeStream = collection.watch();
  changeStream.on("change", async (change) => {
    if (
      change.operationType === "update" ||
      change.operationType === "insert"
    ) {
      // get original award from Awards collection
      const award = await collection.findOne<Award>({
        _id: change.documentKey._id,
      });

      if (!award) {
        return;
      }

      // loop through AlertType enum keys and call checkAward for each
      Object.values(AlertType).forEach((alertType) => {
        checkAward(award, alertType);
      });
    }
  });
}
