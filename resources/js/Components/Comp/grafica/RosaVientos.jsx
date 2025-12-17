import React, { useMemo } from "react";
import {
    ResponsiveContainer,
    RadialBarChart,
    RadialBar,
    PolarAngleAxis,
    PolarRadiusAxis,
    PolarGrid,
    Legend,
    Tooltip,
} from "recharts";
import PanelVidrio from "../ui/PanelVidrio";

const RANGE_COLORS = {
    r0_10: "#FFF59D",
    r10_20: "#FFC107",
    r20_30: "#FB8C00",
    r30_40: "#E53935",
};

export default function RosaVientos({ data, height = 360 }) {
    const maxR = useMemo(() => {
        let m = 0;
        for (const d of data) {
            const total =
                (d.r0_10 || 0) +
                (d.r10_20 || 0) +
                (d.r20_30 || 0) +
                (d.r30_40 || 0);
            m = Math.max(m, total);
        }
        return Math.max(10, Math.ceil(m / 10) * 10);
    }, [data]);

    return (
        <PanelVidrio title="Rosa de los vientos">
            <div
                className="mt-3 relative text-gray-900 dark:text-white"
                style={{ height }}
            >
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="relative w-[260px] h-[260px]">
                        <div className="absolute left-1/2 top-0 -translate-x-1/2 text-xs font-bold text-gray-700 dark:text-white/70">
                            N
                        </div>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-700 dark:text-white/70">
                            E
                        </div>
                        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 text-xs font-bold text-gray-700 dark:text-white/70">
                            S
                        </div>
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-700 dark:text-white/70">
                            W
                        </div>
                    </div>
                </div>

                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        data={data}
                        innerRadius="18%"
                        outerRadius="90%"
                        startAngle={90}
                        endAngle={-270}
                    >
                        <PolarGrid stroke="currentColor" strokeOpacity={0.12} />
                        <PolarAngleAxis
                            dataKey="angle"
                            tick={false}
                            type="number"
                        />
                        <PolarRadiusAxis
                            angle={90}
                            domain={[0, maxR]}
                            tick={{
                                fill: "currentColor",
                                fillOpacity: 0.55,
                                fontSize: 11,
                            }}
                            axisLine={false}
                            stroke="currentColor"
                            strokeOpacity={0.18}
                        />
                        <RadialBar
                            dataKey="r0_10"
                            name="0-10 km/h"
                            fill={RANGE_COLORS.r0_10}
                            stackId="a"
                        />
                        <RadialBar
                            dataKey="r10_20"
                            name="10-20 km/h"
                            fill={RANGE_COLORS.r10_20}
                            stackId="a"
                        />
                        <RadialBar
                            dataKey="r20_30"
                            name="20-30 km/h"
                            fill={RANGE_COLORS.r20_30}
                            stackId="a"
                        />
                        <RadialBar
                            dataKey="r30_40"
                            name="30-40 km/h"
                            fill={RANGE_COLORS.r30_40}
                            stackId="a"
                        />
                        <Tooltip
                            contentStyle={{
                                background: "rgba(255,255,255,.95)",
                                border: "1px solid rgba(0,0,0,.12)",
                                color: "rgba(0,0,0,.87)",
                            }}
                            formatter={(v, n) => [v, n]}
                            labelFormatter={() => ""}
                        />
                        <Legend
                            wrapperStyle={{ color: "currentColor" }}
                            iconType="square"
                        />
                    </RadialBarChart>
                </ResponsiveContainer>
            </div>
        </PanelVidrio>
    );
}
