import { Head, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import logo from "../../Images/logo.png";

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document
            .getElementById("screenshot-container")
            ?.classList.add("!hidden");
        document.getElementById("docs-card")?.classList.add("!row-span-1");
        document
            .getElementById("docs-card-content")
            ?.classList.add("!flex-row");
        document.getElementById("background")?.classList.add("!hidden");
    };

    const [theme, setTheme] = useState(
        () => localStorage.getItem("theme") || "dark",
    );

    useEffect(() => {
        localStorage.setItem("theme", theme);

        const root = document.documentElement;
        if (theme === "dark") root.classList.add("dark");
        else root.classList.remove("dark");
    }, [theme]);

    const TEAM = [
        {
            initials: "XA",
            name: "Ximena Amador",
            email: "l22260145@matamoros.tecnm.mx",
            role: "Desarrolladora Frontend",
        },
        {
            initials: "OS",
            name: "Oscar Salazar",
            email: "l22260053@matamoros.tecnm.mx",
            role: "Desarrollador Backend",
        },
        {
            initials: "MF",
            name: "Mario Flores",
            email: "l22260058@matamoros.tecnm.mx",
            role: "Encargado de IOT",
        },
    ];

    const [mobileMenu, setMobileMenu] = useState(false);

    return (
        <>
            <Head title="Bienvenido" />

            <div className="min-h-screen bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
                <div className="relative flex min-h-screen flex-col selection:bg-[gray] selection:text-white">
                    {/* HEADER RESPONSIVO */}
                    <header className="w-full bg-[#071024]">
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between sm:h-20">
            {/* LOGO + NOMBRE - SOLO TAMAÑO DE LOGO MODIFICADO */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                {/* LOGO CON TAMAÑOS AUMENTADOS */}
                <img
                    src={logo}
                    alt="Logo Estación Meteorológica"
                    className="h-14 w-auto sm:h-24 md:h-28 object-contain
                     drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]
                     sm:drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]
                     sm:-mt-[1px]"
                />

                <h1 className="text-white leading-none min-w-0">
                    <span className="block text-sm sm:text-lg md:text-xl font-semibold truncate">
                        Estación
                    </span>
                    <span className="block text-xs sm:text-base md:text-lg font-medium text-white/90 truncate">
                        Meteorológica
                    </span>
                </h1>
            </div>

            {/* NAV - TODO IGUAL */}
            <nav className="flex items-center gap-2 sm:gap-3 shrink-0">
                {/* Theme toggle (siempre visible) */}
                <div className="flex items-center gap-1 rounded-xl border border-white/15 bg-white/10 p-1">
                    <button
                        onClick={() => setTheme("light")}
                        className={[
                            "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
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
                            "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                            theme === "dark"
                                ? "bg-white text-slate-900"
                                : "text-white/80 hover:bg-white/10",
                        ].join(" ")}
                        type="button"
                    >
                        <i className="fa-solid fa-moon"></i>
                    </button>
                </div>

                {/* BOTÓN MENÚ MOBILE */}
                <button
                    onClick={() => setMobileMenu(!mobileMenu)}
                    className="sm:hidden rounded-lg bg-white/10 p-2 text-white hover:bg-white/20"
                    aria-label="Abrir menú"
                    type="button"
                >
                    <i className="fa-solid fa-bars"></i>
                </button>

                {/* BOTONES DESKTOP */}
                <div className="hidden sm:flex items-center gap-3">
                    {auth.user ? (
                        <Link
                            href={route("dashboard")}
                            className="rounded-md bg-[#009688] px-4 py-2 text-sm font-semibold text-white hover:bg-[#00796b]"
                        >
                            Acceso
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route("login")}
                                className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-[#00796b] hover:text-white"
                            >
                                Iniciar sesión
                            </Link>

                            <Link
                                href={`${route("login")}?mode=register`}
                                className="rounded-md bg-[#009688] px-4 py-2 text-sm font-semibold text-white hover:bg-white hover:text-[#071024]"
                            >
                                Registrarse
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </div>
    </div>
</header>

                    {/* MENÚ TELEFONO*/}
                    <div
                        className={`sm:hidden overflow-hidden transition-all duration-300 ${
                            mobileMenu ? "max-h-60" : "max-h-0"
                        }`}
                    >
                        <div className="bg-[#071024] border-t border-white/10 px-4 py-3 flex flex-col gap-2">
                            {auth.user ? (
                                <Link
                                    href={route("dashboard")}
                                    className="rounded-md bg-[#009688] px-4 py-2 text-sm font-semibold text-white text-center"
                                >
                                    Acceso
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route("login")}
                                        className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black text-center"
                                    >
                                        Iniciar sesión
                                    </Link>

                                    <Link
                                        href={`${route("login")}?mode=register`}
                                        className="rounded-md bg-[#009688] px-4 py-2 text-sm font-semibold text-white text-center"
                                    >
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* CONTENIDO */}
                    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 mt-8 lg:mt-16">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#071024] dark:text-white">
                            Bienvenido a -------
                        </h2>

                        <main className="mt-6">
                            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
                                <div className="flex items-start gap-4 rounded-lg bg-white p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[gray] lg:pb-10 dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[gray]">
                                    <div className="pt-3 sm:pt-5">
                                        <h2 className="text-lg sm:text-xl font-normal text-black dark:text-white">
                                            Consulta en tiempo real las
                                            condiciones climatológicas dentro
                                            del Instituto Tecnológico de
                                            Matamoros a través de esta estación
                                            meteorológica que recolecta datos
                                            ambientales.
                                        </h2>
                                    </div>
                                </div>
                            </div>
                        </main>

                        <section id="equipo" className="py-12 sm:py-16">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold tracking-tight text-[#071024] dark:text-white">
                                    Conócenos
                                </h2>
                                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                    Equipo 1 el mas very good.
                                </p>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {TEAM.map((m) => (
                                    <article
                                        key={m.email}
                                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                                    >
                                        <div className="flex flex-col gap-3">
                                            <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-600 font-bold text-white dark:bg-emerald-500">
                                                {m.initials}
                                            </div>

                                            <div className="text-base font-semibold text-slate-900 dark:text-white">
                                                {m.name}
                                            </div>

                                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                                {m.role || "\u00A0"}
                                            </div>

                                            <a
                                                href={`mailto:${m.email}`}
                                                className="text-sm text-slate-500 underline-offset-4 hover:underline dark:text-slate-300 break-all"
                                            >
                                                {m.email}
                                            </a>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>

                        {/* FOOTER */}
                        <footer className="py-10 sm:py-16 text-center text-sm mt-10 sm:mt-16 text-black dark:text-white/70">
                            Instituto Tecnológico de Matamoros &copy;{" "}
                            {new Date().getFullYear()}
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}
