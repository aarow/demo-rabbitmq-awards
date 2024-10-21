import { Alert } from "@/types";
import { ChangeStreamDocument, ChangeStreamDocumentKey } from "mongodb";

export type ChangeStreamDocumentWithDocumentKey = ChangeStreamDocument &
  ChangeStreamDocumentKey<Partial<Alert>>;

export default function updateAlertsFromChangeStreamDoc(
  changeStreamDoc: ChangeStreamDocumentWithDocumentKey,
  alerts: Alert[]
) {
  const newAlertId = changeStreamDoc.documentKey._id as unknown as string;

  switch (changeStreamDoc.operationType) {
    case "insert":
      // append new alert in alerts array
      const isDuplicateAlert = alerts.some((alert) => alert._id === newAlertId);
      return isDuplicateAlert
        ? alerts
        : [...alerts, changeStreamDoc.fullDocument as Alert];
    case "update":
      // update existing alert in alerts array
      return alerts.map((alert) => {
        if (newAlertId === alert._id) {
          return {
            ...alert,
            ...changeStreamDoc.updateDescription.updatedFields,
          };
        }
        return alert;
      });
    default:
      return alerts;
  }
}
