import { useState, useMemo, useEffect } from "react";
import { router } from "@inertiajs/react";

export default function Usuarios({ allUsers = [] }) {
    const ITEMS_PER_PAGE = 5;
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [activeModal, setActiveModal] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [processingAction, setProcessingAction] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [editForm, setEditForm] = useState({
        name: "",
        email: "",
        role: "Usuario",
        status: "Activo",
    });

    const users = useMemo(
        () =>
            allUsers.map((user) => ({
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
                          : user.role === "rejected"
                            ? "Rechazado"
                            : "Usuario",
                status: user.is_active ? "Activo" : "Inactivo",
                reason:
                    user.motivo ||
                    user.reason ||
                    user.registration_reason ||
                    "Sin motivo registrado",
            })),
        [allUsers],
    );

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

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, roleFilter, statusFilter]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredUsers.length / ITEMS_PER_PAGE),
    );

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredUsers, currentPage]);

    const startItem =
        filteredUsers.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem =
        filteredUsers.length === 0
            ? 0
            : Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length);

    const handleView = (userId) => {
        const user = users.find((item) => item.id === userId);
        if (!user) return;

        setSelectedUser(user);
        setActiveModal("view");
    };

    const handleEdit = (userId) => {
        const user = users.find((item) => item.id === userId);
        if (!user) return;

        setSelectedUser(user);
        setEditForm({
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
        });
        setFormErrors({});
        setActiveModal("edit");
    };

    const handleDelete = (userId) => {
        const user = users.find((item) => item.id === userId);
        if (!user) return;

        const confirmed = window.confirm("¿Eliminar este usuario?");
        if (!confirmed) return;

        setSelectedUser(user);
        setProcessingAction(true);

        router.delete(route("admin.users.delete", user.id), {
            preserveScroll: true,
            onSuccess: () => {
                setProcessingAction(false);
                closeModal();
            },
            onError: () => {
                setProcessingAction(false);
            },
        });
    };

    const closeModal = () => {
        if (processingAction) return;
        setActiveModal(null);
        setSelectedUser(null);
        setFormErrors({});
    };

    const handleSaveEdit = () => {
        if (!selectedUser) return;
        setProcessingAction(true);

        const payload = {
            name: editForm.name,
            email: editForm.email,
            role: editForm.role,
            status: editForm.status,
        };

        router.patch(route("admin.users.update", selectedUser.id), payload, {
            preserveScroll: true,
            onSuccess: () => {
                setProcessingAction(false);
                closeModal();
            },
            onError: (errors) => {
                setFormErrors(errors || {});
                setProcessingAction(false);
            },
        });
    };

    const handleConfirmDelete = () => {
        if (!selectedUser) return;
        setProcessingAction(true);

        router.delete(route("admin.users.delete", selectedUser.id), {
            preserveScroll: true,
            onSuccess: () => {
                setProcessingAction(false);
                closeModal();
            },
            onError: () => {
                setProcessingAction(false);
            },
        });
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
                            <option value="Rechazado">Rechazado</option>
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
                                        paginatedUsers.map((user) => (
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
                                                                "Admin"
                                                                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                                                                    : user.role ===
                                                                        "Lanzador"
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
                                                            title="Editar"
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

                {filteredUsers.length > ITEMS_PER_PAGE && (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                            Mostrando {startItem}-{endItem} de{" "}
                            {filteredUsers.length}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.max(1, prev - 1),
                                    )
                                }
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Anterior
                            </button>
                            <span className="px-3 py-1.5 text-xs sm:text-sm rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                Página {currentPage} de {totalPages}
                            </span>
                            <button
                                type="button"
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.min(totalPages, prev + 1),
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {activeModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <button
                        type="button"
                        onClick={closeModal}
                        className="absolute inset-0 bg-slate-900/60"
                        aria-label="Cerrar modal"
                    ></button>

                    <div className="relative w-full max-w-lg rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl p-5 sm:p-6 space-y-4">
                        {activeModal === "view" && (
                            <>
                                <div className="flex items-start justify-between gap-3">
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                                        Datos del usuario
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg"
                                    >
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                    <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
                                        <p className="text-xs uppercase text-slate-500 dark:text-slate-400">
                                            Nombre
                                        </p>
                                        <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                                            {selectedUser.name}
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
                                        <p className="text-xs uppercase text-slate-500 dark:text-slate-400">
                                            Correo
                                        </p>
                                        <p className="mt-1 font-semibold text-slate-900 dark:text-white break-all">
                                            {selectedUser.email}
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
                                        <p className="text-xs uppercase text-slate-500 dark:text-slate-400">
                                            Rol
                                        </p>
                                        <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                                            {selectedUser.role}
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
                                        <p className="text-xs uppercase text-slate-500 dark:text-slate-400">
                                            Estado
                                        </p>
                                        <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                                            {selectedUser.status}
                                        </p>
                                    </div>
                                    <div className="sm:col-span-2 rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
                                        <p className="text-xs uppercase text-slate-500 dark:text-slate-400">
                                            Motivo
                                        </p>
                                        <p className="mt-1 text-slate-800 dark:text-slate-200">
                                            {selectedUser.reason}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </>
                        )}

                        {activeModal === "edit" && (
                            <>
                                <div className="flex items-start justify-between gap-3">
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                                        Editar usuario
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg"
                                    >
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                                            Nombre
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) =>
                                                setEditForm((current) => ({
                                                    ...current,
                                                    name: e.target.value,
                                                }))
                                            }
                                            className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                        />
                                        {formErrors.name && (
                                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                                {formErrors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                                            Correo
                                        </label>
                                        <input
                                            type="email"
                                            value={editForm.email}
                                            onChange={(e) =>
                                                setEditForm((current) => ({
                                                    ...current,
                                                    email: e.target.value,
                                                }))
                                            }
                                            className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                        />
                                        {formErrors.email && (
                                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                                {formErrors.email}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                                                Rol
                                            </label>
                                            <select
                                                value={editForm.role}
                                                onChange={(e) =>
                                                    setEditForm((current) => ({
                                                        ...current,
                                                        role: e.target.value,
                                                    }))
                                                }
                                                className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                            >
                                                <option value="Admin">
                                                    Admin
                                                </option>
                                                <option value="Lanzador">
                                                    Lanzador
                                                </option>
                                                <option value="Usuario">
                                                    Usuario
                                                </option>
                                                <option value="Rechazado">
                                                    Rechazado
                                                </option>
                                            </select>
                                            {formErrors.role && (
                                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                                    {formErrors.role}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                                                Estado
                                            </label>
                                            <select
                                                value={editForm.status}
                                                onChange={(e) =>
                                                    setEditForm((current) => ({
                                                        ...current,
                                                        status: e.target.value,
                                                    }))
                                                }
                                                className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                            >
                                                <option value="Activo">
                                                    Activo
                                                </option>
                                                <option value="Inactivo">
                                                    Inactivo
                                                </option>
                                            </select>
                                            {formErrors.status && (
                                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                                    {formErrors.status}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-1">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        disabled={processingAction}
                                        className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSaveEdit}
                                        disabled={processingAction}
                                        className="px-4 py-2 rounded-lg bg-[#009688] hover:bg-[#00796B] text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {processingAction
                                            ? "Guardando..."
                                            : "Guardar cambios"}
                                    </button>
                                </div>
                            </>
                        )}

                        {activeModal === "delete" && (
                            <>
                                <div className="flex items-start justify-between gap-3">
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                                        Eliminar usuario
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg"
                                    >
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                </div>

                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                    ¿Seguro que deseas eliminar a
                                    <span className="font-semibold">
                                        {` ${selectedUser.name}`}
                                    </span>
                                    ? Esta acción eliminará el usuario en el
                                    sistema.
                                </p>

                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        disabled={processingAction}
                                        className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleConfirmDelete}
                                        disabled={processingAction}
                                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {processingAction
                                            ? "Eliminando..."
                                            : "Eliminar"}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
