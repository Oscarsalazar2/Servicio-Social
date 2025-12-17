import React, { useMemo, useState } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

function KpiCard({ title, value, unit, subtitle }) {
  return (
    <div className="rounded-2xl shadow-sm border p-4 bg-white dark:bg-slate-900 dark:border-white/10">
      <div className="text-sm font-medium text-slate-500 dark:text-slate-300">{title}</div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">{value}</div>
        <div className="text-sm font-semibold text-slate-500 dark:text-slate-300">{unit}</div>
      </div>
      {subtitle ? <div className="mt-2 text-xs text-slate-500 dark:text-slate-300">{subtitle}</div> : null}
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
          <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 dark:hover:text-white">
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
  if (!user?.is_admin) {
    return (
      <AuthenticatedLayout header={<h2 className="font-semibold text-xl">PET</h2>}>
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

  const form = useForm({
    name: "",
    email: "",
    password: "",
    is_admin: false,
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
      <Head title="PET - Lanzamientos" />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Lanzamientos" value={kpi.total} unit="" subtitle={`Último: ${kpi.ultimaFecha}`} />
          <KpiCard title="Éxitos" value={kpi.exitosos} unit="" subtitle="Recuperación OK" />
          <KpiCard title="Fallos" value={kpi.fallidos} unit="" subtitle="Explosión / sin paracaídas" />
          <KpiCard title="Tasa de éxito" value={kpi.tasaExito} unit="%" subtitle="Éxitos / Total" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KpiCard title="Altura máxima" value={kpi.alturaMax} unit="m" subtitle="Mejor lanzamiento" />
          <KpiCard title="Distancia máxima" value={kpi.distanciaMax} unit="m" subtitle="Con viento/ángulo" />
          <KpiCard title="Tiempo vuelo máx." value={kpi.tiempoVueloMax} unit="s" subtitle="Despegue → aterrizaje" />
        </div>

        <div className="rounded-2xl shadow-sm border p-4 bg-white dark:bg-slate-900 dark:border-white/10">
          <div className="font-bold text-slate-900 dark:text-slate-100">Registros</div>
          <div className="mt-2 text-sm text-slate-500 dark:text-slate-300">
            Próximo paso: tabla con (fecha, botella, presión, agua, ángulo, altura, distancia, resultado).
          </div>
        </div>
      </div>

      {/* MODAL */}
      <Modal open={openAdd} onClose={() => setOpenAdd(false)} title="Agregar persona">
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-sm text-slate-600 dark:text-slate-300">Nombre</label>
            <input
              className="mt-1 w-full rounded-xl border p-2 bg-white dark:bg-slate-950 dark:border-white/10"
              value={form.data.name}
              onChange={(e) => form.setData("name", e.target.value)}
            />
            {form.errors.name && <div className="text-xs text-red-500 mt-1">{form.errors.name}</div>}
          </div>

          <div>
            <label className="text-sm text-slate-600 dark:text-slate-300">Correo</label>
            <input
              type="email"
              className="mt-1 w-full rounded-xl border p-2 bg-white dark:bg-slate-950 dark:border-white/10"
              value={form.data.email}
              onChange={(e) => form.setData("email", e.target.value)}
            />
            {form.errors.email && <div className="text-xs text-red-500 mt-1">{form.errors.email}</div>}
          </div>

          <div>
            <label className="text-sm text-slate-600 dark:text-slate-300">Contraseña</label>
            <input
              type="password"
              className="mt-1 w-full rounded-xl border p-2 bg-white dark:bg-slate-950 dark:border-white/10"
              value={form.data.password}
              onChange={(e) => form.setData("password", e.target.value)}
            />
            {form.errors.password && <div className="text-xs text-red-500 mt-1">{form.errors.password}</div>}
          </div>

          <div className="flex items-center gap-2">
            <input
              id="is_admin"
              type="checkbox"
              checked={!!form.data.is_admin}
              onChange={(e) => form.setData("is_admin", e.target.checked)}
            />
            <label htmlFor="is_admin" className="text-sm text-slate-700 dark:text-slate-200">
              ¿Es admin?
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpenAdd(false)} className="px-4 py-2 rounded-xl border">
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
    </AuthenticatedLayout>
  );
}
