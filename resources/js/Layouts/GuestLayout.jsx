import { Link } from "@inertiajs/react";

export default function GuestLayout({ children }) {
    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-[#212529] p-4">
                {children}
            </div>
            <Link href="/" className="back-home-btn">
                ←   Inicio
            </Link>
        </>
    );
}
