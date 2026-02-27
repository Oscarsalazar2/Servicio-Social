import React, { useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import TarjetaKpi from "@/Components/Comp/kpi/TarjetaKpi";
import GraficaTemperatura from "@/Components/Comp/grafica/GraficaTemperatura";
import RadiacionSolarGauge from "@/Components/Comp/grafica/RadiacionSolarGauge";
import GraficaPresion from "@/Components/Comp/grafica/GraficaPresion";

const COLORS = {
    presion: "#FF6B6B",
    presionBarometrica: "#9B59B6",
};

export default function Clima() {
    const { climaSeries, tendenciaBarometrica, estadoBarometrico } = useMemo(() => {
        const series = Array.from({ length: 24 }).map((_, i) => ({
            t: `${String(i).padStart(2, "0")}:00`,
            presion:
                Math.round(
                    (Math.cos(i / 6) * 8 + Math.sin(i / 4) * 6 + 1013 + Math.random() * 4) * 10
                ) / 10,
            presionBarometrica:
                Math.round(
                    (Math.sin(i / 4) * 12 + Math.cos(i / 5) * 8 + 760 + Math.random() * 3.5) * 100
                ) / 100,
        }));

        const actual = series[series.length - 1].presion;
        const anterior = series[Math.max(series.length - 4, 0)].presion;
        const tendencia = Math.round((actual - anterior) * 10) / 10;

        let estado = "Estable";
        if (tendencia > 0.5) estado = "Subiendo";
        if (tendencia < -0.5) estado = "Bajando";

        return {
            climaSeries: series,
            tendenciaBarometrica: tendencia,
            estadoBarometrico: estado,
        };
    }, []);

    const last = climaSeries[climaSeries.length - 1];

    const kpi = {
        presion: last.presion,
        presionBarometrica: last.presionBarometrica,
        tendenciaBarometrica,
        estadoBarometrico,
        updated: "15/12/2025 20:00",
    };

    return (
        <AuthenticatedLayout>
            <Head title="Presion" />
            <div className="min-h-screen bg-gray-100 dark:bg-[#071024]">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* KPIs */}
                        <div className="lg:col-span-4 space-y-4">
                            <TarjetaKpi
                                title="Presión Atmosférica"
                                value={kpi.presion}
                                unit="hPa"
                                color={COLORS.presion}
                            />
                            <TarjetaKpi
                                title="Presión Barométrica"
                                extra={`${kpi.estadoBarometrico} (${kpi.tendenciaBarometrica > 0 ? "+" : ""}${kpi.tendenciaBarometrica} hPa/3h)`}
                                value={kpi.presionBarometrica}
                                unit="mmHg"
                                color={COLORS.presionBarometrica}
                            />
                            <div className="lg:col-span-8">
                            
                        </div>
                    </div>

                        {/* Gráfica */}
                        <div className="lg:col-span-8 space-y-6">
                                <GraficaPresion
                                    data={climaSeries}
                                    colors={COLORS}
                                />

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
