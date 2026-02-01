import { Head, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";

import logo from "../../Images/logo.png";
import fondo_principal from "../../Images/fondo_principal.jpg";

import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

import foto1 from "../../Images/slider/1.jpeg";
import foto2 from "../../Images/slider/2.jpeg";
import foto3 from "../../Images/slider/3.jpeg";

const images = [
    {
        original: foto1,
        description: "Sensores ambientales",
    },
    {
        original: foto2,
        description: "Comunicación inalámbrica LoRa",
    },
    {
        original: foto3,
        description: "Visualización de datos en tiempo real",
    },
];

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

    const [mobileMenu, setMobileMenu] = useState(false);

    const scrollToId = (id) => {
        const el = document.getElementById(id);
        if (!el) return;

        const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: y, behavior: "smooth" });
    };

    return (
        <>
            <Head title="Bienvenido" />

            <div className="min-h-screen overflow-x-hidden bg-gray-50 text-slate-800 dark:bg-[#13232F] dark:text-white">
                <div className="relative flex min-h-screen flex-col">
                    {/* HEADER RESPONSIVO */}
                    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#071024]/80 backdrop-blur-md">
                        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
                            <div className="flex h-16 items-center justify-between sm:h-20">
                                {/* LOGO & NOMBRE */}
                                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                                    <img
                                        src={logo}
                                        alt="Logo Estación Meteorológica"
                                        className="
                                            h-16 w-auto object-contain
                                            drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]
                                            sm:h-28 sm:drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]
                                            md:h-32
                                            sm:-mt-[1px]
                                        "
                                        onError={handleImageError}
                                    />

                                    <h1 className="min-w-0 leading-none text-white">
                                        <span className="block truncate text-sm font-semibold sm:text-lg md:text-xl">
                                            METEOR
                                        </span>
                                        <span className="block truncate text-xs font-medium text-white/90 sm:text-base md:text-lg">
                                            Estación Meteorológica
                                        </span>
                                    </h1>
                                </div>

                                {/* NAVEGACIÓN */}
                                <nav className="flex shrink-0 items-center gap-2 sm:gap-3">
                                    {/* Theme toggle (siempre visible) */}
                                    <div className="flex items-center gap-1 rounded-xl border border-white/15 bg-white/10 p-1">
                                        <button
                                            type="button"
                                            onClick={() => setTheme("light")}
                                            className={[
                                                "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                                                theme === "light"
                                                    ? "bg-white text-slate-900"
                                                    : "text-white/80 hover:bg-white/10",
                                            ].join(" ")}
                                        >
                                            <i className="fa-solid fa-sun" />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setTheme("dark")}
                                            className={[
                                                "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                                                theme === "dark"
                                                    ? "bg-white text-slate-900"
                                                    : "text-white/80 hover:bg-white/10",
                                            ].join(" ")}
                                        >
                                            <i className="fa-solid fa-moon" />
                                        </button>
                                    </div>

                                    {/* BOTÓN MENÚ MOBILE */}
                                    <button
                                        type="button"
                                        aria-label="Abrir menú"
                                        onClick={() =>
                                            setMobileMenu(!mobileMenu)
                                        }
                                        className="rounded-lg bg-white/10 p-2 text-white hover:bg-white/20 sm:hidden"
                                    >
                                        <i className="fa-solid fa-bars" />
                                    </button>

                                    {/* BOTONES DESKTOP */}
                                    <div className="hidden items-center gap-3 sm:flex">
                                        {auth.user ? (
                                            <Link
                                                href={route("dashboard")}
                                                className="rounded-md bg-[#009688] px-4 py-2 text-sm font-semibold text-white hover:bg-[#00796b]"
                                            >
                                                Acceder
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

                    {/* MENÚ TELÉFONO (dropdown fijo) */}
                    <div
                        className={[
                            "fixed left-0 right-0 top-16 sm:top-20 z-40 md:hidden",
                            "overflow-hidden transition-[max-height,opacity] duration-300",
                            mobileMenu
                                ? "max-h-60 opacity-100"
                                : "max-h-0 opacity-0",
                        ].join(" ")}
                    >
                        <div className="flex flex-col gap-2 border-t border-white/10 bg-[#071024] px-4 py-3">
                            {auth.user ? (
                                <Link
                                    href={route("dashboard")}
                                    onClick={() => setMobileMenu(false)}
                                    className="rounded-md bg-[#009688] px-4 py-2 text-center text-sm font-semibold text-white"
                                >
                                    Acceder
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route("login")}
                                        onClick={() => setMobileMenu(false)}
                                        className="rounded-md bg-white px-4 py-2 text-center text-sm font-semibold text-black"
                                    >
                                        Iniciar sesión
                                    </Link>

                                    <Link
                                        href={`${route("login")}?mode=register`}
                                        onClick={() => setMobileMenu(false)}
                                        className="rounded-md bg-[#009688] px-4 py-2 text-center text-sm font-semibold text-white"
                                    >
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* HERO */}
                    <section
                        className="
                            relative overflow-hidden
                            flex h-[100svh] items-center justify-center
                            px-4 pt-16 text-center
                            sm:h-screen sm:px-6 sm:pt-20
                        "
                    >
                        {/* Fondo */}
                        <div
                            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                            style={{
                                backgroundImage: `url(${fondo_principal})`,
                            }}
                        />
                        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(5,10,25,0.75),rgba(5,10,25,0.92))]" />

                        {/* Contenido */}
                        <div className="relative z-10 max-w-4xl py-16 sm:py-24">
                            <h2
                                className="
                                    bg-gradient-to-r from-sky-300 to-emerald-300
                                    bg-clip-text text-transparent
                                    text-3xl font-extrabold leading-tight tracking-tight
                                    sm:text-5xl lg:text-6xl
                                "
                            >
                                BIENVENIDO A METEOR
                            </h2>

                            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/90 sm:text-lg">
                                <strong>
                                    Estación Meteorológica Inteligente para
                                    Análisis Ambiental y Ciencia de Datos
                                    (METEOR).
                                </strong>
                                <br />
                                Es una plataforma avanzada para el monitoreo en
                                tiempo real de variables climáticas como
                                temperatura, humedad, velocidad del viento,
                                presión atmosférica y calidad del aire.
                                Visualiza, analiza y recopila información
                                basadas en datos precisos.
                            </p>
                        </div>

                        {/* Flechitas */}
                        <button
                            type="button"
                            onClick={() => scrollToId("que_es")}
                            aria-label="Desliza para descubrir"
                            className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white/90"
                        >
                            <span className="select-none text-base tracking-wide opacity-90">
                                Desliza para descubrir
                            </span>

                            <span className="flex flex-col items-center gap-1">
                                <span className="chevron-down opacity-30" />
                                <span className="chevron-down opacity-60 delay-150" />
                                <span className="chevron-down opacity-90 delay-300" />
                            </span>
                        </button>
                    </section>

                    {/* CONTENIDO */}
                    <div className="mx-auto mt-8 w-full max-w-7xl px-4 sm:px-6 lg:mt-16">
                        <section
                            id="que_es"
                            className="pt-14 sm:pt-20 lg:pt-28"
                        >
                            <div className="mb-12 text-center">
                                <h2 className="mb-4 text-4xl font-bold text-[#071024] dark:text-white sm:text-5xl lg:text-6xl">
                                    ¿Qué es{" "}
                                    <span className="text-[#009688]">
                                        METEOR
                                    </span>
                                    ?
                                </h2>

                                <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
                                    Conoce nuestra plataforma inteligente de
                                    monitoreo ambiental
                                </p>

                                <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-[#009688]/80" />
                            </div>

                            <div className="relative">
                                {/* Decorative background (suave, acorde a tu estilo) */}
                                <div className="pointer-events-none absolute inset-0 -z-10 -skew-y-2 bg-gradient-to-r from-emerald-50/40 to-slate-50/20 dark:from-emerald-900/10 dark:to-slate-900/10" />

                                <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
                                    {/* Texto / highlights */}
                                    <div className="space-y-6">
                                        {/* Highlight 1 */}
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#009688]/10 dark:bg-white/5">
                                                <i className="fa-solid fa-signal text-xl text-[#009688]" />
                                            </div>

                                            <div>
                                                <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
                                                    Monitoreo en tiempo real
                                                </h3>

                                                <p className="text-slate-700 dark:text-slate-300">
                                                    Plataforma inteligente del{" "}
                                                    <strong className="text-[#009688]">
                                                        Instituto Tecnológico de
                                                        Matamoros
                                                    </strong>{" "}
                                                    que captura y transmite
                                                    datos climatológicos al
                                                    instante.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 dark:bg-white/5">
                                                <i className="fa-solid fa-microchip text-xl text-emerald-600 dark:text-emerald-400" />
                                            </div>

                                            <div>
                                                <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
                                                    Tecnología integrada
                                                </h3>

                                                <p className="text-slate-700 dark:text-slate-300">
                                                    Integra sensores ambientales
                                                    y comunicación moderna para
                                                    observar las condiciones del
                                                    campus y facilitar el
                                                    análisis.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-slate-900/5 dark:bg-white/5">
                                                <i className="fa-solid fa-chart-line text-xl text-slate-700 dark:text-slate-200" />
                                            </div>

                                            <div>
                                                <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
                                                    Análisis continuo
                                                </h3>

                                                <p className="text-slate-700 dark:text-slate-300">
                                                    Permite consulta y
                                                    seguimiento continuo de la
                                                    información para
                                                    investigación y toma de
                                                    decisiones basadas en datos.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-center lg:justify-end">
                                        <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-transparent border-0 shadow-none">
                                            <div className="relative aspect-[16/10]">
                                                <div className="absolute inset-0">
                                                    <ImageGallery
                                                        items={images}
                                                        autoPlay={true}
                                                        slideInterval={5000}
                                                        slideDuration={600}
                                                        showThumbnails={false}
                                                        showFullscreenButton={
                                                            false
                                                        }
                                                        showPlayButton={false}
                                                        showNav={false}
                                                        showBullets={true}
                                                        pauseOnHover={true}
                                                        lazyLoad={true}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats (más sobrio, acorde a tu página) */}
                                <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
                                    <div className="rounded-xl bg-white/60 p-4 text-center backdrop-blur-sm dark:bg-white/5">
                                        <div className="text-2xl font-bold text-[#009688]">
                                            24/7
                                        </div>
                                        <div className="text-sm text-slate-600 dark:text-slate-400">
                                            Monitoreo continuo
                                        </div>
                                    </div>

                                    <div className="rounded-xl bg-white/60 p-4 text-center backdrop-blur-sm dark:bg-white/5">
                                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                            10+
                                        </div>
                                        <div className="text-sm text-slate-600 dark:text-slate-400">
                                            Variables medidas
                                        </div>
                                    </div>

                                    <div className="rounded-xl bg-white/60 p-4 text-center backdrop-blur-sm dark:bg-white/5">
                                        <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                            LoRa
                                        </div>
                                        <div className="text-sm text-slate-600 dark:text-slate-400">
                                            Comunicación inalámbrica
                                        </div>
                                    </div>

                                    <div className="rounded-xl bg-white/60 p-4 text-center backdrop-blur-sm dark:bg-white/5">
                                        <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                            Tiempo real
                                        </div>
                                        <div className="text-sm text-slate-600 dark:text-slate-400">
                                            Actualización constante
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="beneficios" className="py-12 sm:py-16">
                            {/* Header */}
                            <div className="mb-10 max-w-3xl">
                                <h2 className="text-2xl font-bold tracking-tight text-[#071024] dark:text-white sm:text-3xl">
                                    Beneficios
                                </h2>

                                <div className="mt-2 h-1 w-14 rounded-full bg-[#009688]/80" />

                                <p className="mt-4 text-slate-600 dark:text-slate-400">
                                    Algunos de los beneficios que ofrece la
                                    plataforma METEOR incluyen:
                                </p>
                            </div>

                            {/* Grid de beneficios */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                <article className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#009688]/10 text-[#009688]">
                                        <i className="fa-solid fa-clock-rotate-left text-xl" />
                                    </div>

                                    <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">
                                        Monitoreo en tiempo real
                                    </h3>

                                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                                        Acceso instantáneo a datos climáticos
                                        actualizados para una toma de decisiones
                                        oportuna.
                                    </p>
                                </article>

                                <article className="rounded-2xl border border-slate-200/60 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                        <i className="fa-solid fa-chart-line text-xl" />
                                    </div>

                                    <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">
                                        Análisis de tendencias
                                    </h3>

                                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                                        Identificación de patrones y variaciones
                                        climáticas a partir de datos históricos.
                                    </p>
                                </article>

                                <article className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
                                        <i className="fa-solid fa-triangle-exclamation text-xl" />
                                    </div>

                                    <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">
                                        Alertas tempranas
                                    </h3>

                                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                                        Notificaciones oportunas ante
                                        condiciones climáticas extremas o fuera
                                        de rango.
                                    </p>
                                </article>

                                {/* Beneficio 4 */}
                                <article className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900/5 text-slate-700 dark:bg-white/5 dark:text-slate-200">
                                        <i className="fa-solid fa-chart-simple text-xl" />
                                    </div>

                                    <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">
                                        Visualización intuitiva
                                    </h3>

                                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                                        Gráficos y visualizaciones claras para
                                        facilitar la interpretación de los
                                        datos.
                                    </p>
                                </article>
                            </div>
                        </section>

                        <section id="datos" className="py-12 sm:py-16">
                            {/* Título + descripción */}
                            <div className="mb-8 max-w-3xl">
                                <h2 className="text-2xl font-bold tracking-tight text-[#071024] dark:text-white">
                                    ¿Qué datos recopila METEOR?
                                </h2>

                                <div className="mt-2 h-1 w-14 rounded-full bg-[#009688]/80" />

                                <p className="mt-4 text-slate-500 dark:text-slate-400">
                                    METEOR monitorea diferentes variables
                                    ambientales mediante sensores
                                    especializados, permitiendo un análisis
                                    preciso del comportamiento climático local.
                                </p>
                            </div>

                            {/* Íconos */}
                            <div className="mt-6 flex flex-col items-center gap-8 lg:mt-10">
                                <div className="flex flex-row justify-center gap-6 sm:gap-10 lg:gap-20 flex-nowrap">
                                    <a className="flex flex-col items-center gap-2 mt-2 text-s text-slate-500 dark:text-slate-400">
                                        <i className="fa-solid fa-temperature-half text-5xl text-slate-800 dark:text-white sm:text-7xl lg:text-9xl" />
                                        <p>Temperatura</p>
                                    </a>

                                    <a className="flex flex-col items-center gap-2 mt-2 text-s text-slate-500 dark:text-slate-400">
                                        <i className="fa-solid fa-cloud-sun-rain text-5xl text-slate-800 dark:text-white sm:text-7xl lg:text-9xl" />
                                        <p>Humedad</p>
                                    </a>

                                    <a className="flex flex-col items-center gap-2 mt-2 text-s text-slate-500 dark:text-slate-400">
                                        <i className="fa-solid fa-wind text-5xl text-slate-800 dark:text-white sm:text-7xl lg:text-9xl" />
                                        <p>Viento</p>
                                    </a>
                                </div>
                            </div>
                        </section>

                        <section id="equipo" className="py-12 sm:py-16">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold tracking-tight text-[#071024] dark:text-white">
                                    Conocenos
                                </h2>
                                <div className="mt-2 h-1 w-14 rounded-full bg-[#009688]/80" />

                                <p className="mt-2 text-s text-slate-500 dark:text-slate-400">
                                    Este proyecto esta desarrollado por las
                                    siguientes personas:
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {TEAM.map((m) => (
                                    <article
                                        key={m.email}
                                        className="rounded-2xl border border-slate-200 bg-white/15 p-6 shadow-sm dark:border-slate-700 dark:bg-transparent/10"
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
                                                className="break-all text-sm text-slate-500 underline-offset-4 hover:underline dark:text-slate-300"
                                            >
                                                {m.email}
                                            </a>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>

                        {/* Ubicación full width */}
                        <section
                            id="ubicacion"
                            className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#009688] dark:bg-[#009688]/90"
                        >
                            <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
                                <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-8">
                                    <div className="order-2 h-80 overflow-hidden rounded-xl shadow-md lg:order-1 lg:h-96">
                                        <iframe
                                            title="Ubicación Instituto Tecnológico de Matamoros"
                                            src="https://www.google.com/maps?q=Instituto+Tecnológico+de+Matamoros&output=embed"
                                            className="h-full w-full border-0"
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                        />
                                    </div>

                                    <div className="order-1 text-white lg:order-2">
                                        <div className="mb-4 flex items-center gap-4">
                                            <span className="grid h-12 w-12 place-items-center rounded-full bg-white/20">
                                                <i className="fa-solid fa-location-dot text-2xl" />
                                            </span>
                                            <h2 className="text-4xl font-bold tracking-tight">
                                                Ubicación
                                            </h2>
                                            
                                        </div>
                                        <div className="mt-2 h-1 w-14 rounded-full bg-white/50" />
                                        <p className="text-lg leading-relaxed py-2 text-white/90">
                                            METEOR se encuentra instalado en el
                                            Instituto Tecnológico de Matamoros,
                                            proporcionando datos climáticos
                                            precisos y relevantes para la
                                            comunidad académica.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="acerca_de" className="py-12 sm:py-16">
                            <div className="mb-8">
                                <h2 className="max-w-3xl text-2xl font-bold tracking-tight text-[#071024] dark:text-white">
                                    Acerca de
                                </h2>
                                <div className="mt-2 h-1 w-14 rounded-full bg-[#009688]/80" />
                                <p className="max-w-3xl mt-4 text-slate-500 dark:text-slate-400">
                                    METEOR es un proyecto acádemico de monitoreo metereolgico que 
                                    recopila y visualiza datos climatológicos locales en tiempo real,
                                    utilizando sensores avanzados y tecnología IoT.
                                </p>
                                <div class="max-w-5xl mx-auto divide-y divide-slate-200 ">
                                    <details class="group py-5">
                                        <summary class="flex cursor-pointer list-none items-center justify-between font-semibold text-slate-900">
                                            ¿Cuál es el propósito del proyecto?
                                            <span className="relative inline-flex h-5 w-5 items-center justify-center transition-transform duration-200 ease-in-out group-open:rotate-180">
                                                <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 ease-in-out opacity-100 group-open:opacity-0">+</span>
                                                <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 ease-in-out opacity-0 group-open:opacity-100">−</span>
                                            </span>
                                            
                                        </summary> 
                                        <p className="mt-2 text-slate-600">
                                            El objetivo es apoyar el parendizaje, el análisis ambiental y 
                                            el uso de datos reales en actividades académicas y proyectos escolares.
                                        </p>
                                    </details> 

                                    <details class="group py-4">
                                        <summary class="flex cursor-pointer list-none items-center justify-between font-semibold text-slate-900">
                                            ¿En qué se enfoca METEOR?
                                            <span className="relative inline-flex h-5 w-5 items-center justify-center transition-transform duration-200 ease-in-out group-open:rotate-180">
                                                <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 ease-in-out opacity-100 group-open:opacity-0">+</span>
                                                <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 ease-in-out opacity-0 group-open:opacity-100">−</span>
                                            </span>
                                        </summary> 
                                        <p className="mt-2 text-slate-600">
                                            Se centra en la recopilación y análisis de variables climatológicas
                                            del entorno.
                                        </p>
                                    </details> 

                                    <details class="group py-4">
                                        <summary class="flex cursor-pointer list-none items-center justify-between font-semibold text-slate-900">
                                            ¿En qué estado se encuentra el proyecto?
                                            <span className="relative inline-flex h-5 w-5 items-center justify-center transition-transform duration-200 ease-in-out group-open:rotate-180">
                                                <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 ease-in-out opacity-100 group-open:opacity-0">+</span>
                                                <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 ease-in-out opacity-0 group-open:opacity-100">−</span>
                                            </span>
                                        </summary> 
                                        <p className="mt-2 text-slate-600">
                                            Actualmente, METEOR se encuentra en desarrollo y en constante mejora,
                                            incorporando nuevas funciones conforme se recopilan más datos.
                                        </p>
                                    </details> 

                                </div>
                            </div>
                        </section>

                        {/* FOOTER*/}
                        <footer
                            id="contacto"
                            className="
                                        relative left-1/2 right-1/2
                                        -ml-[50vw] -mr-[50vw] w-screen
                                         bg-slate-100 text-slate-700
                                         dark:bg-[#071024] dark:text-slate-200
                                    "
                        >
                            <div className="mx-auto max-w-7xl px-4 py-10">
                                <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
                                    <div className="flex flex-col items-center text-center md:items-start md:text-left">
                                        <b className="text-base">METEOR</b>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            Estación Meteorológica Inteligente
                                        </p>

                                        <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                            Plataforma IoT para monitoreo en
                                            tiempo real de temperatura, humedad,
                                            viento, presión y calidad del aire.
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center text-center md:items-start md:text-left">
                                        <b className="text-base">Contáctanos</b>
                                        <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                                            <li>
                                                Email: contacto@meteor-itm.mx
                                            </li>
                                            <li>Sitio: www.meteor-itm.mx</li>
                                            <li>
                                                Dirección: ITM · Matamoros,
                                                Tamps.
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="flex flex-col items-center text-center md:items-start md:text-left">
                                        <b className="text-base">Redes</b>
                                        <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                                            <li>Facebook: /meteor.itm</li>
                                            <li>Instagram: @meteor_itm</li>
                                            <li>X (Twitter): @meteor_itm</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* COPYRIGHT */}
                                <div className="mt-10 border-t border-slate-300 pt-4 text-center text-xs text-slate-500 dark:border-white/10">
                                    © 2026 METEOR · Estación Meteorológica
                                    Inteligente (ITM)
                                </div>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}
