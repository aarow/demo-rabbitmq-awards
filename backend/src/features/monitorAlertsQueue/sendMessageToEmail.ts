import { Alert } from "@/types";

export async function sendMessageToEmail(alert: Partial<Alert>) {
  console.log("sending email:\n", alert);
}
