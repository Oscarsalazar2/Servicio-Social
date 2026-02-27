import { useMemo, useState } from "react";

const mockReports = [
    {
        id: 1,
        date: "2026-02-23",
        sensor: "Temperatura",
        value: "38.4 °C",
        status: "Crítico",
    },
    {
        id: 2,
        date: "2026-02-24",
        sensor: "Humedad",
        value: "72 %",
        status: "Normal",
    },
    {
        id: 3,
        date: "2026-02-25",
        sensor: "Presión",
        value: "1015 hPa",
        status: "Precaución",
    },
    {
        id: 4,
        date: "2026-02-26",
        sensor: "Viento",
        value: "62 km/h",
        status: "Crítico",
    },
    {
        id: 5,
        date: "2026-02-27",
        sensor: "Solar",
        value: "780 W/m²",
        status: "Normal",
    },
];

const availableSections = [
    "Viento",
    "Temperatura",
    "Humedad",
    "Presión",
    "Solar",
];

const normalizeText = (value = "") =>
    value
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

export default function Reportes({ reports = [] }) {
    const reportData = reports.length > 0 ? reports : mockReports;
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [selectedSections, setSelectedSections] = useState(availableSections);

    const allSectionsSelected =
        selectedSections.length === availableSections.length;

    const filteredForDownload = useMemo(() => {
        const fromDate = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
        const toDate = dateTo ? new Date(`${dateTo}T23:59:59`) : null;

        return reportData.filter((item) => {
            const normalizedSensor = normalizeText(item.sensor);
            const isSectionSelected = selectedSections.some(
                (section) => normalizeText(section) === normalizedSensor,
            );

            if (!isSectionSelected) {
                return false;
            }

            const rowDate = item.date
                ? new Date(`${item.date}T12:00:00`)
                : null;
            const matchesFrom = !fromDate || (rowDate && rowDate >= fromDate);
            const matchesTo = !toDate || (rowDate && rowDate <= toDate);

            return matchesFrom && matchesTo;
        });
    }, [reportData, dateFrom, dateTo, selectedSections]);

    const metrics = useMemo(() => {
        const weeklyTemperatureAvg = 31.8;
        const rainyDays = reportData.filter(
            (item) => normalizeText(item.sensor) === "humedad",
        ).length;
        const activeAlerts = reportData.filter(
            (item) => item.status !== "Normal",
        ).length;

        return {
            weeklyTemperatureAvg,
            rainyDays,
            activeAlerts,
        };
    }, [reportData]);

    const statusBadgeClass = (status) => {
        if (status === "Crítico") {
            return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
        }

        if (status === "Precaución") {
            return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
        }

        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    };

    const toggleSection = (section) => {
        setSelectedSections((current) => {
            if (current.includes(section)) {
                return current.filter((item) => item !== section);
            }

            return [...current, section];
        });
    };

    const toggleAllSections = () => {
        setSelectedSections(allSectionsSelected ? [] : availableSections);
    };

    const handleDownloadMonthlyReport = () => {
        if ((dateFrom && !dateTo) || (!dateFrom && dateTo)) {
            alert("Selecciona ambas fechas para usar el rango.");
            return;
        }

        if (dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)) {
            alert("La fecha inicial no puede ser mayor que la final.");
            return;
        }

        if (selectedSections.length === 0) {
            alert("Selecciona al menos una sección para generar el reporte.");
            return;
        }

        if (filteredForDownload.length === 0) {
            alert("No hay datos para el rango y secciones seleccionadas.");
            return;
        }

        const header = ["Fecha", "Sensor", "Valor", "Estado"];
        const rows = filteredForDownload.map((item) => [
            item.date,
            item.sensor,
            item.value,
            item.status,
        ]);

        const csv = [header, ...rows]
            .map((line) => line.map((value) => `"${value}"`).join(","))
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", "reporte_filtrado_estacion.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        Reportes y Alertas
                    </h2>
                    <p className="mt-1 text-sm opacity-70">
                        Visualiza métricas clave y eventos meteorológicos del
                        periodo.
                    </p>
                </div>
            </div>

            <details className="group rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
                <summary className="cursor-pointer list-none px-4 sm:px-6 py-4 flex items-center justify-between">
                    <span className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                        Descargar reportes
                    </span>
                    <i className="fa-solid fa-chevron-down text-xs text-slate-500 dark:text-slate-400 transition-transform group-open:rotate-180"></i>
                </summary>

                <div className="border-t border-slate-200 dark:border-slate-700 px-4 sm:px-6 py-4 sm:py-5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                                Fecha inicial
                            </label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                                Fecha final
                            </label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            />
                        </div>
                    </div>

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                            Secciones
                        </p>

                        <div className="flex flex-wrap gap-2">
                            <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-sm text-slate-700 dark:text-slate-300">
                                <input
                                    type="checkbox"
                                    checked={allSectionsSelected}
                                    onChange={toggleAllSections}
                                    className="accent-[#009688]"
                                />
                                Todas
                            </label>

                            {availableSections.map((section) => (
                                <label
                                    key={section}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-sm text-slate-700 dark:text-slate-300"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedSections.includes(
                                            section,
                                        )}
                                        onChange={() => toggleSection(section)}
                                        className="accent-[#009688]"
                                    />
                                    {section}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                            Vista previa para descarga:{" "}
                            {filteredForDownload.length} registro(s)
                        </p>

                        <button
                            type="button"
                            onClick={handleDownloadMonthlyReport}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#009688] hover:bg-[#00796B] text-white text-sm font-semibold transition-colors"
                        >
                            <i className="fa-solid fa-file-arrow-down"></i>
                            Descargar reporte
                        </button>
                    </div>
                </div>
            </details>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Promedio semanal de temperatura
                    </p>
                    <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                        {metrics.weeklyTemperatureAvg} °C
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Días con lluvia
                    </p>
                    <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                        {metrics.rainyDays}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Alertas activas
                    </p>
                    <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                        {metrics.activeAlerts}
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-4 sm:p-6">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">
                    Historial reciente
                </h3>

                <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                            Fecha
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                            Sensor
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                            Valor
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                            Estado
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                                    {reportData.length > 0 ? (
                                        reportData.map((row) => (
                                            <tr
                                                key={row.id}
                                                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                            >
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                                                    {new Date(
                                                        `${row.date}T00:00:00`,
                                                    ).toLocaleDateString(
                                                        "es-ES",
                                                        {
                                                            day: "2-digit",
                                                            month: "2-digit",
                                                            year: "numeric",
                                                        },
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                                                    {row.sensor}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                                                    {row.value}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadgeClass(
                                                            row.status,
                                                        )}`}
                                                    >
                                                        {row.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="px-4 py-8 text-center text-slate-500 dark:text-slate-400"
                                            >
                                                No hay datos disponibles para
                                                mostrar.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
