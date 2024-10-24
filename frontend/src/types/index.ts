export enum AlertType {
  CHECKLIST = "CHECKLIST_COMPLETION",
  REC = "REC_SUBMISSION",
}

export type Alert = {
  award_number: string;
  alert_type: AlertType;
  alert_sent_at: string | null;
  created_at: string;
  id: string;
  inactive_at: string | null;
};

export enum OperationType {
  UPDATE = "UPDATE",
  INSERT = "INSERT",
}

export type AlertChange = {
  operationType: OperationType;
  new: Alert;
  old: Alert;
};
