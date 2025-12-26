import { Head, Link, useForm } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route("verification.send"));
    };

    return (
        <GuestLayout>
            <Head title="Verificar correo" />

            <div className="auth-container">
                {/* FORM */}
                <div className="form-auth-container sign-in">
                    <form onSubmit={submit}>
                        <h1>Verifica tu correo</h1>

                        <p className="text-sm opacity-80 mb-4">
                            Te mandamos un correo con un enlace de verificación.
                            Si no te llegó, puedes reenviarlo aquí.
                        </p>

                        {status === "verification-link-sent" && (
                            <div className="mb-3 text-sm text-emerald-400">
                                Se envió un nuevo enlace de verificación a tu
                                correo.
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn-rojo--blanco btn-main"
                            disabled={processing}
                        >
                            {processing
                                ? "REENVIANDO..."
                                : "REENVIAR CORREO DE VERIFICACIÓN"}
                        </button>

                        <div className="mt-4 flex justify-center">
                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="forgot-link"
                            >
                                Cerrar sesión
                            </Link>
                        </div>
                    </form>
                </div>

                {/* PANEL DERECHO */}
                <div className="toggle-auth-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-right">
                            <h1>Último paso</h1>
                            <p>
                                Verifica tu correo para activar tu cuenta y
                                poder entrar a nuestro sistema .
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
