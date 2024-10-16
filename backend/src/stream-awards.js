const { sendMessage } = require("./send-message");

async function streamAwards(collection) {
  const changeStream = collection.watch();
  changeStream.on("change", async (change) => {
    // if change is an update or insert, then if award_number is not null, then print it
    if (
      change.operationType === "update" ||
      change.operationType === "insert"
    ) {
      const award = await collection.findOne({
        _id: change.documentKey._id,
      });

      if (
        award.award_number &&
        (!award.acuro_checklist_submitted || !award.ohro_checklist_submitted)
      ) {
        // send message to RabbitMQ
        sendMessage({
          name: process.env.ADMIN_NAME,
          email: process.env.ADMIN_EMAIL,
          message: `Award is missing ACURO or OHRO checklist: ${award.award_number}`,
          timestamp: new Date().toISOString(),
        });
      }

      if (award.award_number && !award.rec_submitted) {
        // send message to RabbitMQ
        sendMessage({
          name: process.env.ADMIN_NAME,
          email: process.env.ADMIN_EMAIL,
          message: `Award is missing REC submission: ${award.award_number}`,
          timestamp: new Date().toISOString(),
        });
      }
    }
  });
}

module.exports = {
  streamAwards,
};
