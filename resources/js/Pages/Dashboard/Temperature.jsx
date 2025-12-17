import React, { useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import KpiCard from "@/Components/Comp/KpiCard";
import TemperatureChart from "@/Components/Comp/TemperatureChart";

const COLORS = {
  temp: "#6E8CFB",
  tempAlt: "#00B7B5",
  hum: "#018790",
};

export default function Temperature() {
  const thSeries = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      t: `${String(i).padStart(2, "0")}:00`,
      temp: Math.round((Math.sin(i / 4) * 4 + 2 + Math.random() * 0.7) * 10) / 10,
      hum: Math.round((Math.cos(i / 5) * 18 + 65 + Math.random() * 3) * 10) / 10,
    }));
  }, []);

  const last = thSeries[thSeries.length - 1];

  const kpi = {
    temp: last.temp,
    hum: last.hum,
    feels: Math.round((last.temp - (100 - last.hum) / 8) * 10) / 10,
    updated: "15/12/2025 20:00",
  };

  return (
    <AuthenticatedLayout>
      <Head title="Temperatura" />

      <div className="min-h-screen bg-gray-100 dark:bg-[#071024]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* KPIs */}
            <div className="lg:col-span-4 space-y-4">
              <KpiCard
                title="Temperatura"
                value={kpi.temp}
                unit="°C"
                color={COLORS.temp}
                subtitle={`Actualizado: ${kpi.updated}`}
                icon=""
              />
              <KpiCard
                title="Humedad"
                value={kpi.hum}
                unit="%"
                color={COLORS.hum}
                subtitle={`Actualizado: ${kpi.updated}`}
                icon=""
              />
              <KpiCard
                title="Sensación térmica"
                value={kpi.feels}
                unit="°C"
                color={COLORS.tempAlt}
                subtitle={`Actualizado: ${kpi.updated}`}
                icon=""
              />
            </div>

            {/* Gráfica */}
            <div className="lg:col-span-8 space-y-6">
              <TemperatureChart data={thSeries} colors={{ temp: COLORS.temp, hum: COLORS.hum }} />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
