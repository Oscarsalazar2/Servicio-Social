import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useMemo, useState } from "react";
import FlashMessages from "@/Components/FlashMessages";

import Usuarios from "./section/Usuarios";
import Activaciones from "./section/Activaciones";
import Rechazados from "./section/Rechazados";
import Auditoria from "./section/Auditoria";
import Reportes from "./section/Reportes";
import Configuracion from "./section/Configuracion";

export default function AdminIndex({
    pendingActivations = 0,
    rejectedCount = 0,
    pendingUsers = [],
    rejectedUsers = [],
    allUsers = [],
    auditLogs = [],
}) {
    const [section, setSection] = useState("usuarios");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(true);

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
                {
                    key: "rechazados",
                    label: "Rechazadas",
                    icon: "fa-user-xmark",
                    badge: rejectedCount,
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

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    // Mapa de secciones -> componente
    const SectionComponent = useMemo(() => {
        const map = {
            usuarios: Usuarios,
            activaciones: Activaciones,
            rechazados: Rechazados,
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

            {/* MENÚ HORIZONTAL MÓVIL - Mismo diseño que sidebar */}
            <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm">
                {/* Botón toggle */}
                <button
                    onClick={toggleMobileMenu}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition font-semibold text-slate-700 dark:text-white"
                    type="button"
                >
                    <span>Menú de Administración</span>
                    <i
                        className={`fa-solid ${
                            mobileMenuOpen ? "fa-chevron-up" : "fa-chevron-down"
                        } transition-transform duration-300 ${
                            mobileMenuOpen ? "rotate-0" : "rotate-180"
                        }`}
                    ></i>
                </button>

                {/* Contenido expandible */}
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out origin-top ${
                        mobileMenuOpen
                            ? "scale-y-100 opacity-100 visible max-h-96"
                            : "scale-y-0 opacity-0 invisible max-h-0"
                    }`}
                >
                    <div className="overflow-x-auto border-t border-slate-200 dark:border-slate-700">
                        <div className="flex gap-6 p-4 min-w-min">
                            {menuGroups.map((group) => (
                                <div
                                    key={group.title}
                                    className="flex flex-col gap-2"
                                >
                                    {/* Título del grupo */}
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-2">
                                        {group.title}
                                    </span>

                                    {/* Items */}
                                    <div className="flex gap-2 flex-col">
                                        {group.items.map((item) => {
                                            const active = section === item.key;
                                            return (
                                                <button
                                                    key={item.key}
                                                    onClick={() => {
                                                        setSection(item.key);
                                                        setMobileMenuOpen(
                                                            false,
                                                        );
                                                    }}
                                                    className={[
                                                        "flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition relative whitespace-nowrap",
                                                        active
                                                            ? "bg-[#009688] text-white shadow-md"
                                                            : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-white/80 dark:hover:bg-slate-700",
                                                    ].join(" ")}
                                                    type="button"
                                                    title={item.label}
                                                >
                                                    <i
                                                        className={`fa-solid ${item.icon} text-base w-5`}
                                                    />
                                                    <span className="flex-1 text-left">
                                                        {item.label}
                                                    </span>

                                                    {/* Badge */}
                                                    {item.badge !== undefined &&
                                                        item.badge > 0 && (
                                                            <span
                                                                className={[
                                                                    "flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs font-bold",
                                                                    active
                                                                        ? "bg-white text-[#009688]"
                                                                        : "bg-[#009688] text-white",
                                                                ].join(" ")}
                                                            >
                                                                {item.badge}
                                                            </span>
                                                        )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-3 sm:p-4 md:p-6 text-slate-900 dark:text-white">
                <div className="mt-4 sm:mt-6 flex flex-col lg:flex-row gap-4 lg:gap-6 justify-center max-w-7xl mx-auto">
                    {/* Sidebar - Solo visible en lg y superior */}
                    <aside
                        className={[
                            "hidden lg:block relative transition-all duration-300 ease-in-out rounded-xl sm:rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900",
                            sidebarOpen
                                ? "w-72 p-4 opacity-100"
                                : "w-16 p-2 opacity-100 overflow-hidden",
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
                    <section className="w-full lg:flex-1 rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 min-h-[500px]">
                        <SectionComponent
                            pendingUsers={pendingUsers}
                            rejectedUsers={rejectedUsers}
                            allUsers={allUsers}
                            auditLogs={auditLogs}
                        />
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
