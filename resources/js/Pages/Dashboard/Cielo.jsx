import React, { useEffect, useMemo, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import TarjetaKpi from "@/Components/Comp/kpi/TarjetaKpi";
import RadiacionSolarGauge from "@/Components/Comp/grafica/RadiacionSolarGauge";
import GraficaNubes from "@/Components/Comp/grafica/GraficaNubes";
import GraficaNubes2 from "@/Components/Comp/grafica/GraficaNubes2";
import { fetchLecturas } from "@/lib/lecturasApi";


const COLORS = {
    temp: "#6E8CFB",
    hum: "#00B7B5",
    wind: "#018790",
    solar: "#FFB84D",
    cloudHeight: "#9B59B6",
};

// Fórmula para calcular radiación solar (W/m²)
const calcularRadiacionSolar = () => {
    // Datos random entre 0 y 950 W/m²
    return Math.round(Math.random() * 950 * 10) / 10;
};

const calcularIndiceUV = (solar) => {
    // Índice UV aproximado: UV = Solar / 250
    const uv = solar / 250;
    return Math.round(uv * 10) / 10;
}

// Fórmula para calcular punto de rocío (°C)
// Aproximación simple basada en temperatura y humedad
const calcularPuntoDeRocio = (temp, humedad) => {
    // Fórmula aproximada: Td = T - ((100 - HR) / 5)
    const td = temp - (100 - humedad) / 5;
    return Math.round(td * 10) / 10;
};

// Fórmula para calcular altura base de nubes (m)
// Altura ≈ 125 × (T - Td)
const calcularAlturaDeNubes = (temp, humedad) => {
    const puntodeRocio = calcularPuntoDeRocio(temp, humedad);
    const altura = 125 * (temp - puntodeRocio);
    return Math.round(Math.max(0, altura) * 10) / 10;
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

    const climaSeries = useMemo(() => {
        return lecturas.map((item) => {
            const solar = item.rs;
            const temp = item.temp;
            const hum = item.hum;
            return {
                t: item.t,
                temp: temp,
                hum: hum,
                solar: solar,
                uv: calcularIndiceUV(solar),
                cloudHeight: calcularAlturaDeNubes(temp, hum),
            };
        });
    }, [lecturas]);

    const last = climaSeries[climaSeries.length - 1] ?? {
        temp: 0,
        hum: 0,
        solar: 0,
        uv: 0,
        cloudHeight: 0,
    };
    const ultimaLectura = lecturas[lecturas.length - 1] ?? null;

    const kpi = {
        temp: last.temp,
        hum: last.hum,
        solar: last.solar,
        uv: last.uv,
        cloudHeight: last.cloudHeight,
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
            <Head title="Clima" />

            <div className="min-h-screen bg-gray-100 dark:bg-[#071024]">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* KPIs */}
                        <div className="lg:col-span-4 space-y-4">
                            <TarjetaKpi
                                title="Radiación Solar"
                                value={kpi.solar}
                                unit="W/m²"
                                color={COLORS.solar}
                            />
                            <TarjetaKpi
                                title="Indice UV"
                                value={kpi.uv}
                                unit="UV"
                                color={COLORS.hum}
                            />
                            <TarjetaKpi
                                title="Altura de Nubes"
                                value={kpi.cloudHeight}
                                unit="m"
                                color={COLORS.cloudHeight}
                            />
                            <div className="lg:col-span-8">
                                <div className="h-72 bg-gray-50 border border-gray-200 dark:bg-slate-900/40 dark:border-white/10 rounded-lg shadow p-6">
                                    <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">
                                        Radiación Solar
                                    </h3>
                                    <RadiacionSolarGauge
                                        value={kpi.solar}
                                        series={climaSeries}
                                        colors={COLORS}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Gráfica */}
                        <div className="lg:col-span-8">
                            <div className="min-h-screen bg-gray-100 dark:bg-[#071024]">
                                <div className="bg-gray-50 border border-gray-200 dark:bg-slate-900/40 dark:border-white/10 rounded-lg shadow p-6">
                                    <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">
                                        Gráfica de Nubes
                                    </h3>
                                    <GraficaNubes2
                                        series={climaSeries}
                                        colors={COLORS}
                                        height={240}
                                    />
                                </div>
                            </div> 
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
