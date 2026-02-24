import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { useForm, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function Notificacaciones({ className = "" }) {
    const { auth, telegram } = usePage().props;
    const user = auth.user;
    const botUsername = telegram?.botUsername || "";

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            enable_notifications: user.enable_notifications || false,
            telegram_username: user.telegram_username || "",
        });

    const [notificationsEnabled, setNotificationsEnabled] = useState(
        data.enable_notifications,
    );

    useEffect(() => {
        setNotificationsEnabled(data.enable_notifications);
    }, [data.enable_notifications]);

    const handleCheckboxChange = (e) => {
        const checked = e.target.checked;
        setNotificationsEnabled(checked);
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

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    patch(route("profile.update"));
                }}
                className="mt-6 space-y-6"
            >
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
                                    const username = botUsername.replace(
                                        /^@/,
                                        "",
                                    );

                                    if (!username) {
                                        return;
                                    }

                                    window.open(
                                        `https://t.me/${username}`,
                                        "_blank",
                                        "noopener,noreferrer",
                                    );
                                }}
                                disabled={processing || !botUsername}
                            >
                                Abrir chat del bot
                            </PrimaryButton>
                        </div>

                        <InputError
                            message={errors.telegram_username}
                            className="mt-2"
                        />
                        {!botUsername && (
                            <p className="mt-2 text-sm text-amber-600">
                                Configura TELEGRAM_BOT_USERNAME para habilitar
                                el acceso directo al chat del bot.
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
