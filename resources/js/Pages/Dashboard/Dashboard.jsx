import React, { useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import TarjetaKpi from "@/Components/Comp/kpi/TarjetaKpi";
import GraficaVelocidadViento from "@/Components/Comp/grafica/GraficaVelocidadViento";
import RosaVientos from "@/Components/Comp/grafica/RosaVientos";
import GraficaTemperatura from "@/Components/Comp/grafica/GraficaTemperatura";
import KpiDireccionViento from "@/Components/Comp/kpi/KpiDireccionViento";

const COLORS = {
    temp: "#6E8CFB",
    tempAlt: "#00B7B5",
    hum: "#018790",
    wind: "#FAB12F",
    windDir: "#FA812F",
};

export default function Dashboard() {

    // DEMO DATA

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

    const thSeries = useMemo(() => {
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
        }));
    }, []);

    const windRoseData = useMemo(
        () => [
            { angle: 0, dir: "N", r0_10: 20, r10_20: 2, r20_30: 0, r30_40: 0 },
            { angle: 45, dir: "NE", r0_10: 6, r10_20: 2, r20_30: 0, r30_40: 0 },
            {
                angle: 90,
                dir: "E",
                r0_10: 10,
                r10_20: 16,
                r20_30: 0,
                r30_40: 0,
            },
            {
                angle: 135,
                dir: "SE",
                r0_10: 12,
                r10_20: 8,
                r20_30: 0,
                r30_40: 0,
            },
            {
                angle: 180,
                dir: "S",
                r0_10: 25,
                r10_20: 6,
                r20_30: 2,
                r30_40: 4,
            },
            {
                angle: 225,
                dir: "SW",
                r0_10: 18,
                r10_20: 0,
                r20_30: 5,
                r30_40: 0,
            },
            { angle: 270, dir: "W", r0_10: 3, r10_20: 0, r20_30: 0, r30_40: 0 },
            {
                angle: 315,
                dir: "NW",
                r0_10: 2,
                r10_20: 0,
                r20_30: 0,
                r30_40: 0,
            },
        ],
        []
    );

    // KPIs


    const lastWind = windSeries[windSeries.length - 1];
    const lastTH = thSeries[thSeries.length - 1];

    const windKpi = {
        speed: lastWind.vel,
        gust: lastWind.gust,
        dir: lastWind.dir,
    };

    const tempKpi = {
        temp: lastTH.temp,
        hum: lastTH.hum,
        feels: Math.round((lastTH.temp - (100 - lastTH.hum) / 8) * 10) / 10,
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="min-h-screen bg-gray-100 dark:bg-[#071024]">
                <div className="max-w-7xl mx-auto px-4 py-8 space-y-14">
                    {/* VIENTO */}
                    <section className="space-y-6">
                        <div className="text-gray-900 dark:text-white font-extrabold text-lg">
                            Viento
                        </div>

                        {/* KPIs + Gráfica */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            <div className="lg:col-span-4 space-y-4">
                                <TarjetaKpi
                                    title="Velocidad del viento"
                                    value={windKpi.speed}
                                    unit="km/h"
                                    color={COLORS.wind}

                                />
                                <TarjetaKpi
                                    title="Racha de viento"
                                    value={windKpi.gust}
                                    unit="km/h"
                                    color={COLORS.wind}
                                />

                                {/* KPI compuesto: brújula + grados */}
                                <KpiDireccionViento deg={windKpi.dir} />
                            </div>

                            <div className="lg:col-span-8">
                                <GraficaVelocidadViento data={windSeries} />
                            </div>
                        </div>

                        {/* Rosa (ya no hace falta brújula aquí porque está en el KPI) */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            <div className="lg:col-span-12">
                                <RosaVientos data={windRoseData} />
                            </div>
                        </div>
                    </section>

                    {/* TEMPERATURA */}
                    <section className="space-y-6">
                        <div className="text-gray-900 dark:text-white font-extrabold text-lg">
                            Temperatura
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            <div className="lg:col-span-4 space-y-4">
                                <TarjetaKpi
                                    title="Temperatura"
                                    value={tempKpi.temp}
                                    unit="°C"
                                    color={COLORS.temp}

                                />
                                <TarjetaKpi
                                    title="Humedad"
                                    value={tempKpi.hum}
                                    unit="%"
                                    color={COLORS.hum}

                                />
                                <TarjetaKpi
                                    title="Sensación térmica"
                                    value={tempKpi.feels}
                                    unit="°C"
                                    color={COLORS.tempAlt}

                                />
                            </div>

                            <div className="lg:col-span-8">
                                <GraficaTemperatura
                                    data={thSeries}
                                    colors={{
                                        temp: COLORS.temp,
                                        hum: COLORS.hum,
                                    }}
                                />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
