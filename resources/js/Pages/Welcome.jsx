import { Head, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import logo from "../../Images/logo.png";
import logo_copia from "../../Images/logo_copia.png";
import fondo_principal from "../../Images/fondo_principal.jpg";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

import foto1 from "../../images/slider/1.jpeg";
import foto2 from "../../images/slider/2.jpeg";
import foto3 from "../../images/slider/3.jpeg";

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

    const scrollToId = (id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: y, behavior: "smooth" });
    };

    return (
        <>
            <Head title="Bienvenido" />

            <div className="min-h-screen bg-gray-50 text-slate-800 dark:bg-[#13232F] dark:text-white">
                <div className="relative flex min-h-screen flex-col">
                    {/* HEADER RESPONSIVO */}
                    <header className="fixed top-0 left-0 w-full bg-[#071024]/80 backdrop-blur-md z-50 border-b border-white/10">
                        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
                            <div className="flex h-16 items-center justify-between sm:h-20">
                                {/* LOGO & NOMBRE*/}
                                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                    <img
                                        src={logo}
                                        alt="Logo Estación Meteorológica"
                                        className="h-16 w-auto sm:h-28 md:h-32 object-contain
                                        drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]
                                        sm:drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]
                                        sm:-mt-[1px]"
                                        onError={handleImageError}
                                    />

                                    <h1 className="text-white leading-none min-w-0">
                                        <span className="block text-sm sm:text-lg md:text-xl font-semibold truncate">
                                            METEOR
                                        </span>
                                        <span className="block text-xs sm:text-base md:text-lg font-medium text-white/90 truncate">
                                            Est. Meteorológica
                                        </span>
                                    </h1>
                                </div>

                                {/* NAVEGACION*/}
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
                                        onClick={() =>
                                            setMobileMenu(!mobileMenu)
                                        }
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

                    {/* MENÚ TELEFONO (dropdown fijo) */}
                    <div
                        className={[
                            "md:hidden fixed left-0 right-0 top-16 z-40",
                            "overflow-hidden transition-[max-height,opacity] duration-300",
                            mobileMenu
                                ? "max-h-60 opacity-100"
                                : "max-h-0 opacity-0",
                        ].join(" ")}
                    >
                        <div className="bg-[#071024] border-t border-white/10 px-4 py-3 flex flex-col gap-2">
                            {auth.user ? (
                                <Link
                                    href={route("dashboard")}
                                    onClick={() => setMobileMenu(false)}
                                    className="rounded-md bg-[#009688] px-4 py-2 text-sm font-semibold text-white text-center"
                                >
                                    Acceder
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route("login")}
                                        onClick={() => setMobileMenu(false)}
                                        className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black text-center"
                                    >
                                        Iniciar sesión
                                    </Link>

                                    <Link
                                        href={`${route("login")}?mode=register`}
                                        onClick={() => setMobileMenu(false)}
                                        className="rounded-md bg-[#009688] px-4 py-2 text-sm font-semibold text-white text-center"
                                    >
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* HERO*/}
                    <section
                        className="
                        relative overflow-hidden
                        h-[100svh] sm:h-screen
                        flex items-center justify-center text-center
                        px-4 sm:px-6
                        pt-16 sm:pt-20
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
                                  text-4xl sm:text-5xl lg:text-6xl
                                  font-extrabold leading-tight tracking-tight
                                  text-transparent bg-clip-text
                                  bg-gradient-to-r from-sky-300 to-emerald-300
                                  "
                            >
                                BIENVENIDO A METEOR
                            </h2>

                            <p className="mt-6 text-base sm:text-lg leading-relaxed text-white/90 max-w-3xl mx-auto">
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

                        {/*flechitas*/}
                        <button
                            type="button"
                            onClick={() => scrollToId("que_es")}
                            aria-label="Desliza para descubrir"
                            className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/90"
                        >
                            <span className="text-base tracking-wide opacity-90 select-none">
                                Desliza para descubrir
                            </span>

                            <span className="flex flex-col items-center gap-1">
                                <span className="chevron-down opacity-30"></span>
                                <span className="chevron-down opacity-60 delay-150"></span>
                                <span className="chevron-down opacity-90 delay-300"></span>
                            </span>
                        </button>
                    </section>

                    {/* OLA TE AMO*/}

                    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 mt-8 lg:mt-16">
                        <section id="que_es" className="pt-14 sm:pt-20">
                            <div className="flex flex-col gap-3">
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#071024] dark:text-white">
                                    ¿Qué es METEOR?
                                </h2>
                            </div>

                            {/* Contenido */}
                            <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-center">
                                {/* Texto / Card */}
                                <article
                                    className="rounded-2xl border border-slate-200/60 bg-white/70 p-6 shadow-sm backdrop-blur
                        dark:border-white/10 dark:bg-white/5"
                                >
                                    <p className="text-base sm:text-lg leading-relaxed text-slate-800 dark:text-white/90">
                                        Es una plataforma inteligente de
                                        monitoreo ambiental del{" "}
                                        <strong className="font-semibold text-slate-900 dark:text-white">
                                            Instituto Tecnológico de Matamoros
                                        </strong>
                                        , diseñada para la adquisición,
                                        transmisión y visualización de datos
                                        climatológicos en tiempo real.
                                    </p>

                                    <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-700 dark:text-white/80">
                                        Integra sensores ambientales y
                                        tecnologías modernas de comunicación
                                        para observar las condiciones del
                                        campus, facilitando el análisis, la
                                        consulta y el seguimiento continuo de la
                                        información.
                                    </p>
                                </article>

                                {/* Slider / Card */}
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
                                                    showFullscreenButton={false}
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
                        </section>

                        <section id="beneficios" className="py-12 sm:py-16">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold tracking-tight text-[#071024] dark:text-white">
                                    Beneficios
                                </h2>
                                <p className="mt-2 text-s text-slate-500 dark:text-slate-400">
                                    Algunos de los beneficios que ofrece la
                                    plataforma METEOR incluyen:
                                </p>
                            </div>

                            <ul className="list-disc list-inside space-y-3 text-base text-slate-700 dark:text-slate-300">
                                <li>
                                    <strong>Monitoreo en tiempo real:</strong>{" "}
                                    Acceso instantáneo a datos climáticos
                                    actualizados.
                                </li>
                                <li>
                                    <strong>
                                        Análisis de tendencias climáticas:
                                    </strong>{" "}
                                    Identificación de patrones y cambios
                                    ambientales.
                                </li>
                                <li>
                                    <strong>Alertas tempranas:</strong>{" "}
                                    Notificaciones sobre condiciones climáticas
                                    extremas.
                                </li>
                                <li>
                                    <strong>Visualización intuitiva:</strong>{" "}
                                    Gráficos y mapas interactivos para una mejor
                                    comprensión de los datos.
                                </li>
                            </ul>
                        </section>

                        <section id="beneficios" className="py-12 sm:py-16">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold tracking-tight text-[#071024] dark:text-white">
                                    ¿Qué datos recopila METEOR?
                                </h2>
                                <div className="grid gap-6 lg:grid-cols-3 items-center">
                                    <p className="lg:col-span-2 mt-2 text-s text-slate-500 dark:text-slate-400">
                                        METEOR monitorea diferentes variables ambientales
                                        mediante sensores especializados, permitiendo un
                                        análisis preciso del comportamiento climático local.
                                    </p>

                                </div>
                                <div className="flex flex-col items-center gap-8 mt-6 lg:mt-10">
                                    <div className="flex flex-row gap-24 lg:gap-20 lg:flex-nowrap flex-wrap justify-center">
                                        <a className="flex-col mt-2 text-centertext-s text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                            <i className="fa-solid fa-temperature-half text-9xl text-slate-800 dark:text-white"></i>
                                            <p>
                                                Temperatura
                                            </p>
                                        </a>
                                        <a className="flex-col mt-2 text-center text-s text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                            <i className="fa-solid fa-cloud-sun-rain text-9xl text-slate-800 dark:text-white"></i>
                                            <p>
                                                Humedad
                                            </p>
                                        </a>
                                        <a className="flex-col mt-2 text-center text-s text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                            <i className="fa-solid fa-wind text-9xl text-slate-800 dark:text-white"></i>
                                            <p>
                                                Viento
                                            </p>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="equipo" className="py-12 sm:py-16">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold tracking-tight text-[#071024] dark:text-white">
                                    Conocenos
                                </h2>
                                <p className="mt-2 text-s text-slate-500 dark:text-slate-400">
                                    Este proyecto esta desarrollado por las
                                    siguientes personas:
                                </p>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                                                className="text-sm text-slate-500 underline-offset-4 hover:underline dark:text-slate-300 break-all"
                                            >
                                                {m.email}
                                            </a>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>
                        {/*Se que no esta bonito, pero estoy tratando*/}
                    <section className="w-full bg-[#009688] py-12 sm:py-16 dark:bg-[#009688]/90">
                        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
                            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8 items-center">
                                <div className="order-2 lg:order-1 w-11/12 h-96 lg:h-96 rounded-xl overflow-hidden shadow-md">
                                    <iframe
                                        title="Ubicación Instituto Tecnológico de Matamoros"
                                        src="https://www.google.com/maps?q=Instituto+Tecnológico+de+Matamoros&output=embed"
                                        class="w-full h-full border-0"
                                        loading="lazy"
                                        referrerpolicy="no-referrer-when-downgrade">
                                    </iframe>
                                </div>
                                {/* <div className="mb-6  bg-black/5 dark:bg-white/5 p-6 rounded-lg mt-10 sm:mt-16"> */}
                                <div className="order-1 lg:order-2 mb-6 p-6 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <a className="grid h-12 w-12 place-items-center rounded-full bg-emerald-600 ">
                                            <i className="fa-solid fa-location-dot text-2xl text-white"></i>
                                        </a>
                                        <h2 className="text-4xl font-bold tracking-tight text-slate-900">
                                            Ubicación
                                        </h2>
                                    </div>
                                    <p className=" mt-2 text-lg text-white">
                                        METEOR se encuentra instalado en el Instituto Tecnológico de Matamoros,
                                        proporcionando datos climáticos precisos y relevantes para la comunidad académica.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                        <section id="acerca_de" className="py-12 sm:py-16">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold tracking-tight text-[#071024] dark:text-white">
                                    Acerca de
                                </h2>
                                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                    ...
                                </p>
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
