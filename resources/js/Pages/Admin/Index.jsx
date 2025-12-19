import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function AdminIndex() {
  return (
    <AuthenticatedLayout>
      <Head title="Admin" />
      <div className="p-6 text-slate-900 dark:text-white">
        <h1 className="text-xl font-bold">Admin</h1>
        <p className="mt-2 opacity-80">Vista admin</p>
      </div>
    </AuthenticatedLayout>
  );
}
