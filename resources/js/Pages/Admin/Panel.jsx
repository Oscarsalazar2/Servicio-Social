import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useMemo, useState } from "react";
import FlashMessages from "@/Components/FlashMessages";

import Usuarios from "./section/Usuarios";
import Activaciones from "./section/Activaciones";
import Auditoria from "./section/Auditoria";
import Reportes from "./section/Reportes";
import Configuracion from "./section/Configuracion";

export default function AdminIndex({
    pendingActivations = 0,
    pendingUsers = [],
    allUsers = [],
}) {
    const [section, setSection] = useState("usuarios");
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Organización de menú por grupos
    const menuGroups = [
        {
            title: "GESTIÓN",
            items: [
                { key: "usuarios", label: "Usuarios", icon: "fa-users" },
                {
                    key: "activaciones",
                    label: "Activaciones",
                    icon: "fa-user-clock",
                    badge: pendingActivations,
                },
            ],
        },
        {
            title: "INFORMES",
            items: [
                {
                    key: "auditoria",
                    label: "Auditoría",
                    icon: "fa-clock-rotate-left",
                },
                { key: "reportes", label: "Reportes", icon: "fa-file-lines" },
            ],
        },
        {
            title: "SISTEMA",
            items: [
                {
                    key: "configuracion",
                    label: "Configuración",
                    icon: "fa-cogs",
                },
            ],
        },
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
            <FlashMessages />

            <div className="p-3 sm:p-4 md:p-6 text-slate-900 dark:text-white">
                <div className="mt-4 sm:mt-6 flex flex-col lg:flex-row gap-4 lg:gap-6 justify-center max-w-7xl mx-auto">
                    {/* Sidebar */}
                    <aside
                        className={[
                            "relative transition-all duration-300 ease-in-out rounded-xl sm:rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900",
                            sidebarOpen
                                ? "w-full lg:w-72 p-4 opacity-100"
                                : "w-0 lg:w-16 p-0 lg:p-2 opacity-0 lg:opacity-100 overflow-hidden",
                      ].join(" ")}
                    >
                        <nav
                            className={sidebarOpen ? "space-y-6" : "space-y-3"}
                        >
                            {menuGroups.map((group, index) => (
                                <div key={group.title}>
                                    {/* Título del grupo con botón toggle en el primero */}
                                    {sidebarOpen && (
                                        <div className="mb-3 px-3 flex items-center justify-between">
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                                {group.title}
                                            </span>
                                            {/* Botón solo en el primer grupo */}
                                            {index === 0 && (
                                                <button
                                                    onClick={() =>
                                                        setSidebarOpen(
                                                            !sidebarOpen,
                                                        )
                                                    }
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition-all"
                                                    type="button"
                                                    title="Ocultar menú"
                                                >
                                                    <i className="fa-solid fa-chevron-left text-xs"></i>
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {/* Cuando está minimizado, mostrar botón arriba */}
                                    {!sidebarOpen && index === 0 && (
                                        <div className="mb-2 flex justify-center">
                                            <button
                                                onClick={() =>
                                                    setSidebarOpen(!sidebarOpen)
                                                }
                                                className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#009688] text-white hover:bg-[#00796B] shadow-md transition-all"
                                                type="button"
                                                title="Mostrar menú"
                                            >
                                                <i className="fa-solid fa-chevron-right text-sm"></i>
                                            </button>
                                        </div>
                                    )}

                                    {/* Items del grupo */}
                                    <div
                                        className={
                                            sidebarOpen
                                                ? "space-y-1"
                                                : "space-y-2"
                                        }
                                    >
                                        {group.items.map((item) => {
                                            const active = section === item.key;
                                            return (
                                                <button
                                                    key={item.key}
                                                    onClick={() =>
                                                        setSection(item.key)
                                                    }
                                                    className={[
                                                        "flex items-center rounded-xl font-semibold transition relative",
                                                        sidebarOpen
                                                            ? "w-full gap-3 px-4 py-3 text-sm"
                                                            : "w-10 h-10 justify-center",
                                                        active
                                                            ? "bg-[#009688] text-white shadow-md"
                                                            : "text-slate-700 hover:bg-slate-100 dark:text-white/80 dark:hover:bg-white/5",
                                                    ].join(" ")}
                                                    type="button"
                                                    title={
                                                        !sidebarOpen
                                                            ? item.label
                                                            : ""
                                                    }
                                                >
                                                    <i
                                                        className={`fa-solid ${item.icon} text-base ${sidebarOpen ? "w-5" : ""}`}
                                                    />

                                                    {sidebarOpen && (
                                                        <>
                                                            <span className="flex-1 text-left">
                                                                {item.label}
                                                            </span>

                                                            {/* Badge (número) */}
                                                            {item.badge !==
                                                                undefined &&
                                                                item.badge >
                                                                    0 && (
                                                                    <span
                                                                        className={[
                                                                            "flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs font-bold",
                                                                            active
                                                                                ? "bg-white text-[#009688]"
                                                                                : "bg-[#009688] text-white",
                                                                        ].join(
                                                                            " ",
                                                                        )}
                                                                    >
                                                                        {
                                                                            item.badge
                                                                        }
                                                                    </span>
                                                                )}
                                                        </>
                                                    )}

                                                    {/* Badge minimizado (punto rojo) */}
                                                    {!sidebarOpen &&
                                                        item.badge !==
                                                            undefined &&
                                                        item.badge > 0 && (
                                                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                                                        )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </nav>
                    </aside>

                    {/* Contenido */}
                    <section className="flex-1 rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 min-h-[500px]">
                        <SectionComponent
                            pendingUsers={pendingUsers}
                            allUsers={allUsers}
                        />
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
