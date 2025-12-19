import React, { useEffect, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";

function TopLink({ href, active, children }) {
    return (
        <Link
            href={href}
            className={[
                "relative px-3 py-5 text-sm font-semibold transition",
                active ? "text-white" : "text-white/85 hover:text-white",
                "outline-none focus:outline-none",
            ].join(" ")}
        >
            {children}
            <span
                className={[
                    "absolute left-3 right-3 bottom-3 h-[2px] rounded-full transition",
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
        () => localStorage.getItem("theme") || "dark"
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

    const isAdmin = user?.role === "admin";
    const isPet = route().current("pet.*");

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-950">
            <nav className="bg-[#009688] border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        {/* IZQUIERDA */}
                        <div className="flex items-center gap-4">
                            <Link
                                href={route("dashboard")}
                                className="flex items-center gap-2"
                            >
                                <ApplicationLogo className="block h-8 w-auto fill-current text-white" />
                                <span className="text-white font-extrabold tracking-wide">
                                    Estación Meteorológica
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

                                {/* ADMIN DESKTOP */}
                                {isAdmin && (
                                    <>
                                        <TopLink
                                            href={route("admin.users")}
                                            active={route().current(
                                                "admin.users"
                                            )}
                                        >
                                            Usuarios
                                        </TopLink>

                                        <TopLink
                                            href={route("admin.panel")}
                                            active={route().current(
                                                "admin.panel"
                                            )}
                                        >
                                            Admin
                                        </TopLink>
                                    </>
                                )}

                                {/* PET DESKTOP (si existe) */}
                                {isAdmin && route().has("pet.index") && (
                                    <TopLink
                                        href={route("pet.index")}
                                        active={isPet}
                                    >
                                        Lanzamiento de Cohetes
                                    </TopLink>
                                )}
                            </div>
                        </div>

                        {/* DERECHA DESKTOP */}
                        <div className="hidden sm:flex sm:items-center gap-4">
                            {/* Toggle Día/Noche */}
                            <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/15">
                                <button
                                    onClick={() => setTheme("light")}
                                    className={[
                                        "px-3 py-1.5 rounded-lg text-xs font-semibold transition",
                                        theme === "light"
                                            ? "bg-white text-slate-900"
                                            : "text-white/80 hover:bg-white/10",
                                    ].join(" ")}
                                    type="button"
                                >
                                    <i className="fa-solid fa-sun"></i>
                                </button>

                                <button
                                    onClick={() => setTheme("dark")}
                                    className={[
                                        "px-3 py-1.5 rounded-lg text-xs font-semibold transition",
                                        theme === "dark"
                                            ? "bg-white text-slate-900"
                                            : "text-white/80 hover:bg-white/10",
                                    ].join(" ")}
                                    type="button"
                                >
                                    <i className="fa-solid fa-moon"></i>
                                </button>
                            </div>

                            {/* USER */}
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-3 py-2 border border-white/15 text-sm font-medium rounded-xl text-white bg-white/10 hover:bg-white/15 transition"
                                    >
                                        {user?.name}
                                        <svg
                                            className="ml-2 h-4 w-4"
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
                                    <Dropdown.Link href={route("profile.edit")}>
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

                        {/* BOTON MOBILE */}
                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown((p) => !p)
                                }
                                className="inline-flex items-center justify-center p-2 rounded-md text-white/90 hover:text-white hover:bg-white/10"
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
                        " sm:hidden"
                    }
                >
                    <div className="pt-2 pb-3 space-y-1 px-4">
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

                        {/* ADMIN MOBILE */}
                        {isAdmin && (
                            <>
                                <ResponsiveNavLink
                                    href={route("admin.users")}
                                    active={route().current("admin.users")}
                                >
                                    Usuarios
                                </ResponsiveNavLink>

                                <ResponsiveNavLink
                                    href={route("admin.panel")}
                                    active={route().current("admin.panel")}
                                >
                                    Admin
                                </ResponsiveNavLink>
                            </>
                        )}

                        {/* PET MOBILE (si existe) */}
                        {isAdmin && route().has("pet.index") && (
                            <ResponsiveNavLink
                                href={route("pet.index")}
                                active={isPet}
                            >
                                Lanzamiento de Cohetes
                            </ResponsiveNavLink>
                        )}
                    </div>

                    <div className="pt-4 pb-1 border-t border-white/15">
                        <div className="px-4">
                            <div className="font-medium text-base text-white">
                                {user?.name}
                            </div>
                            <div className="font-medium text-sm text-white/80">
                                {user?.email}
                            </div>
                        </div>

                        {/* Toggle mobile */}
                        <div className="mt-3 px-4 pb-2">
                            <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/15 w-fit">
                                <button
                                    onClick={() => setTheme("light")}
                                    className={[
                                        "px-3 py-1.5 rounded-lg text-xs font-semibold transition",
                                        theme === "light"
                                            ? "bg-white text-slate-900"
                                            : "text-white/80 hover:bg-white/10",
                                    ].join(" ")}
                                    type="button"
                                >
                                    Día
                                </button>
                                <button
                                    onClick={() => setTheme("dark")}
                                    className={[
                                        "px-3 py-1.5 rounded-lg text-xs font-semibold transition",
                                        theme === "dark"
                                            ? "bg-white text-slate-900"
                                            : "text-white/80 hover:bg-white/10",
                                    ].join(" ")}
                                    type="button"
                                >
                                    Noche
                                </button>
                            </div>
                        </div>

                        <div className="mt-2 space-y-1 px-4 pb-4">
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
