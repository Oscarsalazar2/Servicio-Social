import { useState, useMemo } from "react";

export default function Usuarios({ allUsers = [] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    // Formatear datos de usuarios
    const users = allUsers.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        registrationDate: new Date(user.created_at).toLocaleDateString(
            "es-ES",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            },
        ),
        role:
            user.role === "admin"
                ? "Admin"
                : user.role === "launcher"
                  ? "Lanzador"
                  : "Usuario",
        status: user.is_active ? "Activo" : "Inactivo",
    }));

    // Filtrar usuarios
    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesSearch =
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole =
                roleFilter === "all" || user.role === roleFilter;
            const matchesStatus =
                statusFilter === "all" || user.status === statusFilter;

            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, searchTerm, roleFilter, statusFilter]);

    const handleView = (userId) => {
        console.log("Ver usuario:", userId);
        // Funcionalidad deshabilitada temporalmente
    };

    const handleEdit = (userId) => {
        console.log("Editar usuario:", userId);
        // Funcionalidad deshabilitada temporalmente
    };

    const handleDelete = (userId) => {
        console.log("Eliminar usuario:", userId);
        // Funcionalidad deshabilitada temporalmente
    };

    return (
        <div className="space-y-4">
            {/* Encabezado */}
            <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Usuarios
                </h2>
                <p className="mt-1 text-sm opacity-70">
                    Gestiona los usuarios del sistema
                </p>
            </div>

            {/* Sección principal */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-4 sm:p-6">
                {/* Barra de búsqueda y filtros */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    {/* Campo de búsqueda */}
                    <div className="flex-1 relative">
                        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm"></i>
                        <input
                            type="text"
                            placeholder="Buscar usuario..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-[#009688] focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Filtro de Rol */}
                    <div className="sm:w-44">
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#009688] focus:border-transparent transition-all appearance-none cursor-pointer"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                                backgroundPosition: "right 0.5rem center",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "1.5em 1.5em",
                                paddingRight: "2.5rem",
                            }}
                        >
                            <option value="all">Rol</option>
                            <option value="Admin">Admin</option>
                            <option value="Lanzador">Lanzador</option>
                            <option value="Usuario">Usuario</option>
                        </select>
                    </div>

                    {/* Filtro de Estado */}
                    <div className="sm:w-44">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#009688] focus:border-transparent transition-all appearance-none cursor-pointer"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                                backgroundPosition: "right 0.5rem center",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "1.5em 1.5em",
                                paddingRight: "2.5rem",
                            }}
                        >
                            <option value="all">Estado</option>
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
                    </div>
                </div>

                {/* Contador de usuarios */}
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                        Lista de Usuarios
                    </h3>
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                        {filteredUsers.length}{" "}
                        {filteredUsers.length === 1 ? "usuario" : "usuarios"}
                    </span>
                </div>

                {/* Tabla de usuarios */}
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                            Usuario
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                            Correo
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                            Fecha Registro
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                            Rol
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                            Estado
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                            >
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                                                    {user.name}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                                                    {user.email}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                                                    {user.registrationDate}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
                                                            ${
                                                                user.role ===
                                                                "admin"
                                                                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                                                                    : user.role ===
                                                                        "launcher"
                                                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                                                      : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                                                            }`}
                                                    >
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
                                                            ${user.status === "Activo" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"}`}
                                                    >
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <div className="flex items-center gap-1.5">
                                                        <button
                                                            onClick={() =>
                                                                handleView(
                                                                    user.id,
                                                                )
                                                            }
                                                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                            title="Ver"
                                                            type="button"
                                                        >
                                                            <i className="fa-solid fa-eye text-sm"></i>
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleEdit(
                                                                    user.id,
                                                                )
                                                            }
                                                            className="p-2 text-[#009688] dark:text-[#4DB6AC] hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-lg transition-colors"
                                                            title="Cambiar estado"
                                                            type="button"
                                                        >
                                                            <i className="fa-solid fa-pen-to-square text-sm"></i>
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    user.id,
                                                                )
                                                            }
                                                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                            title="Eliminar"
                                                            type="button"
                                                        >
                                                            <i className="fa-solid fa-trash text-sm"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="px-4 py-8 text-center text-slate-500 dark:text-slate-400"
                                            >
                                                <div className="flex flex-col items-center gap-2">
                                                    <i className="fa-solid fa-users-slash text-3xl opacity-50"></i>
                                                    <p className="text-sm">
                                                        No se encontraron
                                                        usuarios
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
