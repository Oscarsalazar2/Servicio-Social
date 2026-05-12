import React, { useEffect, useMemo, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import TarjetaKpi from "@/Components/Comp/kpi/TarjetaKpi";
import GraficaVelocidadViento from "@/Components/Comp/grafica/GraficaVelocidadViento";
import RosaVientos from "@/Components/Comp/grafica/RosaVientos";
import KpiDireccionViento from "@/Components/Comp/kpi/KpiDireccionViento";
import { fetchLecturas } from "@/lib/lecturasApi";

const COLORS = {
    wind: "#FAB12F",
    windDir: "#FA812F",
    vibrationOn: "#F44336",
    vibrationOff: "#4CAF50",
    soundOn: "#F44336",
    soundOff: "#4CAF50",
};

export default function Viento() {
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

    const windSeries = useMemo(
        () =>
            lecturas.map((item) => ({
                t: item.t,
                vel: item.viento,
                gust: item.viento,
                dir: item.dir,
            })),
        [lecturas],
    );

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
        [],
    );

    const last = windSeries[windSeries.length - 1] ?? {
        vel: 0,
        gust: 0,
        dir: 0,
    };
    const ultimaLectura = lecturas[lecturas.length - 1] ?? null;

    const soundDetected = (ultimaLectura?.sonido ?? 0) === 1;

    const soundStatus = useMemo(() => {
        return soundDetected ? "Con sonido" : "Sin sonido";
    }, [soundDetected]);

    const vibrationDetected = (ultimaLectura?.vibracion ?? 0) === 1;

    const vibrationStatus = useMemo(() => {
        return vibrationDetected ? "Con vibración" : "Sin vibración";
    }, [vibrationDetected]);

    const kpi = {
        windSpeed: last.vel,
        windGust: last.gust,
        windDir: last.dir,
        vibration: vibrationStatus,
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

                            <TarjetaKpi
                                title="Sonido"
                                value={soundStatus}
                                unit=""
                                color={
                                    soundDetected
                                        ? COLORS.soundOn
                                        : COLORS.soundOff
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
