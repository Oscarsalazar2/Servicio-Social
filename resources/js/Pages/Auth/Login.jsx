import { useEffect, useState } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";

export default function Login({ status, canResetPassword }) {
    const [active, setActive] = useState(false);
    const [showPendingModal, setShowPendingModal] = useState(false);
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const { url, props } = usePage();
    const registrationPending = props?.flash?.registrationPending;

    useEffect(() => {
        setActive(url.includes("mode=register"));
    }, [url]);

    useEffect(() => {
        if (registrationPending) {
            setActive(false);
            setShowPendingModal(true);
        }
    }, [registrationPending]);

    // LOGIN (Breeze)
    const loginForm = useForm({
        email: "",
        password: "",
        remember: false,
    });

    // REGISTER (Breeze)
    const registerForm = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        motivo: "",
    });

    useEffect(() => {
        return () => {
            loginForm.reset("password");
            registerForm.reset("password", "password_confirmation");
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const submitLogin = (e) => {
        e.preventDefault();
        loginForm.post(route("login"), {
            onFinish: () => loginForm.reset("password"),
        });
    };

    const submitRegister = (e) => {
        e.preventDefault();
        registerForm.post(route("register"), {
            onFinish: () =>
                registerForm.reset("password", "password_confirmation"),
            onSuccess: () => setActive(false),
        });
    };

    return (
        <GuestLayout>
            <Head title="Iniciar sesión" />

            {status && (
                <div
                    style={{ marginBottom: 12, color: "#a7f3d0", fontSize: 13 }}
                >
                    {status}
                </div>
            )}

            <div className={`auth-container ${active ? "active" : ""}`}>
                {/* SIGN UP */}
                <div className="form-auth-container sign-up">
                    <form onSubmit={submitRegister}>
                        <h1>Crea Tu Cuenta</h1>

                        {/*   <div className="social-icons">
                            <a
                                href="#"
                                className="icon"
                                onClick={(e) => e.preventDefault()}
                            >
                                <i className="fa-brands fa-google"></i>
                            </a>
                            <a
                                href="#"
                                className="icon"
                                onClick={(e) => e.preventDefault()}
                            >
                                <i className="fa-brands fa-apple"></i>
                            </a>
                            <a
                                href="#"
                                className="icon"
                                onClick={(e) => e.preventDefault()}
                            >
                                <i className="fa-brands fa-microsoft"></i>
                            </a>
                        </div>

                        <span>
                            o utiliza tu correo electronico para registrarte
                        </span>
                        */}
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={registerForm.data.name}
                            onChange={(e) =>
                                registerForm.setData("name", e.target.value)
                            }
                            required
                        />
                        {registerForm.errors.name && (
                            <p className="field-error">
                                {registerForm.errors.name}
                            </p>
                        )}

                        <input
                            type="email"
                            placeholder="Correo"
                            value={registerForm.data.email}
                            onChange={(e) =>
                                registerForm.setData("email", e.target.value)
                            }
                            required
                        />
                        {registerForm.errors.email && (
                            <p className="field-error">
                                {registerForm.errors.email}
                            </p>
                        )}

                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={registerForm.data.password}
                            onChange={(e) =>
                                registerForm.setData("password", e.target.value)
                            }
                            required
                        />
                        {registerForm.errors.password && (
                            <p className="field-error">
                                {registerForm.errors.password}
                            </p>
                        )}

                        <input
                            type="password"
                            placeholder="Confirmar contraseña"
                            value={registerForm.data.password_confirmation}
                            onChange={(e) =>
                                registerForm.setData(
                                    "password_confirmation",
                                    e.target.value,
                                )
                            }
                            required
                        />

                        <textarea
                            placeholder="Motivo (¿por qué te registras?)"
                            value={registerForm.data.motivo}
                            onChange={(e) =>
                                registerForm.setData("motivo", e.target.value)
                            }
                            rows={2}
                            required
                        />
                        {registerForm.errors.motivo && (
                            <p className="field-error">
                                {registerForm.errors.motivo}
                            </p>
                        )}

                        <button
                            className="btn-rojo--blanco"
                            type="submit"
                            disabled={registerForm.processing}
                        >
                            {registerForm.processing
                                ? "CREANDO..."
                                : "REGISTRATE"}
                        </button>
                    </form>
                </div>

                {/* SIGN IN */}
                <div className="form-auth-container sign-in">
                    <form onSubmit={submitLogin}>
                        <h1>Iniciar sesión</h1>

                        {/*<div className="social-icons">
                            <a
                                href="#"
                                className="icon"
                                onClick={(e) => e.preventDefault()}
                            >
                                <i className="fa-brands fa-google"></i>
                            </a>
                            <a
                                href="#"
                                className="icon"
                                onClick={(e) => e.preventDefault()}
                            >
                                <i className="fa-brands fa-apple"></i>
                            </a>
                            <a
                                href="#"
                                className="icon"
                                onClick={(e) => e.preventDefault()}
                            >
                                <i className="fa-brands fa-microsoft"></i>
                            </a>
                        </div>

                        <span>o utiliza tu correo electronico</span> */}

                        <input
                            type="email"
                            placeholder="Correo"
                            value={loginForm.data.email}
                            onChange={(e) =>
                                loginForm.setData("email", e.target.value)
                            }
                            required
                        />
                        {loginForm.errors.email && (
                            <p className="field-error">
                                {loginForm.errors.email}
                            </p>
                        )}

                        <div className="password-input-wrap">
                            <input
                                type={showLoginPassword ? "text" : "password"}
                                placeholder="Contraseña"
                                value={loginForm.data.password}
                                onChange={(e) =>
                                    loginForm.setData(
                                        "password",
                                        e.target.value,
                                    )
                                }
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowLoginPassword((prev) => !prev)
                                }
                                aria-label={
                                    showLoginPassword
                                        ? "Ocultar contraseña"
                                        : "Mostrar contraseña"
                                }
                            >
                                <i
                                    className={`fa-solid ${
                                        showLoginPassword
                                            ? "fa-eye-slash"
                                            : "fa-eye"
                                    }`}
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
                        {loginForm.errors.password && (
                            <p className="field-error">
                                {loginForm.errors.password}
                            </p>
                        )}

                        <div className="remember-row">
                            <input
                                id="remember"
                                type="checkbox"
                                checked={loginForm.data.remember}
                                onChange={(e) =>
                                    loginForm.setData(
                                        "remember",
                                        e.target.checked,
                                    )
                                }
                            />
                            <label htmlFor="remember">
                                Mantener sesión abierta
                            </label>
                        </div>

                        {canResetPassword && (
                            <Link
                                className="forgot-link"
                                href={route("password.request")}
                            >
                                Olvidaste la Contraseña?
                            </Link>
                        )}

                        <button
                            className="btn-rojo--blanco btn-main"
                            type="submit"
                            disabled={loginForm.processing}
                        >
                            {loginForm.processing
                                ? "ENTRANDO..."
                                : "INICIAR SESIÓN"}
                        </button>
                    </form>
                </div>

                {/* TOGGLE */}
                <div className="toggle-auth-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1>Bienvenido de nuevo!</h1>
                            <p>
                                Introduce tus datos personales para continuar.
                            </p>
                            <button
                                className="btn-outline"
                                type="button"
                                onClick={() => setActive(false)}
                                disabled={
                                    loginForm.processing ||
                                    registerForm.processing
                                }
                            >
                                INICIAR SESIÓN
                            </button>
                        </div>

                        <div className="toggle-panel toggle-right">
                            <h1>Hola, Amigo!</h1>
                            <p>
                                Regístrate con sus datos personales para
                                utilizar todas las funciones del sitio
                            </p>
                            <button
                                className="btn-outline"
                                type="button"
                                onClick={() => setActive(true)}
                                disabled={
                                    loginForm.processing ||
                                    registerForm.processing
                                }
                            >
                                REGISTRATE
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showPendingModal && (
                <div className="login-modal" id="modalRegistroPendiente">
                    <div className="login-modal__backdrop" />
                    <div className="login-modal__content">
                        <div className="login-modal__icon">
                            <i className="fa-regular fa-id-card"></i>
                        </div>
                        <h3>Registro pendiente</h3>
                        <p>
                            Tu cuenta ha sido creada correctamente.
                            <br />
                            Para activarla, acude a tu{" "}
                            <b>Centro de Salud más cercano</b> con tu
                            identificación para completar tu registro en
                            eCartilla.
                        </p>
                        <button
                            className="btn-rojo--blanco"
                            id="btnModalAceptar"
                            type="button"
                            onClick={() => setShowPendingModal(false)}
                        >
                            Aceptar
                        </button>
                    </div>
                </div>
            )}
        </GuestLayout>
    );
}
