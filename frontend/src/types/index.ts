export enum AlertType {
  CHECKLIST = "CHECKLIST_COMPLETION",
  REC = "REC_SUBMISSION",
}

export type Alert = {
  award_number: string;
  alert_type: AlertType;
  alert_sent: boolean;
  timestamp: string;
  _id: string;
};
