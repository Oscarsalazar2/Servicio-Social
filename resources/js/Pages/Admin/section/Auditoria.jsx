import { useEffect, useMemo, useState } from "react";
import logo_liner_s from "../../../../images/logo_copia.png";

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
            "user.updated": "Cuenta actualizada",
            "user.deleted": "Usuario eliminado",
        };

        return labels[action] ?? action;
    };

    const formatValue = (field, value) => {
        if (field === "is_active") {
            return value ? "Activo" : "Inactivo";
        }

        if (field === "role") {
            const roleMap = {
                admin: "Admin",
                launcher: "Lanzador",
                user: "Usuario",
                rejected: "Rechazado",
            };

            return roleMap[value] ?? value;
        }

        return value;
    };

    const formatStatus = (status) => {
        const statusMap = {
            active: "activo",
            rejected: "rechazado",
            pending: "pendiente",
            deleted: "eliminado",
            suspended: "suspendido",
        };

        return statusMap[status] ?? status;
    };

    const formatDetail = (log) => {
        if (log.action === "user.updated") {
            const oldValues = log.metadata?.old ?? {};
            const newValues = log.metadata?.new ?? {};

            const fieldLabels = {
                name: "Nombre",
                email: "Correo",
                role: "Rol",
                is_active: "Estado",
            };

            const changes = Object.keys(fieldLabels)
                .filter((field) => oldValues[field] !== newValues[field])
                .map((field) => {
                    const oldValue = formatValue(field, oldValues[field]);
                    const newValue = formatValue(field, newValues[field]);
                    return `${fieldLabels[field]}: ${oldValue} → ${newValue}`;
                });

            return changes.length > 0
                ? `Se cambió ${changes.join(" | ")}`
                : "Cuenta actualizada sin cambios detectados.";
        }

        if (log.metadata?.status) {
            return `Estado: ${formatStatus(log.metadata.status)}`;
        }

        return "Sin detalle adicional";
    };

    const events = useMemo(() => {
        if (auditLogs.length > 0) {
            return auditLogs
                .map((log) => ({
                    id: `log-${log.id}`,
                    user: log.target_user_name || "Usuario",
                    email: log.target_user_email || "Sin correo",
                    type: actionLabel(log.action),
                    detail: formatDetail(log),
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
          <td class="mono">${event.user ?? ""}</td>
          <td>${event.email ?? ""}</td>
          <td><span class="badge">${event.type ?? ""}</span></td>
          <td>${event.actor ?? ""}</td>
          <td class="detail" title="${String(event.detail ?? "").replace(/"/g, "&quot;")}">${event.detail ?? ""}</td>
          <td class="mono">${event.ip ?? ""}</td>
          <td class="mono">${event.dateTime ?? ""}</td>
        </tr>
      `,
            )
            .join("");

        const printWindow = window.open("", "_blank", "width=1200,height=800");
        if (!printWindow) return;

        const now = new Date();
        const printedAt = now.toLocaleString("es-MX", {
            year: "numeric",
            month: "long",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });

        printWindow.document.write(`
<html>
  <head>
    <title>METEOR • Reporte de Auditoría</title>
    <meta charset="utf-8" />
    <style>
      :root{
        --bg: #ffffff;
        --text: #0b1220;
        --muted: #526175;
        --line: #e6edf5;

        /* Accent METEOR (ajústalo a tu marca) */
        --accent: #2563eb;  /* azul serio */
        --accent2:#22c55e;  /* verde */
        --thead: #0b1220;   /* header tabla oscuro */
        --theadText: #ffffff;

        --chipBg: #eff6ff;
        --chipTx: #1d4ed8;
      }

      *{ box-sizing:border-box; }
      body{
        margin:0;
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Helvetica Neue", sans-serif;
        background: var(--bg);
        color: var(--text);
      }
      .page{
        padding: 18px 18px 14px;
        max-width: 1300px;
        margin: 0 auto;
      }

      /* Header corporativo blanco */
      .head{
        border: 1px solid var(--line);
        border-radius: 14px;
        overflow: hidden;
      }
      .accentbar{
        height: 8px;
        background: linear-gradient(90deg, var(--accent), var(--accent2));
      }
      .headinner{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap: 16px;
        padding: 14px 16px;
        background: #fff;
      }

      .brand{
        display:flex;
        align-items:center;
        gap: 14px;
        min-width: 0;
      }

      /* LOGO GRANDE y limpio */
      .logoBox{
        width: 110px;
        height: 110px;
        border-radius: 14px;
        background: #fff;
        display:grid;
        place-items:center;
        overflow:hidden;
      }
      .logo{
        width: 100%;
        height: 100%;
        object-fit: contain;
        padding: 10px; /* quita si tu logo ya viene recortado */
      }

      .brandText{ min-width:0; }
      .brandName{
        margin:0;
        font-size: 12px;
        letter-spacing:.22em;
        text-transform:uppercase;
        color: var(--muted);
        font-weight: 800;
      }
      .title{
        margin: 6px 0 0;
        font-size: 20px;
        font-weight: 900;
        letter-spacing: .2px;
      }
      .subtitle{
        margin: 6px 0 0;
        color: var(--muted);
        font-size: 12px;
        line-height: 1.35;
      }

      .meta{
        text-align:right;
        font-size: 12px;
        color: var(--muted);
        white-space:nowrap;
      }
      .meta strong{ color: var(--text); }
      .chip{
        display:inline-flex;
        gap:8px;
        align-items:center;
        margin-top:8px;
        padding: 7px 10px;
        border-radius: 999px;
        background: var(--chipBg);
        color: var(--chipTx);
        border: 1px solid #dbeafe;
        font-size: 11px;
        font-weight: 800;
      }

      .stats{
        margin-top: 12px;
        display:grid;
        grid-template-columns: repeat(3, minmax(0,1fr));
        gap: 10px;
      }
      .stat{
        border: 1px solid var(--line);
        border-radius: 14px;
        padding: 12px 12px;
        background: #fff;
      }
      .stat .k{ margin:0; color: var(--muted); font-size: 11px; }
      .stat .v{ margin:6px 0 0; font-size: 18px; font-weight: 900; }

      .card{
        margin-top: 12px;
        border: 1px solid var(--line);
        border-radius: 14px;
        overflow:hidden;
      }

      /* TABLA: layout fijo + anchos para que no se “rompa” */
      table{
        width:100%;
        border-collapse: collapse;
        table-layout: fixed;
      }
      thead th{
        background: var(--thead);
        color: var(--theadText);
        font-size: 11px;
        letter-spacing: .08em;
        text-transform: uppercase;
        padding: 10px 10px;
        border-bottom: 1px solid #0f172a;
      }
      tbody td{
        padding: 10px 10px;
        font-size: 12px;
        border-bottom: 1px solid var(--line);
        vertical-align: top;
        word-break: break-word;
        overflow-wrap: anywhere;
      }
      tbody tr:nth-child(even) td{ background:#fafcff; }

      .mono{ font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono","Courier New", monospace; }

      .badge {
        display: inline-block;
        padding: 4px 10px;
        color: #1d4ed8;
        font-weight: 850;
        font-size: 11px;
        }

      /* Ajuste fuerte: columna detalle no se aplasta */
      .detail{
        white-space: normal;
        line-height: 1.25;
      }

      /* Anchos por columna (ajústalos a tu gusto) */
      col.user   { width: 12%; }
      col.email  { width: 18%; }
      col.type   { width: 12%; }
      col.actor  { width: 14%; }
      col.detail { width: 28%; }
      col.ip     { width: 8%;  }
      col.dt     { width: 8%;  }

      .footer{
        margin-top: 10px;
        display:flex;
        justify-content:space-between;
        color: var(--muted);
        font-size: 11px;
      }

            /* IMPRESIÓN: vertical (mismo diseño, ajustes de encaje) */
      @media print{
                @page { size: A4 portrait; margin: 10mm; }
        .page{ padding:0; max-width:none; }

                .logoBox{ width: 86px; height: 86px; }
                .title{ font-size: 18px; }
                .subtitle{ font-size: 11px; }
                .meta{ font-size: 11px; }

                thead th{ font-size: 10px; padding: 8px 8px; }
                tbody td{ font-size: 11px; padding: 8px 8px; }

                col.user   { width: 13%; }
                col.email  { width: 18%; }
                col.type   { width: 12%; }
                col.actor  { width: 13%; }
                col.detail { width: 28%; }
                col.ip     { width: 7%;  }
                col.dt     { width: 9%;  }
      }
    </style>
  </head>

  <body>
    <div class="page">
      <div class="head">
        <div class="accentbar"></div>
        <div class="headinner">
          <div class="brand">
            <div class="logoBox">
              <img src="${logo_liner_s}" alt="Logo METEOR" class="logo" />
            </div>

            <div class="brandText">
              <p class="brandName">METEOR</p>
              <h1 class="title">Reporte de Auditoría</h1>
              <p class="subtitle">Registro de eventos filtrados. Útil para revisión, control interno y evidencia.</p>
            </div>
          </div>

          <div class="meta">
            <div><strong>Generado:</strong> ${printedAt}</div>
            <div><strong>Total:</strong> ${filteredEvents.length}</div>
          </div>
        </div>
      </div>

      <div class="card">
        <table>
          <colgroup>
            <col class="user" />
            <col class="email" />
            <col class="type" />
            <col class="actor" />
            <col class="detail" />
            <col class="ip" />
            <col class="dt" />
          </colgroup>

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
            ${rows || `<tr><td colspan="7" style="padding:14px;color:#526175;">No hay eventos para mostrar.</td></tr>`}
          </tbody>
        </table>
      </div>

      <div class="footer">
        <span>Documento generado automáticamente • METEOR</span>
        <span class="mono">Página 1</span>
      </div>
    </div>
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
