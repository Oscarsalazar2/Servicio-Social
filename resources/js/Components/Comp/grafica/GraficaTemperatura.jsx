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

export default function GraficaTemperatura({ data, height = 320, colors }) {
    return (
        <PanelVidrio title="Temperatura y humedad (24h)">
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
                            dataKey="temp"
                            stroke={colors.temp}
                            dot={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="hum"
                            stroke={colors.hum}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </PanelVidrio>
    );
}
