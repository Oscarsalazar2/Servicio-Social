import React from "react";

export default function KpiCard({ title, value, unit, color, subtitle, icon }) {
    return (
        <div className="rounded-2xl shadow-sm border p-4 bg-white/5 backdrop-blur border-white/10 dark:bg-slate-900/40 dark:border-white/10">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-white/70">
                        {title}
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                        <div
                            className="text-4xl font-extrabold"
                            style={{ color }}
                        >
                            {value}
                        </div>
                        <div className="text-sm font-semibold text-gray-600 dark:text-white/60">
                            {unit}
                        </div>
                    </div>
                    {subtitle ? (
                        <div className="mt-2 text-xs text-gray-500 dark:text-white/60">
                            {subtitle}
                        </div>
                    ) : null}
                </div>

                {icon ? (
                    <div
                        className="h-10 w-10 rounded-xl flex items-center justify-center"
                        style={{ background: `${color}1A` }}
                    >
                        <span style={{ color }} className="text-xl">
                            {icon}
                        </span>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
