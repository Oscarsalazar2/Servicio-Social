<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lectura;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class LecturasController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $limit = max(1, min((int) $request->query('limit', 24), 200));

        $rows = Lectura::query()
            ->latest('received_at')
            ->latest('id')
            ->limit($limit)
            ->get()
            ->reverse()
            ->values();

        $series = $rows->map(fn (Lectura $row) => $this->toApiReading($row))->values();
        $last = $series->last();

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

        $last = end($normalized);

        Lectura::query()->insert(
            array_map(function (array $row): array {
                return [
                    'sensor_id' => $row['id'],
                    'temp' => $row['temp'],
                    'hum' => $row['hum'],
                    'pres' => $row['pres'],
                    'rs' => $row['rs'],
                    'viento' => $row['viento'],
                    'dir' => $row['dir'],
                    'vibracion' => $row['vibracion'],
                    'sonido' => $row['sonido'],
                    'received_at' => $row['received_at'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }, $normalized),
        );

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

    private function toApiReading(Lectura $row): array
    {
        return [
            'id' => (string) $row->sensor_id,
            'temp' => $row->temp,
            'hum' => $row->hum,
            'pres' => $row->pres,
            'rs' => $row->rs,
            'viento' => $row->viento,
            'dir' => $row->dir,
            'vibracion' => $row->vibracion,
            'sonido' => $row->sonido,
            'received_at' => optional($row->received_at)->toIso8601String(),
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
