import React, { useEffect, useMemo, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

const CLAVE_STORAGE_PREFS_GRID = "dashboard:grid:visibleFields";

const COLORES = {
    temp: "#6E8CFB",
    tempAlt: "#00B7B5",
    hum: "#018790",
    wind: "#FAB12F",
    windDir: "#FA812F",
};

const LAYOUTS_ADAPTATIVOS = {
    1: ["md:col-span-9 md:row-span-9"],
    2: ["md:col-span-6 md:row-span-9", "md:col-span-3 md:row-span-9"],
    3: [
        "md:col-span-3 md:row-span-9",
        "md:col-span-3 md:row-span-9",
        "md:col-span-3 md:row-span-9",
    ],
    4: [
        "md:col-span-6 md:row-span-6",
        "md:col-span-3 md:row-span-9",
        "md:col-span-3 md:row-span-3",
        "md:col-span-3 md:row-span-3",
    ],
    5: [
        "md:col-span-6 md:row-span-3",
        "md:col-span-3 md:row-span-6",
        "md:col-span-3 md:row-span-6",
        "md:col-span-3 md:row-span-6",
        "md:col-span-3 md:row-span-3",
    ],
    6: [
        "md:col-span-6 md:row-span-3",
        "md:col-span-3 md:row-span-6",
        "md:col-span-3 md:row-span-6",
        "md:col-span-3 md:row-span-3",
        "md:col-span-3 md:row-span-3",
        "md:col-span-3 md:row-span-3",
    ],
    7: [
        "md:col-span-6 md:row-span-3",
        "md:col-span-3 md:row-span-6",
        "md:col-span-3 md:row-span-3",
        "md:col-span-3 md:row-span-3",
        "md:col-span-3 md:row-span-3",
        "md:col-span-3 md:row-span-3",
        "md:col-span-3 md:row-span-3",
    ],
    8: [
        "md:col-span-6 md:row-span-3",
        "md:col-span-3 md:row-span-3",
        "md:col-span-3 md:row-span-3",
        "md:col-span-3 md:row-span-3",
        "md:col-span-3 md:row-span-3",
        "md:col-span-3 md:row-span-3",
        "md:col-span-3 md:row-span-3",
        "md:col-span-3 md:row-span-3",
    ],
    9: [
        "md:col-span-3 md:row-span-3",
        "md:col-span-3 md:row-span-3",
        "md:col-span-3 md:row-span-3",
        "md:col-span-3 md:row-span-3",
        "md:col-span-3 md:row-span-3",
        "md:col-span-3 md:row-span-3",
        "md:col-span-3 md:row-span-3",
        "md:col-span-3 md:row-span-3",
        "md:col-span-3 md:row-span-3",
    ],
};

export default function Dashboard() {
    const serieViento = useMemo(() => {
        return Array.from({ length: 24 }).map((_, i) => ({
            t: `${String(i).padStart(2, "0")}:00`,
            vel: Math.max(
                0,
                Math.round(
                    (Math.sin(i / 3) * 8 + 12 + Math.random() * 3) * 10,
                ) / 10,
            ),
            dir: Math.round((i * 15 + 210 + Math.random() * 20) % 360),
        }));
    }, []);

    const serieTempHum = useMemo(() => {
        return Array.from({ length: 24 }).map((_, i) => ({
            t: `${String(i).padStart(2, "0")}:00`,
            temp:
                Math.round(
                    (Math.sin(i / 4) * 4 + 2 + Math.random() * 0.7) * 10,
                ) / 10,
            hum:
                Math.round(
                    (Math.cos(i / 5) * 18 + 65 + Math.random() * 3) * 10,
                ) / 10,
        }));
    }, []);

    // KPIs
    const ultimoViento = serieViento[serieViento.length - 1];
    const ultimaTempHum = serieTempHum[serieTempHum.length - 1];

    const kpiViento = {
        speed: ultimoViento.vel,
        dir: ultimoViento.dir,
    };

    const kpiTemp = {
        temp: ultimaTempHum.temp,
        hum: ultimaTempHum.hum,
        feels:
            Math.round(
                (ultimaTempHum.temp - (100 - ultimaTempHum.hum) / 8) * 10,
            ) / 10,
    };

    const valorRadiacion = 428;
    const indiceUv = Number((valorRadiacion / 100).toFixed(1));
    const ultimaActualizacion = useMemo(
        () =>
            new Date().toLocaleString("es-MX", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            }),
        [],
    );

    const camposGrid = useMemo(
        () => [
            {
                id: "windSpeed",
                label: "Velocidad del viento",
                value: kpiViento.speed,
                unit: "km/h",
                layout: "md:col-span-3 md:row-span-3",
                color: COLORES.wind,
                iconClass: "fa-wind",
            },
            {
                id: "windDirection",
                label: "Dirección del viento",
                value: kpiViento.dir,
                unit: "°",
                layout: "md:col-span-3 md:row-span-3",
                color: COLORES.windDir,
                iconClass: "fa-compass",
            },
            {
                id: "temperature",
                label: "Temperatura",
                value: kpiTemp.temp,
                unit: "°C",
                layout: "md:col-span-3 md:row-span-3",
                color: COLORES.temp,
                iconClass: "fa-temperature-three-quarters",
            },
            {
                id: "humidity",
                label: "Humedad",
                value: kpiTemp.hum,
                unit: "%",
                layout: "md:col-span-3 md:row-span-2",
                color: COLORES.hum,
                iconClass: "fa-droplet",
            },
            {
                id: "feelsLike",
                label: "Sensación térmica",
                value: kpiTemp.feels,
                unit: "°C",
                layout: "md:col-span-3 md:row-span-2",
                color: COLORES.tempAlt,
                iconClass: "fa-person-rays",
            },
            {
                id: "radiation",
                label: "Radiación",
                value: valorRadiacion,
                unit: "W/m²",
                layout: "md:col-span-3 md:row-span-2",
                color: "#38bdf8",
                iconClass: "fa-sun",
            },
            {
                id: "cloudBase",
                label: "Altura de nubes",
                value: 1450,
                unit: "m",
                layout: "md:col-span-3 md:row-span-2",
                color: "#a78bfa",
                iconClass: "fa-cloud",
            },
            {
                id: "pressure",
                label: "Presión atmosférica",
                value: 1009,
                unit: "hPa",
                layout: "md:col-span-3 md:row-span-2",
                color: "#f97316",
                iconClass: "fa-gauge-high",
            },
            {
                id: "uvIndex",
                label: "Índice UV",
                value: indiceUv,
                unit: "UV",
                layout: "md:col-span-3 md:row-span-2",
                color: "#ef4444",
                iconClass: "fa-radiation",
                //iconClass: "fa-sun-bright",
            },
        ],
        [
            kpiViento.speed,
            kpiViento.dir,
            kpiTemp.temp,
            kpiTemp.hum,
            kpiTemp.feels,
            valorRadiacion,
            indiceUv,
        ],
    );

    const todosLosIdsCampos = useMemo(
        () => camposGrid.map((campo) => campo.id),
        [camposGrid],
    );

    const [idsCamposVisibles, setIdsCamposVisibles] = useState(
        () => new Set(todosLosIdsCampos),
    );
    const [listaCamposAbierta, setListaCamposAbierta] = useState(false);
    const [prefsGridCargadas, setPrefsGridCargadas] = useState(false);

    const camposVisiblesGrid = camposGrid.filter((campo) =>
        idsCamposVisibles.has(campo.id),
    );

    const layoutsAdaptativos =
        LAYOUTS_ADAPTATIVOS[camposVisiblesGrid.length] ||
        LAYOUTS_ADAPTATIVOS[9];

    const presetTamano = useMemo(() => {
        if (camposVisiblesGrid.length <= 2) {
            return {
                cardPadding: "p-6 md:p-8",
                iconBox: "w-16 h-16 md:w-20 md:h-20",
                icon: "text-4xl md:text-5xl",
                title: "text-base md:text-lg",
                value: "text-6xl md:text-7xl",
                unit: "text-lg md:text-2xl",
                meta: "text-sm md:text-base",
                contentGap: "gap-6",
            };
        }

        if (camposVisiblesGrid.length <= 4) {
            return {
                cardPadding: "p-5 md:p-6",
                iconBox: "w-14 h-14 md:w-16 md:h-16",
                icon: "text-3xl md:text-4xl",
                title: "text-sm md:text-base",
                value: "text-5xl md:text-6xl",
                unit: "text-base md:text-xl",
                meta: "text-xs md:text-sm",
                contentGap: "gap-5",
            };
        }

        return {
            cardPadding: "p-4",
            iconBox: "w-12 h-12 md:w-14 md:h-14",
            icon: "text-2xl md:text-3xl",
            title: "text-sm",
            value: "text-4xl md:text-5xl",
            unit: "text-sm md:text-base",
            meta: "text-xs",
            contentGap: "gap-4",
        };
    }, [camposVisiblesGrid.length]);

    const alternarCampo = (idCampo) => {
        setIdsCamposVisibles((anterior) => {
            const siguiente = new Set(anterior);
            if (siguiente.has(idCampo)) {
                siguiente.delete(idCampo);
            } else {
                siguiente.add(idCampo);
            }
            return siguiente;
        });
    };

    const mostrarTodo = () => setIdsCamposVisibles(new Set(todosLosIdsCampos));
    const ocultarTodo = () => setIdsCamposVisibles(new Set());

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        try {
            const valorGuardado = window.localStorage.getItem(
                CLAVE_STORAGE_PREFS_GRID,
            );
            if (!valorGuardado) {
                setPrefsGridCargadas(true);
                return;
            }

            const datosParseados = JSON.parse(valorGuardado);
            if (!Array.isArray(datosParseados)) {
                setPrefsGridCargadas(true);
                return;
            }

            const idsValidos = datosParseados.filter((id) =>
                todosLosIdsCampos.includes(id),
            );
            setIdsCamposVisibles(new Set(idsValidos));
        } catch {
            setIdsCamposVisibles(new Set(todosLosIdsCampos));
        } finally {
            setPrefsGridCargadas(true);
        }
    }, [todosLosIdsCampos]);

    useEffect(() => {
        if (typeof window === "undefined" || !prefsGridCargadas) {
            return;
        }

        window.localStorage.setItem(
            CLAVE_STORAGE_PREFS_GRID,
            JSON.stringify(Array.from(idsCamposVisibles)),
        );
    }, [idsCamposVisibles, prefsGridCargadas]);

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="min-h-screen bg-gray-100 dark:bg-[#071024]">
                <div className="max-w-7xl mx-auto px-4 py-8 space-y-14">
                    <section className="space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h2 className="text-gray-900 dark:text-white font-extrabold text-lg">
                                    Panel meteorológico
                                </h2>
                            </div>

                            <div className="relative flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={mostrarTodo}
                                    className="px-3 py-2 rounded-lg text-sm font-semibold bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 dark:bg-[#0f1d3d] dark:text-gray-100 dark:border-slate-700"
                                >
                                    Mostrar todo
                                </button>
                                <button
                                    type="button"
                                    onClick={ocultarTodo}
                                    className="px-3 py-2 rounded-lg text-sm font-semibold bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 dark:bg-[#0f1d3d] dark:text-gray-100 dark:border-slate-700"
                                >
                                    Quitar todo
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setListaCamposAbierta((prev) => !prev)
                                    }
                                    className="px-3 py-2 rounded-lg text-sm font-semibold bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 dark:bg-[#0f1d3d] dark:text-gray-100 dark:border-slate-700 flex items-center gap-2"
                                >
                                    Lista
                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-200">
                                        {camposVisiblesGrid.length}/
                                        {camposGrid.length}
                                    </span>
                                    <span
                                        className={`text-gray-500 dark:text-gray-300 transition-transform ${
                                            listaCamposAbierta
                                                ? "rotate-180"
                                                : ""
                                        }`}
                                        aria-hidden="true"
                                    >
                                        ▼
                                    </span>
                                </button>

                                {listaCamposAbierta ? (
                                    <div
                                        className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#0f1d3d] shadow-lg z-30 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                                        style={{
                                            scrollbarWidth: "none",
                                            msOverflowStyle: "none",
                                        }}
                                    >
                                        <ul className="p-2 space-y-2">
                                            {camposGrid.map((campo) => {
                                                const esVisible =
                                                    idsCamposVisibles.has(
                                                        campo.id,
                                                    );

                                                return (
                                                    <li
                                                        key={campo.id}
                                                        className="flex items-center justify-between rounded-lg px-2 py-2 border border-gray-200/80 dark:border-slate-700/80 bg-white dark:bg-[#12224a]/80"
                                                    >
                                                        <label
                                                            htmlFor={`field-${campo.id}`}
                                                            className="flex items-center gap-3 text-sm text-gray-800 dark:text-gray-100 cursor-pointer"
                                                        >
                                                            <input
                                                                id={`field-${campo.id}`}
                                                                type="checkbox"
                                                                checked={
                                                                    esVisible
                                                                }
                                                                onChange={() =>
                                                                    alternarCampo(
                                                                        campo.id,
                                                                    )
                                                                }
                                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                            />
                                                            <span
                                                                className="w-2.5 h-2.5 rounded-full"
                                                                style={{
                                                                    backgroundColor:
                                                                        campo.color,
                                                                }}
                                                            />
                                                            {campo.label}
                                                        </label>

                                                        <span
                                                            className={`text-xs font-semibold px-2 py-1 rounded-md ${
                                                                esVisible
                                                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                                                                    : "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-300"
                                                            }`}
                                                        >
                                                            {esVisible
                                                                ? "Visible"
                                                                : "Oculto"}
                                                        </span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        {camposVisiblesGrid.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-400/50 dark:border-slate-600/60 p-8 text-center text-gray-700 dark:text-gray-300 bg-white/70 dark:bg-[#0b1735]">
                                No hay campos visibles. Usa los botones para
                                volver a mostrar métricas.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-9 md:grid-rows-9 gap-3 md:auto-rows-[56px] md:grid-flow-dense">
                                {camposVisiblesGrid.map((campo, indice) => (
                                    <div
                                        key={campo.id}
                                        className={`h-full rounded-2xl shadow-md border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-[#0b1735] ${presetTamano.cardPadding} ${layoutsAdaptativos[indice]}`}
                                    >
                                        <div
                                            className={`${presetTamano.title} font-semibold tracking-wide text-gray-900 dark:text-gray-100`}
                                        >
                                            {campo.label}
                                        </div>
                                        <div
                                            className={`mt-4 h-[calc(100%-2rem)] flex items-center ${presetTamano.contentGap}`}
                                        >
                                            <div
                                                className={`${presetTamano.iconBox} rounded-xl bg-gray-200/70 dark:bg-slate-800/70 flex items-center justify-center`}
                                            >
                                                <i
                                                    className={`fa-solid ${campo.iconClass} ${presetTamano.icon}`}
                                                    style={{ color: "#b8b8b8" }}
                                                />
                                            </div>

                                            <div className="flex-1 text-center">
                                                <div
                                                    className={`${presetTamano.meta} text-gray-500 dark:text-gray-300`}
                                                >
                                                    Ultimo Valor Registrado
                                                </div>
                                                <div
                                                    className={`mt-1 ${presetTamano.value} leading-none font-black`}
                                                    style={{
                                                        color: campo.color,
                                                    }}
                                                >
                                                    {campo.value}
                                                    {campo.unit ? (
                                                        <span
                                                            className={`ml-1 ${presetTamano.unit} font-bold text-gray-700 dark:text-gray-200`}
                                                        >
                                                            {campo.unit}
                                                        </span>
                                                    ) : null}
                                                </div>
                                                <div
                                                    className={`mt-2 ${presetTamano.meta} text-gray-500 dark:text-gray-300`}
                                                >
                                                    Ultima Actualización:{" "}
                                                    {ultimaActualizacion}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
