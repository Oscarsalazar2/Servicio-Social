import { useState, useMemo, useEffect } from "react";
import { router } from "@inertiajs/react";

export default function Activaciones({ pendingUsers = [] }) {
    const ITEMS_PER_PAGE = 5;
    const [searchTerm, setSearchTerm] = useState("");
    const [processing, setProcessing] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Formatear datos de usuarios pendientes
    const pendingActivations = pendingUsers.map((user) => ({
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

    // Filtrar activaciones
    const filteredActivations = useMemo(() => {
        return pendingActivations.filter((activation) => {
            const matchesSearch =
                activation.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                activation.email
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                activation.reason
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
            return matchesSearch;
        });
    }, [pendingActivations, searchTerm]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredActivations.length / ITEMS_PER_PAGE),
    );

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const paginatedActivations = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredActivations.slice(
            startIndex,
            startIndex + ITEMS_PER_PAGE,
        );
    }, [filteredActivations, currentPage]);

    const startItem =
        filteredActivations.length === 0
            ? 0
            : (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem =
        filteredActivations.length === 0
            ? 0
            : Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  filteredActivations.length,
              );

    const handleActivate = (userId) => {
        if (processing) return;

        setProcessing(userId);
        router.post(
            route("admin.users.activate", userId),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setProcessing(null);
                },
                onError: () => {
                    setProcessing(null);
                    alert("Error al activar el usuario");
                },
            },
        );
    };

    const handleReject = (userId) => {
        if (processing) return;

        if (
            !confirm(
                "¿Estás seguro de rechazar esta solicitud? Esta acción no se puede deshacer.",
            )
        ) {
            return;
        }

        setProcessing(userId);
        router.post(
            route("admin.users.reject", userId),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setProcessing(null);
                },
                onError: () => {
                    setProcessing(null);
                    alert("Error al rechazar el usuario");
                },
            },
        );
    };

    return (
        <div className="space-y-4">
            {/* Encabezado */}
            <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Activaciones
                </h2>
                <p className="mt-1 text-sm opacity-70">
                    Gestiona las solicitudes de activación de cuentas
                </p>
            </div>

            {/* Sección principal */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-4 sm:p-6">
                {/* Contador de pendientes */}
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                        Solicitudes Pendientes
                    </h3>
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                        {filteredActivations.length}{" "}
                        {filteredActivations.length === 1
                            ? "pendiente"
                            : "pendientes"}
                    </span>
                </div>

                {/* Tabla de activaciones */}
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
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                                    {filteredActivations.length > 0 ? (
                                        paginatedActivations.map(
                                            (activation) => (
                                                <tr
                                                    key={activation.id}
                                                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                                >
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                                                        {activation.name}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                                                        {activation.email}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 max-w-xs">
                                                        {activation.reason}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                                                        {activation.date}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleActivate(
                                                                        activation.id,
                                                                    )
                                                                }
                                                                disabled={
                                                                    processing ===
                                                                    activation.id
                                                                }
                                                                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                title="Activar usuario"
                                                                type="button"
                                                            >
                                                                {processing ===
                                                                activation.id ? (
                                                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                                                ) : (
                                                                    <i className="fa-solid fa-check"></i>
                                                                )}
                                                                Activar
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleReject(
                                                                        activation.id,
                                                                    )
                                                                }
                                                                disabled={
                                                                    processing ===
                                                                    activation.id
                                                                }
                                                                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                title="Rechazar usuario"
                                                                type="button"
                                                            >
                                                                {processing ===
                                                                activation.id ? (
                                                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                                                ) : (
                                                                    <i className="fa-solid fa-xmark"></i>
                                                                )}
                                                                Rechazar
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ),
                                        )
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="px-4 py-8 text-center text-slate-500 dark:text-slate-400"
                                            >
                                                <div className="flex flex-col items-center gap-2">
                                                    <i className="fa-solid fa-circle-check text-3xl opacity-50"></i>
                                                    <p className="text-sm">
                                                        No hay activaciones
                                                        pendientes
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

                {filteredActivations.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                            Mostrando {startItem}-{endItem} de{" "}
                            {filteredActivations.length}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.max(1, prev - 1),
                                    )
                                }
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Anterior
                            </button>
                            <span className="px-3 py-1.5 text-xs sm:text-sm rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                Página {currentPage} de {totalPages}
                            </span>
                            <button
                                type="button"
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.min(totalPages, prev + 1),
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
