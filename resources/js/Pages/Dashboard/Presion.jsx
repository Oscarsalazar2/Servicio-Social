import React, { useEffect, useMemo, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import TarjetaKpi from "@/Components/Comp/kpi/TarjetaKpi";
import GraficaPresion from "@/Components/Comp/grafica/GraficaPresion";
import { fetchLecturas } from "@/lib/lecturasApi";

const COLORS = {
    presion: "#FF6B6B",
    presionBarometrica: "#9B59B6",
};

export default function Clima() {
    const [lecturas, setLecturas] = useState([]);

    useEffect(() => {
        let active = true;

        const loadLecturas = async () => {
            try {
                const { series } = await fetchLecturas(24);
                if (active) {
                    setLecturas(series);
                }
            } catch {
                if (active) {
                    setLecturas([]);
                }
            }
        };

        loadLecturas();
        const timer = window.setInterval(loadLecturas, 5000);

        return () => {
            active = false;
            window.clearInterval(timer);
        };
    }, []);

    const { climaSeries, tendenciaBarometrica, estadoBarometrico } = useMemo(() => {
        const series = lecturas.map((item) => ({
            t: item.t,
            presion: item.pres,
            presionBarometrica: Math.round((item.pres * 0.750062) * 100) / 100,
        }));

        const actual = series[series.length - 1]?.presion ?? 0;
        const anterior = series[Math.max(series.length - 4, 0)]?.presion ?? actual;
        const tendencia = Math.round((actual - anterior) * 10) / 10;

        let estado = "Estable";
        if (tendencia > 0.5) estado = "Subiendo";
        if (tendencia < -0.5) estado = "Bajando";

        return {
            climaSeries: series,
            tendenciaBarometrica: tendencia,
            estadoBarometrico: estado,
        };
    }, [lecturas]);

    const last = climaSeries[climaSeries.length - 1] ?? {
        presion: 0,
        presionBarometrica: 0,
    };
    const ultimaLectura = lecturas[lecturas.length - 1] ?? null;

    const kpi = {
        presion: last.presion,
        presionBarometrica: last.presionBarometrica,
        tendenciaBarometrica,
        estadoBarometrico,
        updated: new Date(
            ultimaLectura?.received_at ?? Date.now(),
        ).toLocaleString("es-MX", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }),
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
