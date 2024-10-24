import sql from "./connect";

export default async function seedAwards() {
  await createAwardsTable();
  await setupAwardsNotifications();
  await setupAwardsTrigger();
  await insertAwardsTable();
}

async function insertAwardsTable() {
  const awardsCountResult =
    await sql`SELECT count(*) AS exact_count FROM awards;`;
  const awardsCount = awardsCountResult[0].exact_count;

  console.log(`There are ${awardsCount} awards in the table.`);

  if (awardsCount > 0) {
    console.log("Skipping seeding because awards table is not empty.");
    return;
  }
  await sql`
    INSERT INTO awards(id, award_number, acuro_checklist_submitted, ohro_checklist_submitted, rec_submitted, award_health_color_code) VALUES
      ('1', '12345', true, true, true, 'BLUE'),
      ('2', '55555', true, true, true, 'GREEN'),
      ('3', '67890', false, true, true, 'RED');
  `;
  console.log(`Inserted 3 awards into the awards table.`);
}

async function createAwardsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS awards(
      id text PRIMARY KEY,
      award_number text,
      acuro_checklist_submitted boolean,
      ohro_checklist_submitted boolean,
      rec_submitted boolean,
      award_health_color_code text
    );
  `;
}

async function setupAwardsTrigger() {
  await sql`
    CREATE OR REPLACE TRIGGER notify_table_update
      AFTER INSERT OR UPDATE OR DELETE
      ON awards
      FOR EACH ROW
      EXECUTE FUNCTION notify_table_update();
  `;
}

async function setupAwardsNotifications() {
  await sql`
      CREATE OR REPLACE FUNCTION public.notify_table_update()
        RETURNS trigger
        LANGUAGE plpgsql
      AS $function$
        BEGIN
          IF TG_OP = 'INSERT' THEN
              PERFORM pg_notify(
                'update_' || TG_TABLE_NAME,
                '{"operationType": "INSERT", "new":' || row_to_json(NEW)::text  || '}'
              );
          END IF;

          IF TG_OP = 'UPDATE' THEN
              PERFORM pg_notify(
                'update_' || TG_TABLE_NAME,
                '{"operationType": "UPDATE", "new":' || row_to_json(NEW)::text  || ',"old":'  || row_to_json(NEW)::text || '}'
              );
          END IF;

          IF TG_OP = 'DELETE' THEN
              PERFORM pg_notify(
                'update_' || TG_TABLE_NAME,
                '{"operationType": "DELETE", "old":'  || row_to_json(OLD)::text || '}'
              );
          END IF;
          RETURN null;
        END;
      $function$
  `;
}
