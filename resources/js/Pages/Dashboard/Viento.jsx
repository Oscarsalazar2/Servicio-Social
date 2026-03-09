import React, { useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import TarjetaKpi from "@/Components/Comp/kpi/TarjetaKpi";
import GraficaVelocidadViento from "@/Components/Comp/grafica/GraficaVelocidadViento";
import RosaVientos from "@/Components/Comp/grafica/RosaVientos";
import KpiDireccionViento from "@/Components/Comp/kpi/KpiDireccionViento";

const COLORS = {
    wind: "#FAB12F",
    windDir: "#FA812F",
    vibrationOn: "#F44336",
    vibrationOff: "#4CAF50",
};

export default function Viento() {
    const windSeries = useMemo(() => {
        return Array.from({ length: 24 }).map((_, i) => ({
            t: `${String(i).padStart(2, "0")}:00`,
            vel: Math.max(
                0,
                Math.round(
                    (Math.sin(i / 3) * 8 + 12 + Math.random() * 3) * 10
                ) / 10
            ),
            gust: Math.max(
                0,
                Math.round(
                    (Math.sin(i / 3) * 10 + 18 + Math.random() * 4) * 10
                ) / 10
            ),
            dir: Math.round((i * 15 + 210 + Math.random() * 20) % 360),
        }));
    }, []);

    const windRoseData = useMemo(
        () => [
            { dir: "N", r0_10: 20, r10_20: 2, r20_30: 0, r30_40: 0 },
            { dir: "NE", r0_10: 6, r10_20: 2, r20_30: 0, r30_40: 0 },
            { dir: "E", r0_10: 10, r10_20: 16, r20_30: 0, r30_40: 0 },
            { dir: "SE", r0_10: 12, r10_20: 8, r20_30: 0, r30_40: 0 },
            { dir: "S", r0_10: 25, r10_20: 6, r20_30: 2, r30_40: 4 },
            { dir: "SW", r0_10: 18, r10_20: 0, r20_30: 5, r30_40: 0 },
            { dir: "W", r0_10: 3, r10_20: 0, r20_30: 0, r30_40: 0 },
            { dir: "NW", r0_10: 2, r10_20: 0, r20_30: 0, r30_40: 0 },
        ],
        []
    );

    const last = windSeries[windSeries.length - 1];

    const vibrationDetected = useMemo(() => Math.random() >= 0.5, []);

    const vibrationStatus = useMemo(() => {
        return vibrationDetected
            ? "Con vibracion"
            : "Sin vibración";
    }, [vibrationDetected]);

    const kpi = {
        windSpeed: last.vel,
        windGust: last.gust,
        windDir: last.dir,
        vibration: vibrationStatus,
        updated: "15/12/2025 20:00",
    };

    

    return (
        <AuthenticatedLayout>
            <Head title="Viento" />

            <div className="min-h-screen bg-gray-100 dark:bg-[#071024]">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* KPIs */}
                        <div className="lg:col-span-4 space-y-4">
                            <TarjetaKpi
                                title="Velocidad del viento"
                                value={kpi.windSpeed}
                                unit="km/h"
                                color={COLORS.wind}
                                subtitle={`Actualizado: ${kpi.updated}`}
                            />
                            <TarjetaKpi
                                title="Racha de viento"
                                value={kpi.windGust}
                                unit="km/h"
                                color={COLORS.wind}
                                subtitle={`Actualizado: ${kpi.updated}`}
                            />
                            <TarjetaKpi
                                title="Vibración"
                                value={kpi.vibration}
                                unit=""
                                color={
                                    vibrationDetected
                                        ? COLORS.vibrationOn
                                        : COLORS.vibrationOff
                                }
                                subtitle={`Actualizado: ${kpi.updated}`}
                            />

                            {/* Dirección como KPI compuesto (brújula + grados) */}
                            <KpiDireccionViento
                                deg={kpi.windDir}
                                accent={COLORS.windDir}
                            />
                        </div>

                        {/* Gráficas */}
                        <div className="lg:col-span-8 space-y-6">
                            <GraficaVelocidadViento data={windSeries} />
                            <RosaVientos data={windRoseData} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
