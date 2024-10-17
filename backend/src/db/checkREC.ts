import { type Award } from "../types/Award";
import sendMessage from "../utils/send-message";

export default async function checkREC(award: Award) {
  if (!isRECSubmitted(award)) {
    // send message to RabbitMQ
    sendMessage({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      message: `Award is missing REC submission: ${award.award_number}`,
      timestamp: new Date().toISOString(),
    });
  }
}

export function isRECSubmitted(award: Award) {
  return award.award_number && award.rec_submitted;
}
