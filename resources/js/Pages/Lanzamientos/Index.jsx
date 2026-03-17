import React, { useMemo, useState } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const COLORES = {
    temp: "#6E8CFB",
    tempAlt: "#00B7B5",
    hum: "#018790",
    wind: "#FAB12F",
    presion: "#FF6B6B",
    optimo: "#4CAF50",
    no_recomendable: "#F44336",
    aceptable: "#FF9800",
};

function KpiCard({ title, value, unit, subtitle, color }) {
    return (
        <div className="rounded-2xl shadow-sm border p-4 bg-white dark:bg-slate-900 dark:border-white/10">
            <div className="text-sm font-medium text-slate-500 dark:text-slate-300">
                {title}
            </div>
            <div className="mt-2 flex items-baseline gap-2">
                <div
                    className="text-2xl font-extrabold text-slate-900 dark:text-slate-100"
                    style={color ? { color } : undefined}
                >
                    {value}
                </div>
                <div className="text-sm font-semibold text-slate-500 dark:text-slate-300">
                    {unit}
                </div>
            </div>
            {subtitle ? (
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-300">
                    {subtitle}
                </div>
            ) : null}
        </div>
    );
}

function Modal({ open, onClose, title, children, maxWidthClass = "max-w-lg" }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div
                className={`relative w-full ${maxWidthClass} rounded-2xl bg-white dark:bg-slate-900 border dark:border-white/10 p-5 shadow-xl`}
            >
                <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        {title}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    >
                        ✕
                    </button>
                </div>
                <div className="mt-4">{children}</div>
            </div>
        </div>
    );
}

export default function PetIndex() {
    const user = usePage().props.auth.user;

    // Seguridad extra en UI (backend ya lo protege)
    {
        /*console.log("ROL DEL USUARIO:", user?.role);
    if (user?.role !== "admin") {
        return (
            <AuthenticatedLayout
                header={<h2 className="font-semibold text-xl">PET</h2>}
            >
                <Head title="PET" />
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="rounded-2xl border bg-white dark:bg-slate-900 dark:border-white/10 p-6">
                        No autorizado.
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }*/
    }

    const [openAdd, setOpenAdd] = useState(false);
    const [openNuevoLanzamiento, setOpenNuevoLanzamiento] = useState(false);
    const [openDetalle, setOpenDetalle] = useState(false);
    const [registroSeleccionado, setRegistroSeleccionado] = useState(null);

    const serieViento = useMemo(() => {
        return Array.from({ length: 24 }).map((_, i) => ({
            t: `${String(i).padStart(2, "0")}:00`,
            vel: Math.max(
                0,
                Math.round(
                    (Math.sin(i / 3) * 8 + 12 + Math.random() * 3) * 10,
                ) / 10,
            ),
        }));
    }, []);

    const serieTempHum = useMemo(() => {
        return Array.from({ length: 24 }).map((_, i) => ({
            t: `${String(i).padStart(2, "0")}:00`,
            temp:
                Math.round((Math.sin(i / 4) * 4 + 2 + Math.random() * 6) * 10) /
                10,
            hum:
                Math.round(
                    (Math.cos(i / 5) * 18 + 65 + Math.random() * 3) * 10,
                ) / 10,
        }));
    }, []);

    const ultimoViento = serieViento[serieViento.length - 1];
    const ultimaTempHum = serieTempHum[serieTempHum.length - 1];

    const kpiViento = {
        speed: ultimoViento.vel,
    };

    const kpiTemp = {
        temp: ultimaTempHum.temp,
        hum: ultimaTempHum.hum,
        feels:
            Math.round(
                (ultimaTempHum.temp - (100 - ultimaTempHum.hum) / 5) * 10,
            ) / 10,
    };

    const kpiPresion =
        Math.round(
            (1013 +
                Math.cos(serieTempHum.length / 4) * 4 +
                Math.random() * 1.5) *
                10,
        ) / 10;

    const condicionesOptimas = useMemo(() => {
        const vientoIdeal = kpiViento.speed;
        const tempIdeal = kpiTemp.temp;
        const humIdeal = kpiTemp.hum;
        const presionIdeal = kpiPresion;

        {
            /*Ejemplo Optimo */
        }
        {
            /*const vientoIdeal = 6;
        const tempIdeal = 22;
        const humIdeal = 45;
        const presionIdeal = 1015;*/
        }

        {
            /*Ejemplo Aceptable*/
        }
        {
            /*const vientoIdeal = 12;
        const tempIdeal = 32;
        const humIdeal = 70;
        const presionIdeal = 1002;*/
        }

        {
            /*Ejemplo No recomendable*/
        }
        {
            /*const vientoIdeal = 20;
        const tempIdeal = 28;
        const humIdeal = 85;
        const presionIdeal = 990;*/
        }

        if (
            vientoIdeal > 15 ||
            tempIdeal < 5 ||
            tempIdeal > 35 ||
            humIdeal > 85 ||
            presionIdeal < 990
        ) {
            return "No recomendable";
        }

        if (
            vientoIdeal <= 10 &&
            tempIdeal >= 15 &&
            tempIdeal <= 30 &&
            humIdeal >= 30 &&
            humIdeal <= 60 &&
            presionIdeal >= 1005 &&
            presionIdeal <= 1025
        ) {
            return "Óptimo";
        }

        return "Aceptable";
    }, [kpiViento.speed, kpiTemp.temp, kpiTemp.hum, kpiPresion]);

    const colorCondiciones = useMemo(() => {
        const estado = String(condicionesOptimas)
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, "_");

        if (estado === "optimo") return COLORES.optimo;
        if (estado === "aceptable") return COLORES.aceptable;
        return COLORES.no_recomendable;
    }, [condicionesOptimas]);

    // KPIs demo (luego conectas a BD/API)
    const kpi = useMemo(() => {
        const total = 28;
        const exitosos = 21;
        const fallidos = total - exitosos;
        const tasaExito = Math.round((exitosos / total) * 100);

        return {
            total,
            exitosos,
            fallidos,
            tasaExito,
            alturaMax: 83,
            //distanciaMax: 112,
            tiempoVueloMax: 9.6,
            ultimaFecha: "15/12/2025 18:40",
        };
    }, []);

    const registrosDemo = useMemo(
        () => [
            {
                id: 1,
                fecha: "27/02/2026 10:15",

                viento: 68,
                humedad: 23,
                temperatura: 24,
                presion_atm: 1002,
                botella: "2 L",
                presion: 78,
                agua: 650,
                modeloBotella: "Coca-Cola",
                usoBotella: 3,
                altura: 83,
                //distancia: 112,
                resultado: "Éxito",
                condicionesOptimas: "Óptimo",
                descripcion:
                    "Vuelo estable, apertura correcta de paracaídas y recuperación inmediata.",
            },
            {
                id: 2,
                fecha: "27/02/2026 11:30",

                viento: 52,
                humedad: 40,
                temperatura: 32,
                presion_atm: 808,
                botella: "1.5 L",
                presion: 72,
                agua: 600,
                modeloBotella: "Pepsi",
                usoBotella: 1,
                altura: 74,
                //distancia: 95,
                condicionesOptimas: "Aceptable",
                resultado: "Éxito",
                descripcion:
                    "Lanzamiento limpio, ligera deriva por viento lateral.",
            },
            {
                id: 3,
                fecha: "27/02/2026 12:05",

                viento: 80,
                humedad: 18,
                temperatura: 28,
                presion_atm: 990,
                botella: "2 L",
                presion: 80,
                agua: 700,
                modeloBotella: "Sprite",
                usoBotella: 2,
                altura: 58,
                //distancia: 67,
                condicionesOptimas: "No recomendable",
                resultado: "Fallo",
                descripcion:
                    "Pérdida de estabilidad al ascenso y recuperación parcial del cohete.",
            },
            {
                id: 4,
                fecha: "27/02/2026 13:20",

                viento: 45,
                humedad: 30,
                temperatura: 22,
                presion_atm: 1010,
                botella: "2 L",
                presion: 76,
                agua: 620,
                modeloBotella: "Fanta",
                usoBotella: 4,
                altura: 79,
                //distancia: 101,
                condicionesOptimas: "Óptimo",
                resultado: "Éxito",
                descripcion:
                    "Trayectoria alta con aterrizaje suave en zona segura.",
            },
        ],
        [],
    );

    const [formLanzamiento, setFormLanzamiento] = useState({
        fecha: "",
        botella: "2 L",
        presion: "",
        agua: "",
        modeloBotella: "",
        usoBotella: "",
        altura: "",
        //distancia: "",
        resultado: "Éxito",
        descripcion: "",
    });

    const abrirDetalle = (registro) => {
        setRegistroSeleccionado(registro);
        setOpenDetalle(true);
    };

    const cerrarNuevoLanzamiento = () => {
        setOpenNuevoLanzamiento(false);
        setFormLanzamiento({
            fecha: "",
            botella: "2 L",
            presion: "",
            agua: "",
            modeloBotella: "",
            usoBotella: "",
            altura: "",
            //distancia: "",
            resultado: "Éxito",
            descripcion: "",
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between gap-3">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Lanzamientos de cohetes PET
                    </h2>
                </div>
            }
        >
            <Head title="Lanzamiento de cohetes" />

            <div className="max-w-[96rem] mx-auto px-4 py-6 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <div className="col-span-2 lg:col-span-2">
                        <KpiCard
                            title="Parámetro de lanzamientos"
                            value={condicionesOptimas}
                            color={colorCondiciones}
                        />
                    </div>

                    <div>
                        <KpiCard
                            title="Velocidad del viento"
                            value={kpiViento.speed}
                            unit="km/h"
                            color={COLORES.wind}
                        />
                    </div>

                    <div>
                        <KpiCard
                            title="Temperatura"
                            value={kpiTemp.temp}
                            unit="°C"
                            color={COLORES.temp}
                        />
                    </div>

                    <div>
                        <KpiCard
                            title="Humedad"
                            value={kpiTemp.hum}
                            unit="%"
                            color={COLORES.hum}
                        />
                    </div>

                    <div>
                        <KpiCard
                            title="Presión Atmosférica"
                            value={kpiPresion}
                            unit="hPa"
                            color={COLORES.presion}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
                    <div className="xl:col-span-1 space-y-4">
                        <h1 className="block md:hidden text-lg font-bold text-slate-900 dark:text-slate-100">
                            Estadísticas
                        </h1>
                        <div className="grid grid-cols-2 gap-4">
                            <KpiCard
                                title="Lanzamientos"
                                value={kpi.total}
                                unit=""
                                subtitle={`Último: ${kpi.ultimaFecha}`}
                            />
                            <KpiCard
                                title="Altura máxima"
                                value={kpi.alturaMax}
                                unit="m"
                                subtitle="Mejor lanzamiento"
                            />
                            <KpiCard
                                title="Tiempo vuelo máx."
                                value={kpi.tiempoVueloMax}
                                unit="s"
                                subtitle="Despegue → aterrizaje"
                            />
                            <KpiCard
                                title="Tasa de éxito"
                                value={kpi.tasaExito}
                                unit="%"
                                subtitle="Éxitos / Total"
                            />
                            <KpiCard
                                title="Éxitos"
                                value={kpi.exitosos}
                                unit=""
                                subtitle="Recuperación OK"
                            />
                            <KpiCard
                                title="Fallos"
                                value={kpi.fallidos}
                                unit=""
                                subtitle="Explosión / sin paracaídas"
                            />
                        </div>
                    </div>

                    <div className="xl:col-span-3 rounded-2xl shadow-sm border p-4 bg-white dark:bg-slate-900 dark:border-white/10">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="font-bold text-slate-900 dark:text-slate-100">
                                Registros
                            </div>
                            <button
                                type="button"
                                onClick={() => setOpenNuevoLanzamiento(true)}
                                className="w-full sm:w-auto px-3 py-2 rounded-xl text-sm font-semibold bg-[#009688] text-white hover:opacity-90"
                            >
                                Registrar nuevo lanzamiento
                            </button>
                        </div>
                        <div className="scroll-invisible mt-3 overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="text-left border-b border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300">
                                        <th className="py-2 pr-4">Fecha</th>
                                        <th className="py-2 pr-4">
                                            Condiciones climáticas
                                        </th>
                                        {/*<th className="py-2 pr-4">Viento</th>*/}
                                        {/*<th className="py-2 pr-4">Humedad</th>*/}
                                        {/*<th className="py-2 pr-4">Temperatura</th>*/}
                                        {/*<th className="py-2 pr-4">Presión Atm.</th>*/}
                                        <th className="py-2 pr-4">Botella</th>
                                        <th className="py-2 pr-4">
                                            Presión (psi)
                                        </th>
                                        <th className="py-2 pr-4">Agua (ml)</th>
                                        <th className="py-2 pr-4">
                                            Modelo de botella
                                        </th>
                                        <th className="py-2 pr-4">
                                            Uso de botella
                                        </th>
                                        <th className="py-2 pr-4">
                                            Altura (m)
                                        </th>
                                        {/*<th className="py-2 pr-4">Distancia (m)</th>*/}
                                        <th className="py-2 pr-4">Parámetro</th>
                                        <th className="py-2 pr-2">Resultado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {registrosDemo.map((registro) => (
                                        <tr
                                            key={registro.id}
                                            onClick={() =>
                                                abrirDetalle(registro)
                                            }
                                            className="border-b border-slate-100 dark:border-white/5 text-slate-800 dark:text-slate-100 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5"
                                        >
                                            <td className="py-2 pr-4 whitespace-nowrap">
                                                {registro.fecha}
                                            </td>

                                            <td className="py-2 pr-4">
                                                <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 whitespace-nowrap text-xs leading-snug">
                                                    <span className="text-slate-500 dark:text-slate-400">
                                                        Viento
                                                    </span>
                                                    <span>
                                                        {registro.viento} km/h
                                                    </span>
                                                    <span className="text-slate-500 dark:text-slate-400">
                                                        Humedad
                                                    </span>
                                                    <span>
                                                        {registro.humedad}%
                                                    </span>
                                                    <span className="text-slate-500 dark:text-slate-400">
                                                        Temperatura
                                                    </span>
                                                    <span>
                                                        {registro.temperatura}°C
                                                    </span>
                                                    <span className="text-slate-500 dark:text-slate-400">
                                                        Presión Atm.
                                                    </span>
                                                    <span>
                                                        {registro.presion_atm}{" "}
                                                        hPa
                                                    </span>
                                                </div>
                                            </td>
                                            {/*<td className="py-2 pr-4 whitespace-nowrap">
                                            {registro.viento} km/h
                                        </td>
                                        <td className="py-2 pr-4 whitespace-nowrap">
                                            {registro.humedad}%
                                        </td>
                                        <td className="py-2 pr-4 whitespace-nowrap">
                                            {registro.temperatura}°C
                                        </td>
                                        <td className="py-2 pr-4">
                                            {registro.presion_atm} hPa
                                        </td>*/}
                                            <td className="py-2 pr-4">
                                                {registro.botella}
                                            </td>
                                            <td className="py-2 pr-4">
                                                {registro.presion}
                                            </td>
                                            <td className="py-2 pr-4">
                                                {registro.agua}
                                            </td>
                                            <td className="py-2 pr-4">
                                                {registro.modeloBotella}
                                            </td>
                                            <td className="py-2 pr-4">
                                                {registro.usoBotella}
                                            </td>
                                            <td className="py-2 pr-4">
                                                {registro.altura}
                                            </td>
                                            {/* <td className="py-2 pr-4">
                                            {registro.distancia}
                                        </td>*/}

                                            <td className="py-2 pr-4 whitespace-nowrap">
                                                {registro.condicionesOptimas ===
                                                "Óptimo" ? (
                                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium dark:bg-green-900/40 dark:text-green-300">
                                                        Óptimo
                                                    </span>
                                                ) : registro.condicionesOptimas ===
                                                  "Aceptable" ? (
                                                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium dark:bg-yellow-900/40 dark:text-yellow-300">
                                                        Aceptable
                                                    </span>
                                                ) : (
                                                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium dark:bg-red-900/40 dark:text-red-300">
                                                        No recomendable
                                                    </span>
                                                )}
                                            </td>

                                            <td className="py-2 pr-2">
                                                <span
                                                    className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                                                        registro.resultado ===
                                                        "Éxito"
                                                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                                                            : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                                                    }`}
                                                >
                                                    {registro.resultado}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL */}


            <Modal
                open={openNuevoLanzamiento}
                onClose={cerrarNuevoLanzamiento}
                title="Registrar nuevo lanzamiento"
                maxWidthClass="max-w-xl"
            >
                <form
                    className="space-y-2"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3  gap-3">
                        <div>
                            <label className="text-sm text-slate-600 dark:text-slate-300">
                                Fecha y hora
                            </label>
                            <input
                                type="datetime-local"
                                className="mt-1 w-full rounded-xl border p-2  bg-white dark:bg-slate-950 dark:border-white/10 dark:text-slate-400"
                                value={formLanzamiento.fecha}
                                onChange={(e) =>
                                    setFormLanzamiento((prev) => ({
                                        ...prev,
                                        fecha: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div>
                            <label className="text-sm text-slate-600 dark:text-slate-300">
                                Presión (psi)
                            </label>
                            <input
                                type="number"
                                className="mt-1 w-full rounded-xl border p-2 bg-white dark:bg-slate-950 dark:border-white/10 dark:text-slate-400"
                                value={formLanzamiento.presion}
                                onChange={(e) =>
                                    setFormLanzamiento((prev) => ({
                                        ...prev,
                                        presion: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        <div>
                            <label className="text-sm text-slate-600 dark:text-slate-300">
                                Agua (ml)
                            </label>
                            <input
                                type="number"
                                className="mt-1 w-full rounded-xl border p-2 bg-white dark:bg-slate-950 dark:border-white/10 dark:text-slate-400"
                                value={formLanzamiento.agua}
                                onChange={(e) =>
                                    setFormLanzamiento((prev) => ({
                                        ...prev,
                                        agua: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div>
                            <label className="text-sm text-slate-600 dark:text-slate-300">
                                Botella
                            </label>
                            <select
                                className="mt-1 w-full rounded-xl border p-2 bg-white dark:bg-slate-950 dark:border-white/10 dark:text-slate-400"
                                value={formLanzamiento.botella}
                                onChange={(e) =>
                                    setFormLanzamiento((prev) => ({
                                        ...prev,
                                        botella: e.target.value,
                                    }))
                                }
                            >
                                <option>1.75 L</option>
                                <option>2 L</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm text-slate-600 dark:text-slate-300">
                                Modelo de botella
                            </label>
                            <input
                                type="text"
                                className="mt-1 w-full rounded-xl border p-2 bg-white dark:bg-slate-950 dark:border-white/10 dark:text-slate-400"
                                value={formLanzamiento.modeloBotella}
                                onChange={(e) =>
                                    setFormLanzamiento((prev) => ({
                                        ...prev,
                                        modeloBotella: e.target.value,
                                    }))
                                }
                            />
                            {/*<select
                                className="mt-1 w-full rounded-xl border p-2 bg-white dark:bg-slate-950 dark:border-white/10 dark:text-slate-400"
                                value={formLanzamiento.modeloBotella}
                                onChange={(e) =>
                                    setFormLanzamiento((prev) => ({
                                        ...prev,
                                        modeloBotella: e.target.value,
                                    }))
                                }
                            >
                                <option>Coca-Cola</option>
                                <option>Pepsi</option>
                                <option>Sprite</option>
                                <option>Fanta</option>
                                <option>7UP</option>
                                <option>Tehuacán</option>
                            </select>*/}
                        </div>
                        <div>
                            <label className="text-sm text-slate-600 dark:text-slate-300">
                                Uso de botella
                            </label>
                            <input
                                type="number"
                                className="mt-1 w-full rounded-xl border p-2 bg-white dark:bg-slate-950 dark:border-white/10 dark:text-slate-400"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-slate-600 dark:text-slate-300">
                                Parámetro de lanzamiento
                            </label>
                            <input
                                type="text"
                                className="mt-1 w-full rounded-xl border p-2 bg-white dark:bg-slate-950 dark:border-transparent dark:text-slate-400"
                                readOnly
                                value={condicionesOptimas}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-slate-600 dark:text-slate-300">
                                Altura (m)
                            </label>
                            <input
                                type="number"
                                className="mt-1 w-full rounded-xl border p-2 bg-white dark:bg-slate-950 dark:border-white/10 dark:text-slate-400"
                                value={formLanzamiento.altura}
                                onChange={(e) =>
                                    setFormLanzamiento((prev) => ({
                                        ...prev,
                                        altura: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        <div>
                            {/*<label className="text-sm text-slate-600 dark:text-slate-300">
                                Distancia (m)
                            </label>
                            <input
                                type="number"
                                className="mt-1 w-full rounded-xl border p-2 bg-white dark:bg-slate-950 dark:border-white/10 dark:text-slate-400"
                                value={formLanzamiento.distancia}
                                onChange={(e) =>
                                    setFormLanzamiento((prev) => ({
                                        ...prev,
                                        distancia: e.target.value,
                                    }))
                                }
                            />*/}
                            <label className="text-sm text-slate-600 dark:text-slate-300">
                                Resultado
                            </label>
                            <select
                                className="mt-1 w-full rounded-xl border p-2 bg-white dark:bg-slate-950 dark:border-white/10 dark:text-slate-400"
                                value={formLanzamiento.resultado}
                                onChange={(e) =>
                                    setFormLanzamiento((prev) => ({
                                        ...prev,
                                        resultado: e.target.value,
                                    }))
                                }
                            >
                                <option>Éxito</option>
                                <option>Fallo</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-slate-600 dark:text-slate-300">
                            Descripción
                        </label>
                        <textarea
                            rows={3}
                            className="mt-1 w-full rounded-xl border p-2 bg-white dark:bg-slate-950 dark:border-white/10 dark:text-slate-400"
                            placeholder="Describe observaciones del lanzamiento"
                            value={formLanzamiento.descripcion}
                            onChange={(e) =>
                                setFormLanzamiento((prev) => ({
                                    ...prev,
                                    descripcion: e.target.value,
                                }))
                            }
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={cerrarNuevoLanzamiento}
                            className="px-4 py-2 rounded-xl border dark:text-slate-400 dark:border-white/10"
                        >
                            Cerrar
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 rounded-xl bg-[#009688] text-white font-semibold"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal
                open={openDetalle}
                onClose={() => setOpenDetalle(false)}
                title="Detalle del lanzamiento"
            >
                {registroSeleccionado ? (
                    <div className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                                <strong>Fecha:</strong>{" "}
                                {registroSeleccionado.fecha}
                            </div>
                            <div>
                                <strong>Viento:</strong>{" "}
                                {registroSeleccionado.viento}km/h
                            </div>
                            <div>
                                <strong>Humedad:</strong>{" "}
                                {registroSeleccionado.humedad}%
                            </div>
                            <div>
                                <strong>Temperatura:</strong>{" "}
                                {registroSeleccionado.temperatura}°C
                            </div>
                            <div>
                                <strong>Presión Atm.:</strong>{" "}
                                {registroSeleccionado.presion_atm} hPa
                            </div>
                            <div>
                                <strong>Botella:</strong>{" "}
                                {registroSeleccionado.botella}
                            </div>
                            <div>
                                <strong>Presión:</strong>{" "}
                                {registroSeleccionado.presion} psi
                            </div>
                            <div>
                                <strong>Agua:</strong>{" "}
                                {registroSeleccionado.agua} ml
                            </div>
                            <div>
                                <strong>Modelo de botella:</strong>{" "}
                                {registroSeleccionado.modeloBotella}
                            </div>
                            <div>
                                <strong>Uso de botella:</strong>{" "}
                                {registroSeleccionado.usoBotella}
                            </div>
                            <div>
                                <strong>Altura:</strong>{" "}
                                {registroSeleccionado.altura} m
                            </div>
                            {/*<div>
                                <strong>Distancia:</strong>{" "}
                                {registroSeleccionado.distancia} m
                            </div>*/}
                            <div>
                                <strong>Resultado:</strong>{" "}
                                {registroSeleccionado.resultado}
                            </div>
                        </div>
                        <div className="rounded-xl border border-slate-200 dark:border-white/10 p-3 bg-slate-50 dark:bg-slate-950/50">
                            <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300 mb-1">
                                Descripción
                            </div>
                            <div>
                                {registroSeleccionado.descripcion ||
                                    "Sin descripción registrada."}
                            </div>
                        </div>
                    </div>
                ) : null}
            </Modal>
        </AuthenticatedLayout>
    );
}
