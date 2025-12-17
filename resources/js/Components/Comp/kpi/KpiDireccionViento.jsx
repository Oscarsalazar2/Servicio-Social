import React from "react";
import PanelVidrio from "../ui/PanelVidrio";
import BrujulaViento from "../grafica/BrujulaViento";

export default function KpiDireccionViento({ deg = 0, accent = "#FA812F" }) {
    return (
        <PanelVidrio title="Dirección del viento">
            <div className="mt-3">
                <BrujulaViento deg={deg} size={180} />
            </div>

            <div className="mt-2 text-center">
                <span
                    className="text-4xl font-extrabold"
                    style={{ color: accent }}
                >
                    {deg}
                </span>
                <span className="text-gray-600 dark:text-white/60 ml-1">°</span>
            </div>
        </PanelVidrio>
    );
}
