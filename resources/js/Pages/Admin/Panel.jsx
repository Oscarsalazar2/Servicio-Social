import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Panel() {
  return (
    <AuthenticatedLayout>
      <Head title="Panel Admin" />
      <div className="p-6 text-slate-900 dark:text-white">
        <h1 className="text-xl font-bold">Panel Admin</h1>
        <p className="mt-2 opacity-80">Vista admin.panel</p>
      </div>
    </AuthenticatedLayout>
  );
}
