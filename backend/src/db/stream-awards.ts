import { Collection, Document } from "mongodb";
import { type Award } from "../types/Award";
import checkChecklists from "./checkChecklists";
import checkREC from "./checkREC";

export default async function streamAwards(collection: Collection<Document>) {
  const changeStream = collection.watch();
  changeStream.on("change", async (change) => {
    if (
      change.operationType === "update" ||
      change.operationType === "insert"
    ) {
      const award = await collection.findOne<Award>({
        _id: change.documentKey._id,
      });

      if (!award) {
        return;
      }

      checkChecklists(award);
      checkREC(award);
    }
  });
}
