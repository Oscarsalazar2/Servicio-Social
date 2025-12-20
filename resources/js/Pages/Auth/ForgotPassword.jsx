import { Head, useForm } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("password.email"));
    };

    return (
        <GuestLayout>
            <Head title="Olvidaste tu contraseña" />

            <div className="auth-container">
                {/* FORM */}
                <div className="form-auth-container sign-in">
                    <form onSubmit={submit}>
                        <h1>Olvidaste tu contraseña</h1>

                        <p className="text-sm opacity-80 mb-4">
                            Ingresa tu correo electrónico y te enviaremos un
                            enlace para restablecer tu contraseña.
                        </p>

                        {status && (
                            <div className="mb-3 text-sm text-emerald-400">
                                {status}
                            </div>
                        )}

                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Correo electrónico"
                            value={data.email}
                            onChange={(e) =>
                                setData("email", e.target.value)
                            }
                            required
                        />

                        {errors.email && (
                            <p className="field-error">{errors.email}</p>
                        )}

                        <button
                            type="submit"
                            className="btn-rojo--blanco btn-main"
                            disabled={processing}
                        >
                            {processing
                                ? "ENVIANDO..."
                                : "ENVIAR ENLACE"}
                        </button>
                    </form>
                </div>

                {/* PANEL DERECHO */}
                <div className="toggle-auth-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-right">
                            <h1>¿Sin acceso?</h1>
                            <p>
                                No te preocupes. Te enviaremos un enlace seguro
                                para recuperar tu cuenta en minutos.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
