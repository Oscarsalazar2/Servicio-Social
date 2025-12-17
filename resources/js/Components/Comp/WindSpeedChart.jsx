import React from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";
import GlassPanel from "./GlassPanel";

const COLORS = {
    wind: "#FAB12F",
    windDir: "#FA812F",
};

export default function WindSpeedChart({ data, height = 320 }) {
    return (
        <GlassPanel
            title="Viento (24h)"
            right={
                <span className="text-xs text-gray-600 dark:text-white/60">
                    Velocidad / Racha
                </span>
            }
        >
            <div
                className="mt-4 text-gray-900 dark:text-white"
                style={{ height }}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                    >
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
                        <Area
                            type="monotone"
                            dataKey="vel"
                            stroke={COLORS.wind}
                            fill={COLORS.wind}
                            fillOpacity={0.25}
                            name="Velocidad (km/h)"
                        />
                        <Line
                            type="monotone"
                            dataKey="gust"
                            stroke={COLORS.windDir}
                            strokeWidth={2}
                            dot={false}
                            name="Racha (km/h)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </GlassPanel>
    );
}
