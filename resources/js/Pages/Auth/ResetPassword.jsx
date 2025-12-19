import { Head, useForm } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";

export default function ResetPassword({ token, email }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    token: token,
    email: email,
    password: "",
    password_confirmation: "",
  });

  const submit = (e) => {
    e.preventDefault();

    post(route("password.store"), {
      onFinish: () => reset("password", "password_confirmation"),
    });
  };

  return (
    <GuestLayout>
      <Head title="Restablecer contraseña" />

      <div className="auth-card">
        <form onSubmit={submit} className="auth-card__form">
          <h1>Restablecer contraseña</h1>

          <p className="auth-card__desc">
            Ingresa tu correo y tu nueva contraseña para restablecer el acceso.
          </p>

          <input
            id="email"
            type="email"
            name="email"
            value={data.email}
            placeholder="Correo electrónico"
            autoComplete="username"
            onChange={(e) => setData("email", e.target.value)}
            required
          />
          {errors.email && <p className="field-error">{errors.email}</p>}

          <input
            id="password"
            type="password"
            name="password"
            value={data.password}
            placeholder="Nueva contraseña"
            autoComplete="new-password"
            onChange={(e) => setData("password", e.target.value)}
            required
          />
          {errors.password && <p className="field-error">{errors.password}</p>}

          <input
            id="password_confirmation"
            type="password"
            name="password_confirmation"
            value={data.password_confirmation}
            placeholder="Confirmar nueva contraseña"
            autoComplete="new-password"
            onChange={(e) => setData("password_confirmation", e.target.value)}
            required
          />
          {errors.password_confirmation && (
            <p className="field-error">{errors.password_confirmation}</p>
          )}

          <button
            className="btn-rojo--blanco btn-main"
            type="submit"
            disabled={processing}
          >
            {processing ? "RESTABLECIENDO..." : "RESTABLECER CONTRASEÑA"}
          </button>
        </form>
      </div>
    </GuestLayout>
  );
}
