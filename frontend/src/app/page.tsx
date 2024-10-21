"use server";

import { AlertsTable } from "@/components/AlertsTable";
import { getAlerts } from "@/lib/getAlerts";

export default async function Home() {
  const alerts = await getAlerts();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-3xl font-bold">Award Alerts</h1>
        <section>
          <AlertsTable initialAlerts={alerts} />
        </section>
      </main>
    </div>
  );
}
