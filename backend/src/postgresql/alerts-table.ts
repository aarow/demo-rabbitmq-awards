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
  award: Award;
  alert_type: AlertType;
}

export async function insertAlert({ award, alert_type }: InsertAlertParams) {
  return sql`INSERT INTO public.alerts 
    (award_number, id, inactive_at, alert_type, alert_sent_at, created_at) 
    VALUES 
    (${
      award.award_number
    }, DEFAULT, DEFAULT, ${alert_type}, DEFAULT, ${timestamp()})`;
}

export async function setAlertToInactive(award: Award, alert_type: AlertType) {
  await sql`UPDATE alerts SET inactive_at = ${timestamp()} 
    WHERE award_number = ${award.award_number} AND alert_type = ${alert_type}`;
}

export async function updateAlertSentAt(
  award_number: string,
  alert_type: AlertType
) {
  await sql`UPDATE alerts SET alert_sent_at = ${timestamp()} WHERE award_number = ${award_number} AND alert_type = ${alert_type}`;
}
