import React from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";
import PanelVidrio from "../ui/PanelVidrio";

export default function GraficaPresion({ data, height = 320, colors }) {
    return (
        <PanelVidrio title="Presión y Presión Barométrica (24h)">
            <div
                className="mt-4 text-gray-900 dark:text-white"
                style={{ height }}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="currentColor"
                            strokeOpacity={0.12}
                        />
                        <XAxis
                            dataKey="t"
                            tick={{
                                fill: "currentColor",
                                fillOpacity: 0.6,
                                fontSize: 12,
                            }}
                        />
                        <YAxis
                            tick={{
                                fill: "currentColor",
                                fillOpacity: 0.6,
                                fontSize: 12,
                            }}
                        />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="presion"
                            stroke={colors.presion}
                            dot={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="presionBarometrica"
                            stroke={colors.presionBarometrica}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </PanelVidrio>
    );
}
