"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert } from "@/types";
import { useWatchAlerts } from "@/hooks";

interface AlertsTableProps {
  initialAlerts: Alert[];
}

export function AlertsTable({ initialAlerts }: AlertsTableProps) {
  const alerts = useWatchAlerts(initialAlerts);

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
