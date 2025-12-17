import React from "react";

export default function GlassPanel({ title, right, className = "", children }) {
    return (
        <div
            className={[
                "rounded-2xl shadow-sm border p-4",
                "bg-white/5 backdrop-blur border-white/10",
                "dark:bg-slate-900/40 dark:border-white/10",
                className,
            ].join(" ")}
        >
            {(title || right) && (
                <div className="flex items-center justify-between gap-3">
                    {title ? (
                        <div className="text-gray-900 dark:text-white font-semibold">
                            {title}
                        </div>
                    ) : (
                        <div />
                    )}
                    {right ? <div>{right}</div> : null}
                </div>
            )}
            {children}
        </div>
    );
}
