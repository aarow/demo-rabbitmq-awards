const sql = require("./postgresql/connect");

async function monitorAlertsTable(callbackFn) {
  await sql.listen("update_alerts", (payload) => {
    const json = JSON.parse(payload);
    console.log("payload: ", json);

    if (!payload) {
      console.log("No payload received");
      return;
    }

    callbackFn(json);
  });
}

module.exports = monitorAlertsTable;
