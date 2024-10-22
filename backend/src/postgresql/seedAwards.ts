import connect from "./connect";

const awardsTableSetupSql = `
  CREATE TABLE IF NOT EXISTS awards(
    id text PRIMARY KEY,
    award_number text,
    acuro_checklist_submitted boolean,
    ohro_checklist_submitted boolean,
    rec_submitted boolean,
    award_health_color_code text
  ); 
`;

const awardsRecordsSetupSql = `
  INSERT INTO awards(id, award_number, acuro_checklist_submitted, ohro_checklist_submitted, rec_submitted, award_health_color_code) VALUES
    ('1', '12345', true, true, true, 'BLUE'),
    ('2', '67890', false, true, true, 'RED');
`;

const awardsCountSql = `SELECT count(*) AS exact_count FROM awards;`;

export default async function seedAwards() {
  const dbClient = await connect();

  // get count of records in dbClient database to determine if collection is empty
  console.log("dbClient.database", dbClient.database);

  dbClient.query(awardsTableSetupSql);

  const awardsCountResult = await dbClient.query(awardsCountSql);
  console.log(
    `There are ${awardsCountResult.rows[0].exact_count} awards in the collection.`
  );

  if (awardsCountResult.rows[0].exact_count > 0) {
    console.log("Skipping seeding because awards table is not empty.");
    return;
  }

  const insertAwardsResult = await dbClient.query(awardsRecordsSetupSql);
  console.log(
    `Inserted ${insertAwardsResult.rowCount} awards into the awards table.`
  );
}
