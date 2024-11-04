import sql from "@/postgresql/connect";
import { AlertType, Award, Payload } from "@/types";
import timestamp from "@/utils/timestamp";

interface GetAlertParams {
  award_number: string;
  alert_type: AlertType;
}

export async function getAlert({ award_number, alert_type }: GetAlertParams) {
  return sql`SELECT * FROM alerts
    WHERE award_number = ${award_number} AND alert_type = ${alert_type}`;
}

interface InsertAlertParams {
  log_no: string;
  alert_type: AlertType;
}

export async function insertAlert({ log_no, alert_type }: InsertAlertParams) {
  return sql`INSERT INTO alerts 
    (award_number, id, inactive_at, alert_type, alert_sent_at, created_at) 
    VALUES 
    (${
      log_no
    }, DEFAULT, DEFAULT, ${alert_type}, DEFAULT, ${timestamp()})`;
}

export async function setAlertToInactive(log_no: string, alert_type: AlertType) {
  await sql`UPDATE alerts SET inactive_at = ${timestamp()} 
    WHERE award_number = ${log_no} AND alert_type = ${alert_type}`;
}

export async function updateAlertSentAt(
  award_number: string,
  alert_type: AlertType
) {
  await sql`UPDATE alerts SET alert_sent_at = ${timestamp()} WHERE award_number = ${award_number} AND alert_type = ${alert_type}`;
}
