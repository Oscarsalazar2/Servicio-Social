import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { useForm, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function Notificacaciones({ className = "" }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, post, errors, processing, recentlySuccessful } =
        useForm({
            enable_notifications: user.enable_notifications || false,
            telegram_username: user.telegram_username || "",
        });

    const [testSuccess, setTestSuccess] = useState(false);

    const [notificationsEnabled, setNotificationsEnabled] = useState(
        data.enable_notifications
    );

    useEffect(() => {
        setNotificationsEnabled(data.enable_notifications);
    }, [data.enable_notifications]);

    const handleCheckboxChange = (e) => {
        const checked = e.target.checked;
        setNotificationsEnabled(checked);
        setTestSuccess(false);
        setData("enable_notifications", checked);
        
        // Si desactiva, limpiar username también
        if (!checked) {
            setData("telegram_username", "");
        }
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Notificaciones
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Configura tus preferencias de notificaciones.
                </p>
            </header>

            <form onSubmit={(e) => {
                e.preventDefault();
                setTestSuccess(false);
                patch(route("profile.update"));
            }} className="mt-6 space-y-6">
                <div>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={notificationsEnabled}
                            onChange={handleCheckboxChange}
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                            Activar notificaciones
                        </span>
                    </label>
                </div>

                {notificationsEnabled && (
                    <div>
                        <InputLabel
                            htmlFor="telegram_username"
                            value="Usuario de Telegram"
                        />

                        <div className="mt-1 flex items-end gap-3">
                            <TextInput
                                id="telegram_username"
                                className="block w-full"
                                value={data.telegram_username}
                                onChange={(e) =>
                                    setData("telegram_username", e.target.value)
                                }
                                placeholder="Ingresa tu usuario de Telegram"
                            />

                            <PrimaryButton
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    post(route("profile.telegram.test"), {
                                        preserveScroll: true,
                                        onSuccess: () => setTestSuccess(true),
                                        onError: () => setTestSuccess(false),
                                    });
                                }}
                                disabled={processing}
                            >
                                Probar conexión
                            </PrimaryButton>
                        </div>

                        <InputError
                            message={errors.telegram_username}
                            className="mt-2"
                        />
                        {testSuccess && (
                            <p className="mt-2 text-sm text-green-600">
                                ✓ Conexión exitosa
                            </p>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Guardar</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Guardado.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
