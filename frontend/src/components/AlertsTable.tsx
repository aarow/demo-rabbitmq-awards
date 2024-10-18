"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

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

const getAlerts = async () => {
  const res = await fetch("/api/mongo");
  const data = await res.json();
  console.log(data);
  return data;
};

export function AlertsTable() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    getAlerts().then((alerts) => {
      setAlerts(alerts);
    });
  }, []);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead className="w-[100px]">Award Number</TableHead>
          <TableHead>Alert Type</TableHead>
          <TableHead>Alert Sent</TableHead>
          <TableHead>Timestamp</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {alerts.map((alert) => (
          <TableRow key={alert._id}>
            <TableCell className="font-medium">{alert._id}</TableCell>
            <TableCell>{alert.award_number}</TableCell>
            <TableCell>{alert.alert_type}</TableCell>
            <TableCell>{alert.alert_sent.toString()}</TableCell>
            <TableCell>{alert.timestamp}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
