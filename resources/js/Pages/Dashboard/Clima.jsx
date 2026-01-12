import React, { useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Clima() {

    return (
        <AuthenticatedLayout>
            <Head title="Clima" />

            <div className="min-h-screen bg-gray-100 dark:bg-[#071024]">
                <div className="max-w-7xl mx-auto px-4 py-8 space-y-14">
                    {/* VIENTO */}
                    <section className="space-y-6">
                        <div className="text-gray-900 dark:text-white font-extrabold text-lg">
                            Presion atmosferica
                        </div>

                    </section>

                    {/* TEMPERATURA */}
                    <section className="space-y-6">
                        <div className="text-gray-900 dark:text-white font-extrabold text-lg">
                            Precipitación
                        </div>
                    </section>

                    {/* Radacion solar */}
                    <section className="space-y-6">
                        <div className="text-gray-900 dark:text-white font-extrabold text-lg">
                            Radiación solar
                        </div>
                    </section>

                    {/* Cielo */}
                    <section className="space-y-6">
                        <div className="text-gray-900 dark:text-white font-extrabold text-lg">
                            Cielo
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
