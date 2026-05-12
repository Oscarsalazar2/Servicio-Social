import axios from "axios";

const DEFAULT_LIMIT = 24;

const toNumber = (value, fallback = 0) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const formatTime = (isoLike, index = 0) => {
    if (!isoLike) {
        return `${String(index).padStart(2, "0")}:00`;
    }

    const date = new Date(isoLike);
    if (Number.isNaN(date.getTime())) {
        return `${String(index).padStart(2, "0")}:00`;
    }

    return date.toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
};

const normalizeLectura = (item, index = 0) => {
    return {
        id: item?.id ?? "ESP32",
        temp: toNumber(item?.temp),
        hum: toNumber(item?.hum),
        pres: toNumber(item?.pres),
        rs: toNumber(item?.rs),
        viento: toNumber(item?.viento),
        dir: toNumber(item?.dir),
        vibracion: toNumber(item?.vibracion),
        sonido: toNumber(item?.sonido),
        received_at: item?.received_at ?? null,
        t: formatTime(item?.received_at, index),
    };
};

export const fetchLecturas = async (limit = DEFAULT_LIMIT) => {
    const response = await axios.get("/api/lecturas", {
        params: { limit },
    });

    const seriesRaw = Array.isArray(response?.data?.series)
        ? response.data.series
        : [];
    const latestRaw = response?.data?.latest ?? null;

    const series = seriesRaw.map((item, index) => normalizeLectura(item, index));
    const latest = latestRaw
        ? normalizeLectura(latestRaw, Math.max(0, series.length - 1))
        : series[series.length - 1] ?? null;

    return { latest, series };
};
