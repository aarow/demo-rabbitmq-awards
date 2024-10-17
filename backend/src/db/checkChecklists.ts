import { type Award } from "../types/Award";
import sendMessage from "../utils/send-message";

export default async function checkChecklists(award: Award) {
  if (!isChecklistSubmitted(award)) {
    // send message to RabbitMQ
    sendMessage({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      message: `Award is missing ACURO or OHRO checklist: ${award.award_number}`,
      timestamp: new Date().toISOString(),
    });
  }
}

export function isChecklistSubmitted(award: Award) {
  return (
    award.award_number &&
    (award.acuro_checklist_submitted || award.ohro_checklist_submitted)
  );
}
