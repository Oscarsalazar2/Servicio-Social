import { useMemo, useState } from "react";
import { router } from "@inertiajs/react";

export default function Rechazados({ rejectedUsers = [] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [processing, setProcessing] = useState(null);

    const rejectedRequests = rejectedUsers.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        reason: user.motivo || "Sin motivo especificado",
        date: new Date(user.created_at).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }),
    }));

    const filteredRequests = useMemo(() => {
        return rejectedRequests.filter((request) => {
            return (
                request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.email
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                request.reason.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
    }, [rejectedRequests, searchTerm]);

    const handleReopen = (userId) => {
        if (processing) return;

        if (
            !confirm(
                "¿Deseas reabrir esta solicitud y enviarla nuevamente a pendientes?",
            )
        ) {
            return;
        }

        setProcessing(userId);
        router.post(
            route("admin.users.reopen", userId),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setProcessing(null);
                },
                onError: () => {
                    setProcessing(null);
                    alert("Error al reabrir la solicitud");
                },
            },
        );
    };

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Solicitudes Rechazadas
                </h2>
                <p className="mt-1 text-sm opacity-70">
                    Consulta las solicitudes que fueron rechazadas
                </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="flex-1 relative">
                        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm"></i>
                        <input
                            type="text"
                            placeholder="Buscar solicitud rechazada..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-[#009688] focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                        Historial de Rechazados
                    </h3>
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                        {filteredRequests.length}{" "}
                        {filteredRequests.length === 1
                            ? "solicitud"
                            : "solicitudes"}
                    </span>
                </div>

                <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                            Usuario
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                            Correo
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                            Motivo
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                            Fecha
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                            Estado
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                                    {filteredRequests.length > 0 ? (
                                        filteredRequests.map((request) => (
                                            <tr
                                                key={request.id}
                                                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                            >
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                                                    {request.name}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                                                    {request.email}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 max-w-xs">
                                                    {request.reason}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                                                    {request.date}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                                                        Rechazado
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <button
                                                        onClick={() =>
                                                            handleReopen(
                                                                request.id,
                                                            )
                                                        }
                                                        disabled={
                                                            processing ===
                                                            request.id
                                                        }
                                                        className="px-3 py-1.5 bg-[#009688] hover:bg-[#00796B] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        type="button"
                                                    >
                                                        {processing ===
                                                        request.id ? (
                                                            <i className="fa-solid fa-spinner fa-spin"></i>
                                                        ) : (
                                                            <i className="fa-solid fa-rotate-left"></i>
                                                        )}
                                                        Reabrir
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="px-4 py-8 text-center text-slate-500 dark:text-slate-400"
                                            >
                                                <div className="flex flex-col items-center gap-2">
                                                    <i className="fa-solid fa-user-check text-3xl opacity-50"></i>
                                                    <p className="text-sm">
                                                        No hay solicitudes
                                                        rechazadas
                                                    </p>
                                                </div>
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
