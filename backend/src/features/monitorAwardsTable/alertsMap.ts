import { AlertType, Award } from "@/types";
import timestamp from "@/utils/timestamp";

const { ADMIN_NAME, ADMIN_EMAIL } = process.env;

export const alertsMap = {
  [AlertType.REC]: {
    isAlertRequired: (award: Award) =>
      !!award.award_number && !award.rec_submitted,
    alertMessageData: (award: Award) => ({
      award_number: award.award_number,
      alert_type: AlertType.REC,
      name: ADMIN_NAME as string,
      email: ADMIN_EMAIL as string,
      message: `Award is missing REC submission: ${award.award_number}`,
      created_at: timestamp(),
    }),
  },
  [AlertType.CHECKLIST]: {
    isAlertRequired: (award: Award) =>
      !!award.award_number &&
      (!award.acuro_checklist_submitted || !award.ohro_checklist_submitted),
    alertMessageData: (award: Award) => ({
      award_number: award.award_number,
      alert_type: AlertType.CHECKLIST,
      name: ADMIN_NAME as string,
      email: ADMIN_EMAIL as string,
      message: `Award is missing ACURO and OHRO checklists: ${award.award_number}`,
      created_at: timestamp(),
    }),
  },
};
