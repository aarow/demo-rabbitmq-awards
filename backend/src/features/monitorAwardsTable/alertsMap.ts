import sql from "@/postgresql/connect";
import { AlertType, Award } from "@/types";
import timestamp from "@/utils/timestamp";

const { ADMIN_NAME, ADMIN_EMAIL } = process.env;

export const alertsMap = {
  // [AlertType.REC]: {
  //   isAlertRequired: async (log_no: string) =>
  //     !!award.award_number && !award.rec_submitted,
  //   alertMessageData: (award: Award) => ({
  //     award_number: award.award_number,
  //     alert_type: AlertType.REC,
  //     name: ADMIN_NAME as string,
  //     email: ADMIN_EMAIL as string,
  //     message: `Award is missing REC submission: ${award.award_number}`,
  //     created_at: timestamp(),
  //   }),
  // },
  // [AlertType.CHECKLIST]: {
  //   isAlertRequired: async (award: Award) =>
  //     !!award.award_number &&
  //     (!award.acuro_checklist_submitted || !award.ohro_checklist_submitted),
  //   alertMessageData: (award: Award) => ({
  //     award_number: award.award_number,
  //     alert_type: AlertType.CHECKLIST,
  //     name: ADMIN_NAME as string,
  //     email: ADMIN_EMAIL as string,
  //     message: `Award is missing ACURO and OHRO checklists: ${award.award_number}`,
  //     created_at: timestamp(),
  //   }),
  // },
  [AlertType.HEALTH_COLOR_CODE]: {
    isAlertRequired: async (log_no: string) => {
      // SOME SQL QUERY TO CHECK IF THE AWARD IS MISSING A HEALTH COLOR CODE
      // const result =
      //   await sql`SELECT * FROM awards WHERE award_number = ${award.award_number} AND award_health_color_code IS NOT NULL`;

      return true;
      
      const result = await sql``;

      // if no health color code, return true (alert required)
      if (result.length === 0) {
        return true;
      }
      return false;
    },
    alertMessageData: (log_no: string) => ({
      award_number: log_no,
      alert_type: AlertType.HEALTH_COLOR_CODE,
      name: ADMIN_NAME as string,
      email: ADMIN_EMAIL as string,
      message: `Award is missing Award Health Color Code selection: ${log_no}`,
      created_at: timestamp(),
    }),
  },
};
