import { useEffect, useMemo, useState } from "react";

export default function Auditoria({
    pendingUsers = [],
    rejectedUsers = [],
    allUsers = [],
    auditLogs = [],
}) {
    const ITEMS_PER_PAGE = 5;
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const actionLabel = (action) => {
        const labels = {
            "user.activated": "Usuario activado",
            "user.rejected": "Solicitud rechazada",
            "user.reopened": "Solicitud reabierta",
            "user.toggled_status": "Estado cambiado",
            "user.deleted": "Usuario eliminado",
        };

        return labels[action] ?? action;
    };

    const events = useMemo(() => {
        if (auditLogs.length > 0) {
            return auditLogs
                .map((log) => ({
                    id: `log-${log.id}`,
                    user: log.target_user_name || "Usuario",
                    email: log.target_user_email || "Sin correo",
                    type: actionLabel(log.action),
                    detail: log.metadata?.status
                        ? `Estado: ${log.metadata.status}`
                        : "Sin detalle adicional",
                    actor: log.actor_name || "Administrador",
                    ip: log.ip_address || "N/A",
                    dateRaw: log.created_at,
                    dateTime: new Date(log.created_at).toLocaleString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                }))
                .sort((a, b) => new Date(b.dateRaw) - new Date(a.dateRaw));
        }

        const pendingEvents = pendingUsers.map((user) => ({
            id: `pending-${user.id}`,
            user: user.name,
            email: user.email,
            type: "Pendiente",
            detail: "Solicitud de registro en espera de revisión.",
            actor: "Sistema",
            ip: "N/A",
            dateRaw: user.created_at,
        }));

        const rejectedEvents = rejectedUsers.map((user) => ({
            id: `rejected-${user.id}`,
            user: user.name,
            email: user.email,
            type: "Rechazado",
            detail: "Solicitud rechazada por un administrador.",
            actor: "Administrador",
            ip: "N/A",
            dateRaw: user.created_at,
        }));

        const activeEvents = allUsers.map((user) => ({
            id: `active-${user.id}`,
            user: user.name,
            email: user.email,
            type: "Activo",
            detail: "Cuenta activa dentro de la plataforma.",
            actor: "Sistema",
            ip: "N/A",
            dateRaw: user.created_at,
        }));

        return [...pendingEvents, ...rejectedEvents, ...activeEvents]
            .map((event) => ({
                ...event,
                date: new Date(event.dateRaw).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                }),
                dateTime: new Date(event.dateRaw).toLocaleString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            }))
            .sort((a, b) => new Date(b.dateRaw) - new Date(a.dateRaw));
    }, [auditLogs, pendingUsers, rejectedUsers, allUsers]);

    const filteredEvents = useMemo(() => {
        return events.filter((event) => {
            const matchesSearch =
                event.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.detail.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesType =
                typeFilter === "all" || event.type === typeFilter;

            const eventDate = new Date(event.dateRaw);
            const fromDate = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
            const toDate = dateTo ? new Date(`${dateTo}T23:59:59`) : null;

            const matchesDateFrom = !fromDate || eventDate >= fromDate;
            const matchesDateTo = !toDate || eventDate <= toDate;

            return (
                matchesSearch && matchesType && matchesDateFrom && matchesDateTo
            );
        });
    }, [events, searchTerm, typeFilter, dateFrom, dateTo]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, typeFilter, dateFrom, dateTo]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredEvents.length / ITEMS_PER_PAGE),
    );

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const paginatedEvents = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredEvents, currentPage]);

    const startItem =
        filteredEvents.length === 0
            ? 0
            : (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem =
        filteredEvents.length === 0
            ? 0
            : Math.min(currentPage * ITEMS_PER_PAGE, filteredEvents.length);

    const clearFilters = () => {
        setSearchTerm("");
        setTypeFilter("all");
        setDateFrom("");
        setDateTo("");
    };

    const handlePrint = () => {
        const rows = filteredEvents
            .map(
                (event) => `
          <tr>
            <td>${event.user}</td>
            <td>${event.email}</td>
            <td>${event.type}</td>
            <td>${event.actor}</td>
            <td>${event.detail}</td>
            <td>${event.ip}</td>
            <td>${event.dateTime}</td>
          </tr>
        `,
            )
            .join("");

        const printWindow = window.open("", "_blank", "width=1200,height=800");

        if (!printWindow) return;

        printWindow.document.write(`
      <html>
        <head>
          <title>Auditoría</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
            h1 { margin-bottom: 8px; }
            p { margin-top: 0; color: #475569; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px; font-size: 12px; text-align: left; }
            th { background: #f1f5f9; }
          </style>
        </head>
        <body>
          <h1>Reporte de Auditoría</h1>
          <p>Eventos: ${filteredEvents.length}</p>
          <table>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Correo</th>
                <th>Acción</th>
                <th>Realizado por</th>
                <th>Detalle</th>
                <th>IP</th>
                <th>Fecha y hora</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </body>
      </html>
    `);

        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    const stats = useMemo(() => {
        const pendientes = events.filter(
            (event) => event.type === "Pendiente",
        ).length;
        const rechazados = events.filter(
            (event) => event.type === "Rechazado",
        ).length;
        const activos = events.filter(
            (event) =>
                event.type === "Activo" || event.type === "Usuario activado",
        ).length;

        return { pendientes, rechazados, activos };
    }, [events]);

    const formatonombre = (name) => {
        const normalized = (name || "").replace(/\s+/g, " ").trim();
        const words = normalized ? normalized.split(" ") : [];

        const top = words.slice(0, 2).join(" ") || "Sin nombre";
        let bottom = words.slice(2, 4).join(" ");

        if (words.length > 4) {
            bottom = `${bottom}…`;
        }

        return { top, bottom };
    };

    const typeBadgeClass = (type) => {
        if (type === "Pendiente") {
            return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
        }

        if (type === "Rechazado") {
            return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
        }

        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    };

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Auditoría
                </h2>
                <p className="mt-1 text-sm opacity-70">
                    Seguimiento de estados de cuentas y solicitudes
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Pendientes
                    </p>
                    <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">
                        {stats.pendientes}
                    </p>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Rechazadas
                    </p>
                    <p className="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">
                        {stats.rechazados}
                    </p>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Activos
                    </p>
                    <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
                        {stats.activos}
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="flex-1 relative">
                        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm"></i>
                        <input
                            type="text"
                            placeholder="Buscar en auditoría..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-[#009688] focus:border-transparent transition-all"
                        />
                    </div>

                    <div className="sm:w-44">
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#009688] focus:border-transparent transition-all appearance-none cursor-pointer"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                                backgroundPosition: "right 0.5rem center",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "1.5em 1.5em",
                                paddingRight: "2.5rem",
                            }}
                        >
                            <option value="all">Tipo</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="Rechazado">Rechazado</option>
                            <option value="Activo">Activo</option>
                        </select>
                    </div>

                    <div className="sm:w-44">
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#009688] focus:border-transparent transition-all"
                        />
                    </div>

                    <div className="sm:w-44">
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#009688] focus:border-transparent transition-all"
                        />
                    </div>

                    <div className="flex gap-2 sm:w-auto">
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                            Limpiar
                        </button>

                        <button
                            type="button"
                            onClick={handlePrint}
                            className="px-4 py-2.5 rounded-xl bg-[#009688] text-white hover:bg-[#00796B] transition flex items-center gap-2"
                        >
                            <i className="fa-solid fa-print"></i>
                            Imprimir
                        </button>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                        Eventos del Sistema
                    </h3>
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                        {filteredEvents.length}{" "}
                        {filteredEvents.length === 1 ? "evento" : "eventos"}
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
                                            Acción
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                            Realizado por
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                            Detalle
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                            IP
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                            Fecha y hora
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                                    {filteredEvents.length > 0 ? (
                                        paginatedEvents.map((event) => (
                                            <tr
                                                key={event.id}
                                                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                            >
                                                <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                                                    <div className="leading-tight">
                                                        <p className="whitespace-nowrap">
                                                            {
                                                                formatonombre(
                                                                    event.user,
                                                                ).top
                                                            }
                                                        </p>
                                                        {formatonombre(
                                                            event.user,
                                                        ).bottom && (
                                                            <p className="whitespace-nowrap text-slate-600 dark:text-slate-400">
                                                                {
                                                                    formatonombre(
                                                                        event.user,
                                                                    ).bottom
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                                                    {event.email}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${typeBadgeClass(event.type)}`}
                                                    >
                                                        {event.type}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                                                    <div className="leading-tight">
                                                        <p className="whitespace-nowrap text-slate-700 dark:text-slate-300">
                                                            {
                                                                formatonombre(
                                                                    event.actor,
                                                                ).top
                                                            }
                                                        </p>
                                                        {formatonombre(
                                                            event.actor,
                                                        ).bottom && (
                                                            <p className="whitespace-nowrap">
                                                                {
                                                                    formatonombre(
                                                                        event.actor,
                                                                    ).bottom
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 max-w-xs">
                                                    {event.detail}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                                                    {event.ip}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                                    {event.dateTime}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="px-4 py-8 text-center text-slate-500 dark:text-slate-400"
                                            >
                                                <div className="flex flex-col items-center gap-2">
                                                    <i className="fa-solid fa-clock-rotate-left text-3xl opacity-50"></i>
                                                    <p className="text-sm">
                                                        No hay eventos para
                                                        mostrar
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

                {filteredEvents.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                            Mostrando {startItem}-{endItem} de{" "}
                            {filteredEvents.length}
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
