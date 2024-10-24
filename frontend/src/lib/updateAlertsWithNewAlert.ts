import { Alert } from "@/types";
import { OperationType, AlertChange } from "@/types";

export default function updateAlertsWithNewAlert(
  change: AlertChange,
  alerts: Alert[]
) {
  console.log("updateAlertsWithNewAlert: change:", change);

  const newAlertId = change.new.id;

  switch (change.operationType) {
    case OperationType.INSERT:
      return [change.new, ...alerts];
    case OperationType.UPDATE:
      return alerts.map((alert) => {
        // if the id matches the id of the new alert, return the new alert
        return newAlertId === alert.id ? change.new : alert;
      });
    default:
      return alerts;
  }
}
