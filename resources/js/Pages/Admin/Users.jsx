import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Users() {
  return (
    <AuthenticatedLayout>
      <Head title="Usuarios" />
      <div className="p-6 text-slate-900 dark:text-white">
        <h1 className="text-xl font-bold">Usuarios</h1>
        <p className="mt-2 opacity-80">Vista admin.users</p>
      </div>
    </AuthenticatedLayout>
  );
}
