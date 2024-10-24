export enum AlertType {
  CHECKLIST = "CHECKLIST_COMPLETION",
  REC = "REC_SUBMISSION",
  HEALTH_COLOR_CODE = "HEALTH_COLOR_CODE_SELECTION",
}

export type Alert = {
  award_number: string;
  alert_type: AlertType;
  alert_sent_at: string | null;
  created_at: string;
  _id: string;
};
