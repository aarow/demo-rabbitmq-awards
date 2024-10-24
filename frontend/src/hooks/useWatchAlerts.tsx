// new hook for updating alerts
import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { Alert } from "../types";
import updateAlertsWithNewAlert, {
  AlertChange,
} from "@/lib/updateAlertsWithNewAlert";

export function useWatchAlerts(initialAlerts: Alert[]) {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);

  // Listen for new alerts and add to the table
  useEffect(() => {
    socket.on("new-alert", (change: AlertChange) => {
      setAlerts((prevAlerts) => {
        const newAlerts = updateAlertsWithNewAlert(change, prevAlerts);
        return newAlerts;
      });
    });

    return () => {
      socket.off("new-alert");
    };
  }, []);

  return alerts;
}
