import React from "react";

export default function TarjetaKpi({
    title,
    extra,
    value,
    unit,
    color,
    subtitle,
    icon,
}) {
    return (
        <div className="rounded-2xl shadow-sm border p-4 bg-gray-50 backdrop-blur border-gray-200 dark:bg-slate-900/40 dark:border-white/10">
            <div className="flex items-start justify-between gap-3">
                <div className="w-full">
                    <div className="flex justify-between items-center gap-2 w-full">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white/70">
                            {title}
                        </span>
                        
                        {extra && (
                            <span className="text-xs text-cyan-700 font-semibold dark:text-cyan-400 whitespace-nowrap ml-4">
                                {extra}
                            </span>
                        )}
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
