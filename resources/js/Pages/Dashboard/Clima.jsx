import React, { useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import TarjetaKpi from "@/Components/Comp/kpi/TarjetaKpi";
import GraficaTemperatura from "@/Components/Comp/grafica/GraficaTemperatura";

const COLORS = {
    temp: "#6E8CFB",
    hum: "#00B7B5",
    wind: "#018790",
};

export default function Clima() {
    const climaSeries = useMemo(() => {
        return Array.from({ length: 24 }).map((_, i) => ({
            t: `${String(i).padStart(2, "0")}:00`,
            temp:
                Math.round(
                    (Math.sin(i / 4) * 4 + 2 + Math.random() * 0.7) * 10
                ) / 10,
            hum:
                Math.round(
                    (Math.cos(i / 5) * 18 + 65 + Math.random() * 3) * 10
                ) / 10,
            wind:
                Math.round(
                    (Math.sin(i / 3) * 5 + 10 + Math.random() * 2) * 10
                ) / 10,
        }));
    }, []);

    const last = climaSeries[climaSeries.length - 1];

    const kpi = {
        temp: last.temp,
        hum: last.hum,
        wind: last.wind,
        updated: "15/12/2025 20:00",
    };

    return (
        <AuthenticatedLayout>
            <Head title="Clima" />

            <div className="min-h-screen bg-gray-100 dark:bg-[#071024]">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* KPIs */}
                        <div className="lg:col-span-4 space-y-4">
                            <TarjetaKpi
                                title="Temperatura"
                                value={kpi.temp}
                                unit="°C"
                                color={COLORS.temp}
                            />
                            <TarjetaKpi
                                title="Humedad"
                                value={kpi.hum}
                                unit="%"
                                color={COLORS.hum}
                            />
                            <TarjetaKpi
                                title="Viento"
                                value={kpi.wind}
                                unit="km/h"
                                color={COLORS.wind}
                            />
                        </div>

                        {/* Gráfica */}
                        <div className="lg:col-span-8">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Condiciones Climáticas
                                </h3>
                                <GraficaTemperatura
                                    series={climaSeries}
                                    colors={COLORS}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}