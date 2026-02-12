import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function FlashMessages() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (flash?.success) {
            setMessage({ type: "success", text: flash.success });
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 5000);
            return () => clearTimeout(timer);
        }
        if (flash?.error) {
            setMessage({ type: "error", text: flash.error });
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    if (!visible || !message) return null;

    return (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
            <div
                className={`rounded-xl shadow-lg border px-4 py-3 flex items-center gap-3 min-w-[300px] max-w-md ${
                    message.type === "success"
                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
                        : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
                }`}
            >
                <i
                    className={`fa-solid ${message.type === "success" ? "fa-circle-check" : "fa-circle-xmark"} text-xl`}
                ></i>
                <p className="flex-1 text-sm font-medium">{message.text}</p>
                <button
                    onClick={() => setVisible(false)}
                    className="text-current opacity-60 hover:opacity-100 transition-opacity"
                    type="button"
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>
        </div>
    );
}
