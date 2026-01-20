import { Head, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";

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

    return (
        <>
            <Head title="Bienvenido" />
            <div className="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
                <div className="relative flex min-h-screen flex-col items-end justify-start selection:bg-[gray] selection:text-white">
                    <header className="w-full bg-[#071024]">
                        <div className="mx-auto max-w-7xl px-6">
                            <div className="flex h-20 items-center justify-between">
                                {/* TÍTULO PEQUEÑO (NAVBAR) */}
                                <h1 className="text-md font-normal text-white">
                                    Estación Meteorológica
                                </h1>
                                {/* Toggle Día/Noche */}

                                {/* BOTONES DERECHA */}
                                <nav className="flex items-center">
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
                                    {auth.user ? (
                                        <Link
                                            href={route("dashboard")}
                                            className="ml-3 rounded-md bg-[#009688] px-4 py-2 text-white font-semibold transition hover:bg-[#00796b]"
                                        >
                                            Acceso
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={route("login")}
                                                className="ml-3 rounded-md bg-[#FFFFFF] px-4 py-2 text-black font-semibold transition hover:bg-[#00796b] hover:text-white"
                                            >
                                                Iniciar sesión
                                            </Link>

                                            <Link
                                                href={`${route("login")}?mode=register`}
                                                className="ml-3 rounded-md bg-[#009688] px-4 py-2 text-white font-semibold transition hover:bg-[#FFFFFF] hover:text-[#071024]"
                                            >
                                                Registrarse
                                            </Link>
                                        </>
                                    )}
                                </nav>
                            </div>
                        </div>
                    </header>
                    <div className="relative max-w-2xl px-6 lg:max-w-7xl mt-8 lg:mt-16">
                        <div className="flex lg:col-start-1 lg:justify-start">
                            <h2 className="text-5xl font-semibold text-[#071024] dark:text-white">
                                Bienvenido a -------
                            </h2>
                        </div>
                        <main className="mt-6">
                            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
                                <div className="flex items-start gap-4 rounded-lg bg-white p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[gray] lg:pb-10 dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[gray]">
                                    <div className="pt-3 sm:pt-5">
                                        <h2 className="text-xl font-normal text-black dark:text-white">
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
                        <section id="equipo" className="py-16">
                            <div className="mx-auto w-full max-w-7xl px-6">
                                <div className="max-w-2xl">
                                    <h2 className="text-2xl font-bold tracking-tight">
                                        Conócenos
                                    </h2>
                                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                        Equipo 1 el mas very good.
                                    </p>
                                </div>

                                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {TEAM.map((m) => (
                                        <article
                                            key={m.email}
                                            className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-600 font-bold text-white dark:bg-emerald-500">
                                                    {m.initials}
                                                </div>

                                                <div className="min-w-0">
                                                    <div className="font-semibold text-slate-900 dark:text-white">
                                                        {m.name}
                                                    </div>

                                                    {m.role ? (
                                                        <div className="text-sm text-slate-500 dark:text-slate-400">
                                                            {m.role}
                                                        </div>
                                                    ) : (
                                                        <div className="text-sm text-slate-500 dark:text-slate-400">
                                                            &nbsp;
                                                        </div>
                                                    )}

                                                    <a
                                                        href={`mailto:${m.email}`}
                                                        className="mt-1 inline-block text-sm text-slate-500 underline-offset-4 hover:underline"
                                                    >
                                                        {m.email}
                                                    </a>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <footer className="py-16 text-center text-sm mt-16 text-black dark:text-white/70">
                            Instituto Tecnológico de Matamoros &copy;{" "}
                            {new Date().getFullYear()}
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}
