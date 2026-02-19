import React, { useEffect, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import logo_liner_s from "../../images/Logo_liner_s.png";

function TopLink({ href, active, children }) {
    return (
        <Link
            href={href}
            className={[
                "relative px-2 sm:px-3 py-4 sm:py-5 text-xs sm:text-sm font-semibold transition",
                active ? "text-white" : "text-white/85 hover:text-white",
                "outline-none focus:outline-none",
            ].join(" ")}
        >
            {children}
            <span
                className={[
                    "absolute left-2 right-2 bottom-3 h-[2px] rounded-full transition",
                    active ? "bg-white" : "bg-transparent",
                ].join(" ")}
            />
        </Link>
    );
}

export default function AuthenticatedLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const [theme, setTheme] = useState(
        () => localStorage.getItem("theme") || "dark",
    );

    useEffect(() => {
        localStorage.setItem("theme", theme);

        const root = document.documentElement;
        if (theme === "dark") root.classList.add("dark");
        else root.classList.remove("dark");
    }, [theme]);

    const current = route().current();
    const isInicio = current === "dashboard";
    const isWind = current === "dashboard.wind";
    const isTemp = current === "dashboard.temp";
    const isClimate = current === "dashboard.climate";

    const isAdmin = user?.role === "admin";
    const canAccessLauncher =
        user?.role === "admin" || user?.role === "launcher";
    const isLanzamientos = route().current("lanzamientos.*");

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-950">
            <nav className="bg-[#009688] border-b border-white/10">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
                    <div className="flex justify-between h-14 sm:h-16 lg:h-20 items-center">
                        {/* IZQUIERDA */}
                        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
                            <Link
                                href={route("dashboard")}
                                className="flex items-center gap-2"
                            >
                                <img
                                        src={logo_liner_s}
                                        alt="Logo Estaci??n Meteorol??gica"
                                        className="h-16 w-auto sm:h-26 md:h-28 object-contain
                                        drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]
                                        sm:drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]
                                        sm:mt-[6px] md:mt-[8px]"
                                    />
                                {/*<ApplicationLogo className="block h-8 w-auto fill-current text-white" />*/}
                                <span className="text-white font-extrabold tracking-wide">
                                    METEOR
                                </span>
                            </Link>

                            {/* LINKS DESKTOP */}
                            <div className="hidden sm:flex items-center">
                                <TopLink
                                    href={route("dashboard")}
                                    active={isInicio}
                                >
                                    Inicio
                                </TopLink>

                                <TopLink
                                    href={route("dashboard.wind")}
                                    active={isWind}
                                >
                                    Viento
                                </TopLink>

                                <TopLink
                                    href={route("dashboard.temp")}
                                    active={isTemp}
                                >
                                    Temperatura
                                </TopLink>
                                <TopLink
                                    href={route("dashboard.climate")}
                                    active={isClimate}
                                >
                                    Clima
                                </TopLink>
                                {/* LANZAMIENTOS - Admin y Launcher */}
                                {canAccessLauncher &&
                                    route().has("lanzamientos.index") && (
                                        <TopLink
                                            href={route("lanzamientos.index")}
                                            active={isLanzamientos}
                                        >
                                            Lanzamiento de Cohetes
                                        </TopLink>
                                    )}

                                {/* PANEL ADMIN - Solo Admin */}
                                {isAdmin && (
                                    <>
                                        <TopLink
                                            href={route("admin.panel")}
                                            active={route().current(
                                                "admin.panel",
                                            )}
                                        >
                                            Panel de Administración
                                        </TopLink>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* DERECHA DESKTOP */}
                        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                            {/* Toggle Día/Noche - Solo en desktop */}
                            <div className="hidden sm:flex items-center gap-0.5 bg-white/10 p-0.5 rounded-lg border border-white/15">
                                <button
                                    onClick={() => setTheme("light")}
                                    className={[
                                        "px-2 py-1.5 rounded text-xs font-semibold transition",
                                        theme === "light"
                                            ? "bg-white text-slate-900"
                                            : "text-white/80 hover:bg-white/10",
                                    ].join(" ")}
                                    type="button"
                                    title="Modo claro"
                                >
                                    <i className="fa-solid fa-sun"></i>
                                </button>

                                <button
                                    onClick={() => setTheme("dark")}
                                    className={[
                                        "px-2 py-1.5 rounded text-xs font-semibold transition",
                                        theme === "dark"
                                            ? "bg-white text-slate-900"
                                            : "text-white/80 hover:bg-white/10",
                                    ].join(" ")}
                                    type="button"
                                    title="Modo oscuro"
                                >
                                    <i className="fa-solid fa-moon"></i>
                                </button>
                            </div>

                            {/* USER - Solo desktop */}
                            <div className="hidden sm:block">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            type="button"
                                            className="inline-flex items-center px-2 sm:px-3 lg:px-4 py-2 border border-white/15 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl text-white bg-white/10 hover:bg-white/15 transition"
                                        >
                                            <span className="truncate max-w-[80px] sm:max-w-none">
                                                {user?.name?.split(" ")[0]}
                                            </span>
                                            <svg
                                                className="ml-1 sm:ml-2 h-3 sm:h-4 w-3 sm:w-4"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href="/">
                                            Inicio
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                        >
                                            Perfil
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                        >
                                            Cerrar sesión
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* MOBILE - Toggle + Hamburguesa */}
                        <div className="sm:hidden flex items-center gap-1">
                            {/* Toggle Día/Noche - Solo móvil */}
                            <div className="flex items-center gap-0.5 bg-white/10 p-0.5 rounded-lg border border-white/15">
                                <button
                                    onClick={() => setTheme("light")}
                                    className={[
                                        "px-1.5 py-1 rounded text-xs font-semibold transition",
                                        theme === "light"
                                            ? "bg-white text-slate-900"
                                            : "text-white/80 hover:bg-white/10",
                                    ].join(" ")}
                                    type="button"
                                    title="Modo claro"
                                >
                                    <i className="fa-solid fa-sun"></i>
                                </button>

                                <button
                                    onClick={() => setTheme("dark")}
                                    className={[
                                        "px-1.5 py-1 rounded text-xs font-semibold transition",
                                        theme === "dark"
                                            ? "bg-white text-slate-900"
                                            : "text-white/80 hover:bg-white/10",
                                    ].join(" ")}
                                    type="button"
                                    title="Modo oscuro"
                                >
                                    <i className="fa-solid fa-moon"></i>
                                </button>
                            </div>

                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown((p) => !p)
                                }
                                className="inline-flex items-center justify-center p-1.5 rounded-md text-white/90 hover:text-white hover:bg-white/10 transition"
                                type="button"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* MENU MOBILE */}
                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " sm:hidden bg-[#00897B]"
                    }
                >
                    <div className="pt-2 pb-2 space-y-1 px-2">
                        <ResponsiveNavLink
                            href={route("dashboard")}
                            active={isInicio}
                        >
                            Inicio
                        </ResponsiveNavLink>

                        <ResponsiveNavLink
                            href={route("dashboard.wind")}
                            active={isWind}
                        >
                            Viento
                        </ResponsiveNavLink>

                        <ResponsiveNavLink
                            href={route("dashboard.temp")}
                            active={isTemp}
                        >
                            Temperatura
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route("dashboard.climate")}
                            active={isClimate}
                        >
                            Clima
                        </ResponsiveNavLink>

                        {/* LANZAMIENTOS MOBILE - Admin y Launcher */}
                        {canAccessLauncher &&
                            route().has("lanzamientos.index") && (
                                <ResponsiveNavLink
                                    href={route("lanzamientos.index")}
                                    active={isLanzamientos}
                                >
                                    Lanzamientos de Cohetes
                                </ResponsiveNavLink>
                            )}

                         {/* ADMIN MOBILE */}
                        {isAdmin && (
                            <>
                                <ResponsiveNavLink
                                    href={route("admin.panel")}
                                    active={route().current("admin.panel")}
                                >
                                    Panel de Administración
                                </ResponsiveNavLink>
                            </>
                        )}
                    </div>

                    <div className="pt-2 pb-2 border-t border-white/15">
                        <div className="px-2 py-1">
                            <div className="font-medium text-xs text-white truncate">
                                {user?.name}
                            </div>
                            <div className="font-medium text-xs text-white/70 truncate">
                                {user?.email}
                            </div>
                        </div>

                        <div className="mt-2 space-y-1 px-2">
                            <ResponsiveNavLink href="/">
                                Inicio
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route("profile.edit")}>
                                Perfil
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                as="button"
                            >
                                Cerrar sesión
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {/* CONTENIDO */}
            <main>{children}</main>
        </div>
    );
}
