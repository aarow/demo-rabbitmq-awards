import useNotifications from "./useNotifications";

export default async function monitorAwards() {
  useNotifications((payload: object) => {
    console.log("Object received:", payload);

    // if (
    //   change.operationType === "update" ||
    //   change.operationType === "insert"
    // ) {
    //   // get original award from Awards collection
    //   const award = await collection.findOne<Award>({
    //     _id: change.documentKey._id,
    //   });

    //   if (!award) {
    //     return;
    //   }

    //   // loop through AlertType enum keys and call checkAward for each
    //   Object.values(AlertType).forEach((alertType) => {
    //     checkAward(award, alertType);
    //   });
    // }
  });
}
