import React, { useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import TarjetaKpi from "@/Components/Comp/kpi/TarjetaKpi";
import GraficaTemperatura from "@/Components/Comp/grafica/GraficaTemperatura";

const COLORS = {
    temp: "#6E8CFB",
    tempAlt: "#00B7B5",
    hum: "#018790",
    dewPoint: "#3B82F6",
    rain: "#2563EB",
};

const calcDewPoint = (tempC, rh) => {
    const a = 17.62;
    const b = 243.12;
    const rhSafe = Math.min(100, Math.max(1, rh));
    const gamma = Math.log(rhSafe / 100) + (a * tempC) / (b + tempC);
    return Math.round(((b * gamma) / (a - gamma)) * 10) / 10;
};

export default function Temperatura() {
    const thSeries = useMemo(() => {
        return Array.from({ length: 24 }).map((_, i) => {
            const temp =
                Math.round((Math.sin(i / 4) * 4 + 2 + Math.random() * 0.7) * 10) /
                10;
            const hum =
                Math.round((Math.cos(i / 5) * 18 + 65 + Math.random() * 3) * 10) /
                10;
            const rain =
                Math.round(
                    Math.max(0, Math.sin(i / 3) * 1.8 + Math.random() * 1.2) * 10
                ) / 10;
            return {
                t: `${String(i).padStart(2, "0")}:00`,
                temp,
                hum,
                rain,
                dewPoint: calcDewPoint(temp, hum),
            };
        });
    }, []);

    const last = thSeries[thSeries.length - 1];
    const temps = thSeries.map((s) => s.temp);
    const totalRain =Math.round(thSeries.reduce((acc, s) => acc + s.rain, 0) * 10) / 10;
    const minTemp = Math.round(Math.min(...temps) * 10) / 10;
    const maxTemp = Math.round(Math.max(...temps) * 10) / 10;
    const kpi = {
        temp: last.temp,
        hum: last.hum,
        dewPoint: last.dewPoint,
        rainAccumulated: totalRain,
        rainRate: last.rain,
        feels: Math.round((last.temp - (100 - last.hum) / 8) * 10) / 10,
        minTemp,
        maxTemp,
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
                            <TarjetaKpi
                                title="Temperatura"
                                extra={kpi.minTemp !== kpi.maxTemp? `${kpi.minTemp}°C / ${kpi.maxTemp}°C`: null}
                                value={kpi.temp}
                                unit="°C"
                                color={COLORS.temp}
                                subtitle={`Actualizado: ${kpi.updated}`}
                                icon=""
                            />
                            <TarjetaKpi
                                title="Sensación térmica"
                                value={kpi.feels}
                                unit="°C"
                                color={COLORS.tempAlt}
                                subtitle={`Actualizado: ${kpi.updated}`}
                                icon=""
                            />
                            <TarjetaKpi
                                title="Humedad"
                                value={kpi.hum}
                                unit="%"
                                color={COLORS.hum}
                                subtitle={`Actualizado: ${kpi.updated}`}
                                icon=""
                            />
                            <TarjetaKpi
                                title="Precipitacion acumulada"
                                value={kpi.rainAccumulated}
                                unit="mm"
                                color={COLORS.rain}
                                subtitle={`Ultimas 24h  ${kpi.updated}`}
                                icon=""
                            />
                            <TarjetaKpi
                                title="Tasa de precipitacion"
                                value={kpi.rainRate}
                                unit="mm/h"
                                color={COLORS.rain}
                                subtitle={`Actualizado: ${kpi.updated}`}
                                icon=""
                            />
                            <TarjetaKpi
                                title="Punto de rocio"
                                value={kpi.dewPoint}
                                unit="°C"
                                color={COLORS.dewPoint}
                                subtitle={`Actualizado: ${kpi.updated}`}
                                icon=""
                            />
                        </div>

                        {/* Gráfica */}
                        <div className="lg:col-span-8 space-y-6">
                            <GraficaTemperatura
                                data={thSeries}
                                colors={{ temp: COLORS.temp, hum: COLORS.hum}}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}


