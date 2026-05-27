<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\InfluxDbService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class LecturasController extends Controller
{
    public function __construct(private readonly InfluxDbService $influxDb)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $limit = max(1, min((int) $request->query('limit', 24), 200));

        $series = $this->influxDb->fetchReadings($limit);
        $last = $series === [] ? null : $series[array_key_last($series)];

        return response()->json([
            'latest' => $last,
            'series' => $series,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $payload = $request->json()->all();

        if (!is_array($payload)) {
            return response()->json([
                'message' => 'Payload JSON inválido',
            ], 422);
        }

        $items = $this->toList($payload);
        $normalized = [];

        foreach ($items as $item) {
            if (!is_array($item)) {
                continue;
            }

            $normalized[] = $this->normalizeReading($item);
        }

        if ($normalized === []) {
            return response()->json([
                'message' => 'No se recibieron lecturas válidas',
            ], 422);
        }

        if (!$this->influxDb->writeReadings($normalized)) {
            return response()->json([
                'message' => 'No se pudo guardar la lectura',
            ], 502);
        }

        $last = end($normalized);

        return response()->json([
            'message' => 'Lecturas recibidas',
            'latest' => $last,
            'saved' => count($normalized),
        ], 201);
    }

    private function toList(array $payload): array
    {
        if ($payload === []) {
            return [];
        }

        // Si llega un solo objeto, lo convertimos a lista de un elemento.
        if (array_keys($payload) !== range(0, count($payload) - 1)) {
            return [$payload];
        }

        return $payload;
    }

    private function normalizeReading(array $item): array
    {
        $timestamp = Carbon::now()->toDateTimeString();

        return [
            'id' => (string) ($item['id'] ?? 'ESP32'),
            'temp' => $this->toFloat($item['temp'] ?? null),
            'hum' => $this->toFloat($item['hum'] ?? null),
            'pres' => $this->toFloat($item['pres'] ?? null),
            'rs' => $this->toFloat($item['rs'] ?? null),
            'viento' => $this->toFloat($item['viento'] ?? null),
            'dir' => $this->toFloat($item['dir'] ?? null),
            'vibracion' => $this->toInt($item['Vibracion'] ?? $item['vibracion'] ?? null),
            'sonido' => $this->toInt($item['Sonido'] ?? $item['sonido'] ?? null),
            'received_at' => $timestamp,
        ];
    }

    private function toFloat(mixed $value): ?float
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (!is_numeric($value)) {
            return null;
        }

        return (float) $value;
    }

    private function toInt(mixed $value): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (!is_numeric($value)) {
            return null;
        }

        return (int) $value;
    }
}
