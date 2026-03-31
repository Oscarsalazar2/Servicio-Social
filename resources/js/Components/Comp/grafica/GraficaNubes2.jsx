import React from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ReferenceArea,
    ReferenceLine,
} from "recharts";

const CAPAS = [
    {
        id: "bajas",
        nombre: "Nubes bajas (St / Sc / Cu / Cb)",
        min: 0,
        max: 3000,
        color: "#34D399", //#60A5FA
    },
    {
        id: "medias",
        nombre: "Nubes medias (As / Ac / Ns)",
        min: 3000,
        max: 6000,
        color: "#FBBF24", //#34D399
    },
    {
        id: "altas",
        nombre: "Nubes altas (Ci / Cs / Cc)",
        min: 6000,
        max: 12000,
        color: "#FB2C36", //#FBBF24
    },
];

const GRID_HORIZONTAL_LEVELS = [3000, 6000, 9000, 12000];

const GRID_HORIZONTAL_COLORS_LIGHT = [
    "#034F3B", //#162456
    "#FF8904", //034F3B
    "#E7180B", //#F97316
    "#E7180B",
];

const GRID_HORIZONTAL_COLORS_DARK = [
    "#31C950", //193CB8
    "#FDE68A", //#034F3B
    "#FF6467", //FDE68A
    "#FF6467",
];

const formatAltura = (value) =>
    `${Number(value).toLocaleString("es-ES")} m`;

const CloudDot = ({ cx, cy }) => {
    if (cx == null || cy == null) return null;

    return (
        <text
            x={cx}
            y={cy}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="20"
        >
            ☁️
        </text>
    );
};

export default function GraficaNubes({ series = [], colors, height = 250 }) {
    const isDarkTheme =
        typeof document !== "undefined" &&
        document.documentElement.classList.contains("dark");

    const gridHorizontalColors = isDarkTheme
        ? GRID_HORIZONTAL_COLORS_DARK
        : GRID_HORIZONTAL_COLORS_LIGHT;

    return (
        <div className="w-full text-gray-900 dark:text-white ">
            <p className="text-xs md:text-sm text-slate-700/90 dark:text-slate-300/90 mb-2">
                Seguimiento por hora de la altura base de nubes y su capa
                atmosférica.
            </p>

            <div style={{ height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={series}
                        margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid
                            horizontal={false}
                            strokeDasharray="3 3"
                            stroke="currentColor"
                            strokeOpacity={0.12}
                        />

                        {CAPAS.map((capa) => (
                            <ReferenceArea
                                key={capa.id}
                                y1={capa.min}
                                y2={capa.max}
                                fill={capa.color}
                                fillOpacity={0.08}
                                ifOverflow="extendDomain"
                            />
                        ))}

                        {GRID_HORIZONTAL_LEVELS.map((level, index) => (
                            <ReferenceLine
                                key={`horizontal-grid-${level}`}
                                y={level}
                                stroke={
                                    gridHorizontalColors[
                                        index % gridHorizontalColors.length
                                    ]
                                }
                                strokeDasharray="3 3"
                                strokeOpacity={0.4}
                            />
                        ))}

                        <XAxis
                            dataKey="t"
                            tick={{
                            fill: "currentColor",
                            fillOpacity: 0.6,
                            fontSize: 12,
                            }}
                        />

                        <YAxis
                            domain={[0, 12000]}
                            ticks={GRID_HORIZONTAL_LEVELS}
                            tickFormatter={(value) => `${value / 1000} km`}
                            tick={{
                                fill: "currentColor",
                                fillOpacity: 0.6,
                                fontSize: 12,
                            }}
                        />

                        <Tooltip
                            formatter={(value) => [
                                formatAltura(value),
                                "Altura",
                            ]}
                            labelFormatter={(label) => `Hora: ${label}`}
                        />

                        <Area
                            type="monotone"
                            dataKey="cloudHeight"
                            stroke={colors?.cloudHeight || "#9B59B6"}
                            fill={colors?.cloudHeight || "#9B59B6"}
                            fillOpacity={0}
                            strokeWidth={1}
                            dot={<CloudDot />}   // ← AQUÍ están las nubes
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-3 rounded-2xl shadow-sm border bg-white/5 backdrop-blur border-white/10 dark:bg-slate-900/40 dark:border-white/10 overflow-hidden">
                <div className="flex flex-col divide-y divide-slate-300/50 dark:divide-white/10 md:flex-row md:divide-y-0 md:divide-x">
                    {CAPAS.map((capa) => (
                        <div
                            key={capa.id}
                            className="flex items-start gap-2 px-3 py-2 md:flex-1"
                        >
                            <span
                                className="inline-block w-2 h-2 rounded-full mt-1 shrink-0"
                                style={{ backgroundColor: capa.color }}
                            />
                            <span className="text-[11px] md:text-xs font-semibold leading-4 text-gray-700 dark:text-white/80">
                                {capa.nombre}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}