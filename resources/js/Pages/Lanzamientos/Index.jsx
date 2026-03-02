import React, { useMemo, useState } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

function KpiCard({ title, value, unit, subtitle }) {
    return (
        <div className="rounded-2xl shadow-sm border p-4 bg-white dark:bg-slate-900 dark:border-white/10">
            <div className="text-sm font-medium text-slate-500 dark:text-slate-300">
                {title}
            </div>
            <div className="mt-2 flex items-baseline gap-2">
                <div className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">
                    {value}
                </div>
                <div className="text-sm font-semibold text-slate-500 dark:text-slate-300">
                    {unit}
                </div>
            </div>
            {subtitle ? (
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-300">
                    {subtitle}
                </div>
            ) : null}
        </div>
    );
}

function Modal({ open, onClose, title, children }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border dark:border-white/10 p-5 shadow-xl">
                <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        {title}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    >
                        ✕
                    </button>
                </div>
                <div className="mt-4">{children}</div>
            </div>
        </div>
    );
}

export default function PetIndex() {
    const user = usePage().props.auth.user;

    // Seguridad extra en UI (backend ya lo protege)
    console.log("ROL DEL USUARIO:", user?.role);
    if (user?.role !== "admin") {
        return (
            <AuthenticatedLayout
                header={<h2 className="font-semibold text-xl">PET</h2>}
            >
                <Head title="PET" />
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="rounded-2xl border bg-white dark:bg-slate-900 dark:border-white/10 p-6">
                        No autorizado.
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    const [openAdd, setOpenAdd] = useState(false);
    const [openNuevoLanzamiento, setOpenNuevoLanzamiento] = useState(false);
    const [openDetalle, setOpenDetalle] = useState(false);
    const [registroSeleccionado, setRegistroSeleccionado] = useState(null);

    const form = useForm({
        name: "",
        email: "",
        password: "",
        role: "user",
    });

    const submit = (e) => {
        e.preventDefault();
        form.post(route("admin.personas.store"), {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                setOpenAdd(false);
            },
        });
    };

    // KPIs demo (luego conectas a BD/API)
    const kpi = useMemo(() => {
        const total = 28;
        const exitosos = 21;
        const fallidos = total - exitosos;
        const tasaExito = Math.round((exitosos / total) * 100);

        return {
            total,
            exitosos,
            fallidos,
            tasaExito,
            alturaMax: 83,
            distanciaMax: 112,
            tiempoVueloMax: 9.6,
            ultimaFecha: "15/12/2025 18:40",
        };
    }, []);

    const registrosDemo = useMemo(
        () => [
            {
                id: 1,
                fecha: "27/02/2026 10:15",
                botella: "2 L",
                presion: 78,
                agua: 650,
                modeloBotella: "Coca-Cola",
                altura: 83,
                distancia: 112,
                resultado: "Éxito",
                descripcion:
                    "Vuelo estable, apertura correcta de paracaídas y recuperación inmediata.",
            },
            {
                id: 2,
                fecha: "27/02/2026 11:30",
                botella: "1.5 L",
                presion: 72,
                agua: 600,
                modeloBotella: "Pepsi",
                altura: 74,
                distancia: 95,
                resultado: "Éxito",
                descripcion:
                    "Lanzamiento limpio, ligera deriva por viento lateral.",
            },
            {
                id: 3,
                fecha: "27/02/2026 12:05",
                botella: "2 L",
                presion: 80,
                agua: 700,
                modeloBotella: "Sprite",
                altura: 58,
                distancia: 67,
                resultado: "Fallo",
                descripcion:
                    "Pérdida de estabilidad al ascenso y recuperación parcial del cohete.",
            },
            {
                id: 4,
                fecha: "27/02/2026 13:20",
                botella: "2 L",
                presion: 76,
                agua: 620,
                modeloBotella: "Fanta",
                altura: 79,
                distancia: 101,
                resultado: "Éxito",
                descripcion:
                    "Trayectoria alta con aterrizaje suave en zona segura.",
            },
            
        ],
        [],
    );

    const [formLanzamiento, setFormLanzamiento] = useState({
        fecha: "",
        botella: "2 L",
        presion: "",
        agua: "",
        modeloBotella: "Coca-Cola",
        altura: "",
        distancia: "",
        resultado: "Éxito",
        descripcion: "",
    });

    const abrirDetalle = (registro) => {
        setRegistroSeleccionado(registro);
        setOpenDetalle(true);
    };

    const cerrarNuevoLanzamiento = () => {
        setOpenNuevoLanzamiento(false);
        setFormLanzamiento({
            fecha: "",
            botella: "2 L",
            presion: "",
            agua: "",
            modeloBotella: "Coca-Cola",
            altura: "",
            distancia: "",
            resultado: "Éxito",
            descripcion: "",
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between gap-3">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Lanzamientos de cohetes PET
                    </h2>

                    <button
                        onClick={() => setOpenAdd(true)}
                        className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#009688] text-white hover:opacity-90"
                    >
                        + Agregar persona
                    </button>
                </div>
            }
        >
            <Head title="Lanzamiento de cohetes" />

            <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard
                        title="Lanzamientos"
                        value={kpi.total}
                        unit=""
                        subtitle={`Último: ${kpi.ultimaFecha}`}
                    />
                    <KpiCard
                        title="Éxitos"
                        value={kpi.exitosos}
                        unit=""
                        subtitle="Recuperación OK"
                    />
                    <KpiCard
                        title="Fallos"
                        value={kpi.fallidos}
                        unit=""
                        subtitle="Explosión / sin paracaídas"
                    />
                    <KpiCard
                        title="Tasa de éxito"
                        value={kpi.tasaExito}
                        unit="%"
                        subtitle="Éxitos / Total"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <KpiCard
                        title="Altura máxima"
                        value={kpi.alturaMax}
                        unit="m"
                        subtitle="Mejor lanzamiento"
                    />
                    <KpiCard
                        title="Distancia máxima"
                        value={kpi.distanciaMax}
                        unit="m"
                        subtitle="Con viento/ángulo"
                    />
                    <KpiCard
                        title="Tiempo vuelo máx."
                        value={kpi.tiempoVueloMax}
                        unit="s"
                        subtitle="Despegue → aterrizaje"
                    />
                </div>

                <div className="rounded-2xl shadow-sm border p-4 bg-white dark:bg-slate-900 dark:border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="font-bold text-slate-900 dark:text-slate-100">
                            Registros
                        </div>
                        <button
                            type="button"
                            onClick={() => setOpenNuevoLanzamiento(true)}
                            className="w-full sm:w-auto px-3 py-2 rounded-xl text-sm font-semibold bg-[#009688] text-white hover:opacity-90"
                        >
                            Registrar nuevo lanzamiento
                        </button>
                    </div>
                    <div className="mt-3 overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="text-left border-b border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300">
                                    <th className="py-2 pr-4">Fecha</th>
                                    <th className="py-2 pr-4">Botella</th>
                                    <th className="py-2 pr-4">Presión (psi)</th>
                                    <th className="py-2 pr-4">Agua (ml)</th>
                                    <th className="py-2 pr-4">Modelo de botella</th>
                                    <th className="py-2 pr-4">Altura (m)</th>
                                    <th className="py-2 pr-4">Distancia (m)</th>
                                    <th className="py-2 pr-2">Resultado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registrosDemo.map((registro) => (
                                    <tr
                                        key={registro.id}
                                        onClick={() => abrirDetalle(registro)}
                                        className="border-b border-slate-100 dark:border-white/5 text-slate-800 dark:text-slate-100 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5"
                                    >
                                        <td className="py-2 pr-4 whitespace-nowrap">
                                            {registro.fecha}
                                        </td>
                                        <td className="py-2 pr-4">
                                            {registro.botella}
                                        </td>
                                        <td className="py-2 pr-4">
                                            {registro.presion}
                                        </td>
                                        <td className="py-2 pr-4">
                                            {registro.agua}
                                        </td>
                                        <td className="py-2 pr-4">
                                            {registro.modeloBotella}
                                        </td>
                                        <td className="py-2 pr-4">
                                            {registro.altura}
                                        </td>
                                        <td className="py-2 pr-4">
                                            {registro.distancia}
                                        </td>
                                        <td className="py-2 pr-2">
                                            <span
                                                className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                                                    registro.resultado ===
                                                    "Éxito"
                                                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                                                        : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                                                }`}
                                            >
                                                {registro.resultado}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            <Modal
                open={openAdd}
                onClose={() => setOpenAdd(false)}
                title="Agregar persona"
            >
                <form onSubmit={submit} className="space-y-3">
                    <div>
                        <label className="text-sm text-slate-600 dark:text-slate-300">
                            Nombre
                        </label>
                        <input
                            className="mt-1 w-full rounded-xl border p-2 bg-white dark:bg-slate-950 dark:border-white/10"
                            value={form.data.name}
                            onChange={(e) =>
                                form.setData("name", e.target.value)
                            }
                        />
                        {form.errors.name && (
                            <div className="text-xs text-red-500 mt-1">
                                {form.errors.name}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="text-sm text-slate-600 dark:text-slate-300">
                            Correo
                        </label>
                        <input
                            type="email"
                            className="mt-1 w-full rounded-xl border p-2 bg-white dark:bg-slate-950 dark:border-white/10"
                            value={form.data.email}
                            onChange={(e) =>
                                form.setData("email", e.target.value)
                            }
                        />
                        {form.errors.email && (
                            <div className="text-xs text-red-500 mt-1">
                                {form.errors.email}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="text-sm text-slate-600 dark:text-slate-300">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            className="mt-1 w-full rounded-xl border p-2 bg-white dark:bg-slate-950 dark:border-white/10"
                            value={form.data.password}
                            onChange={(e) =>
                                form.setData("password", e.target.value)
                            }
                        />
                        {form.errors.password && (
                            <div className="text-xs text-red-500 mt-1">
                                {form.errors.password}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            id="role_admin"
                            type="checkbox"
                            checked={form.data.role === "admin"}
                            onChange={(e) =>
                                form.setData(
                                    "role",
                                    e.target.checked ? "admin" : "user",
                                )
                            }
                        />
                        <label
                            htmlFor="role_admin"
                            className="text-sm text-slate-700 dark:text-slate-200"
                        >
                            {" "}
                            ¿Es admin?
                        </label>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setOpenAdd(false)}
                            className="px-4 py-2 rounded-xl border"
                        >
                            Cancelar
                        </button>
                        <button
                            disabled={form.processing}
                            className="px-4 py-2 rounded-xl bg-[#009688] text-white font-semibold disabled:opacity-60"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal
                open={openNuevoLanzamiento}
                onClose={cerrarNuevoLanzamiento}
                title="Registrar nuevo lanzamiento"
            >
                <form
                    className="space-y-3"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm text-slate-600 dark:text-slate-300">
                                Fecha y hora
                            </label>
                            <input
                                type="datetime-local"
                                className="mt-1 w-full rounded-xl border p-2  bg-white dark:bg-slate-950 dark:border-white/10 dark:text-slate-400"
                                value={formLanzamiento.fecha}
                                onChange={(e) =>
                                    setFormLanzamiento((prev) => ({
                                        ...prev,
                                        fecha: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        <div>
                            <label className="text-sm text-slate-600 dark:text-slate-300">
                                Botella
                            </label>
                            <select
                                className="mt-1 w-full rounded-xl border p-2 bg-white dark:bg-slate-950 dark:border-white/10 dark:text-slate-400"
                                value={formLanzamiento.botella}
                                onChange={(e) =>
                                    setFormLanzamiento((prev) => ({
                                        ...prev,
                                        botella: e.target.value,
                                    }))
                                }
                            >
                                <option>1.5 L</option>
                                <option>2 L</option>
                                <option>2.5 L</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm text-slate-600 dark:text-slate-300">
                                Presión (psi)
                            </label>
                            <input
                                type="number"
                                className="mt-1 w-full rounded-xl border p-2 bg-white dark:bg-slate-950 dark:border-white/10 dark:text-slate-400"
                                value={formLanzamiento.presion}
                                onChange={(e) =>
                                    setFormLanzamiento((prev) => ({
                                        ...prev,
                                        presion: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        <div>
                            <label className="text-sm text-slate-600 dark:text-slate-300">
                                Agua (ml)
                            </label>
                            <input
                                type="number"
                                className="mt-1 w-full rounded-xl border p-2 bg-white dark:bg-slate-950 dark:border-white/10 dark:text-slate-400"
                                value={formLanzamiento.agua}
                                onChange={(e) =>
                                    setFormLanzamiento((prev) => ({
                                        ...prev,
                                        agua: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        <div>
                            <label className="text-sm text-slate-600 dark:text-slate-300">
                                Modelo de botella
                            </label>
                            <input
                                type="text"
                                className="mt-1 w-full rounded-xl border p-2 bg-white dark:bg-slate-950 dark:border-white/10 dark:text-slate-400"
                                value={formLanzamiento.modeloBotella}
                                onChange={(e) =>
                                    setFormLanzamiento((prev) => ({
                                        ...prev,
                                        modeloBotella: e.target.value,
                                    }))
                                }
                            />
                            {/*<select
                                className="mt-1 w-full rounded-xl border p-2 bg-white dark:bg-slate-950 dark:border-white/10 dark:text-slate-400"
                                value={formLanzamiento.modeloBotella}
                                onChange={(e) =>
                                    setFormLanzamiento((prev) => ({
                                        ...prev,
                                        modeloBotella: e.target.value,
                                    }))
                                }
                            >
                                <option>Coca-Cola</option>
                                <option>Pepsi</option>
                                <option>Sprite</option>
                                <option>Fanta</option>
                                <option>7UP</option>
                                <option>Tehuacán</option>
                            </select>*/}
                        </div>

                        <div>
                            <label className="text-sm text-slate-600 dark:text-slate-300">
                                Resultado
                            </label>
                            <select
                                className="mt-1 w-full rounded-xl border p-2 bg-white dark:bg-slate-950 dark:border-white/10 dark:text-slate-400"
                                value={formLanzamiento.resultado}
                                onChange={(e) =>
                                    setFormLanzamiento((prev) => ({
                                        ...prev,
                                        resultado: e.target.value,
                                    }))
                                }
                            >
                                <option>Éxito</option>
                                <option>Fallo</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm text-slate-600 dark:text-slate-300">
                                Altura (m)
                            </label>
                            <input
                                type="number"
                                className="mt-1 w-full rounded-xl border p-2 bg-white dark:bg-slate-950 dark:border-white/10 dark:text-slate-400"
                                value={formLanzamiento.altura}
                                onChange={(e) =>
                                    setFormLanzamiento((prev) => ({
                                        ...prev,
                                        altura: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        <div>
                            <label className="text-sm text-slate-600 dark:text-slate-300">
                                Distancia (m)
                            </label>
                            <input
                                type="number"
                                className="mt-1 w-full rounded-xl border p-2 bg-white dark:bg-slate-950 dark:border-white/10 dark:text-slate-400"
                                value={formLanzamiento.distancia}
                                onChange={(e) =>
                                    setFormLanzamiento((prev) => ({
                                        ...prev,
                                        distancia: e.target.value,
                                    }))
                                }
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-slate-600 dark:text-slate-300">
                            Descripción
                        </label>
                        <textarea
                            rows={3}
                            className="mt-1 w-full rounded-xl border p-2 bg-white dark:bg-slate-950 dark:border-white/10 dark:text-slate-400"
                            placeholder="Describe observaciones del lanzamiento"
                            value={formLanzamiento.descripcion}
                            onChange={(e) =>
                                setFormLanzamiento((prev) => ({
                                    ...prev,
                                    descripcion: e.target.value,
                                }))
                            }
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={cerrarNuevoLanzamiento}
                            className="px-4 py-2 rounded-xl border dark:text-slate-400 dark:border-white/10"
                        >
                            Cerrar
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 rounded-xl bg-[#009688] text-white font-semibold"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal
                open={openDetalle}
                onClose={() => setOpenDetalle(false)}
                title="Detalle del lanzamiento"
            >
                {registroSeleccionado ? (
                    <div className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                                <strong>Fecha:</strong>{" "}
                                {registroSeleccionado.fecha}
                            </div>
                            <div>
                                <strong>Botella:</strong>{" "}
                                {registroSeleccionado.botella}
                            </div>
                            <div>
                                <strong>Presión:</strong>{" "}
                                {registroSeleccionado.presion} psi
                            </div>
                            <div>
                                <strong>Agua:</strong>{" "}
                                {registroSeleccionado.agua} ml
                            </div>
                            <div>
                                <strong>Modelo de botella:</strong>{" "}
                                {registroSeleccionado.modeloBotella}
                            </div>
                            <div>
                                <strong>Altura:</strong>{" "}
                                {registroSeleccionado.altura} m
                            </div>
                            <div>
                                <strong>Distancia:</strong>{" "}
                                {registroSeleccionado.distancia} m
                            </div>
                            <div>
                                <strong>Resultado:</strong>{" "}
                                {registroSeleccionado.resultado}
                            </div>
                        </div>
                        <div className="rounded-xl border border-slate-200 dark:border-white/10 p-3 bg-slate-50 dark:bg-slate-950/50">
                            <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300 mb-1">
                                Descripción
                            </div>
                            <div>
                                {registroSeleccionado.descripcion ||
                                    "Sin descripción registrada."}
                            </div>
                        </div>
                    </div>
                ) : null}
            </Modal>
        </AuthenticatedLayout>
    );
}
