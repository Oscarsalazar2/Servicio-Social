import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useMemo, useState } from "react";

import Usuarios from "./section/Usuarios";
import Activaciones from "./section/Activaciones";
import Auditoria from "./section/Auditoria";
import Reportes from "./section/Reportes";
import Configuracion from "./section/Configuracion";

export default function AdminIndex() {
  const [section, setSection] = useState("usuarios");

  const tabs = [
    { key: "usuarios", label: "Usuarios", icon: "fa-users" },
    { key: "activaciones", label: "Activaciones", icon: "fa-user-clock" },
    { key: "auditoria", label: "Auditoría", icon: "fa-clock-rotate-left" },
    { key: "reportes", label: "Reportes", icon: "fa-file-lines" },
    { key: "configuracion", label: "Configuración", icon: "fa-cogs" },
  ];

  // Mapa de secciones -> componente
  const SectionComponent = useMemo(() => {
    const map = {
      usuarios: Usuarios,
      activaciones: Activaciones,
      auditoria: Auditoria,
      reportes: Reportes,
      configuracion: Configuracion,
    };
    return map[section] ?? Usuarios;
  }, [section]);

  return (
    <AuthenticatedLayout>
      <Head title="Admin" />

      <div className="p-3 sm:p-4 md:p-6 text-slate-900 dark:text-white">
        <h1 className="text-lg sm:text-xl font-bold">Panel de administración</h1>

        <div className="mt-4 sm:mt-6 flex flex-col lg:flex-row gap-4">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Secciones
            </div>

            <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 lg:overflow-visible">
              {tabs.map((t) => {
                const active = section === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setSection(t.key)}
                    className={[
                      "flex items-center justify-center sm:justify-start gap-2 rounded-lg sm:rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold transition whitespace-nowrap min-w-[120px] sm:min-w-0",
                      active
                        ? "bg-[#009688] text-white"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10",
                    ].join(" ")}
                    type="button"
                  >
                    <i className={`fa-solid ${t.icon} text-sm`} />
                    <span className="hidden sm:inline">{t.label}</span>
                    <span className="sm:hidden text-xs">{t.label.substring(0, 3)}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Contenido */}
          <section className="flex-1 rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 min-h-[300px]">
            <SectionComponent />
          </section>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
