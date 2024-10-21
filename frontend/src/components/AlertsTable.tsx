"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert } from "@/types";
import { getAlerts } from "@/lib/getAlerts";
import { socket } from "@/lib/socket";
import updateAlertsWithNewAlert from "@/lib/updateAlertsFromChangeStreamDoc";

export function AlertsTable() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Fetch alerts on mount and update the table
  useEffect(() => {
    getAlerts().then((newAlerts) => {
      setAlerts(newAlerts);
    });
  }, []);

  // Listen for new alerts and add to the table
  useEffect(() => {
    socket.on("new-alert", (newAlert) => {
      setAlerts((prevAlerts) => {
        const newAlerts = updateAlertsWithNewAlert(newAlert, prevAlerts);
        return newAlerts;
      });
    });

    return () => {
      socket.off("new-alert");
    };
  }, []);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead className="w-[100px]">Award Number</TableHead>
          <TableHead>Alert Type</TableHead>
          <TableHead>Alert Sent At</TableHead>
          <TableHead>Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {alerts.map((alert) => (
          <TableRow key={alert._id}>
            <TableCell className="font-medium">{alert._id}</TableCell>
            <TableCell>{alert.award_number}</TableCell>
            <TableCell>{alert.alert_type}</TableCell>
            <TableCell>{alert.alert_sent_at as string}</TableCell>
            <TableCell>{alert.created_at}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
