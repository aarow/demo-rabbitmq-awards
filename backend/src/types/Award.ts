export enum AwardHealthColorCode {
  BLUE = "BLUE",
  RED = "RED",
  // Add other colors as needed
}

export type Award = {
  log_no: string;
  award_number: string;
  acuro_checklist_submitted: boolean;
  ohro_checklist_submitted: boolean;
  rec_submitted: boolean;
  award_health_color_code: AwardHealthColorCode;
};
