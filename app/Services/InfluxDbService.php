<?php

namespace App\Services;

use App\Models\Lectura;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class InfluxDbService
{
    private const DEFAULT_MEASUREMENT = 'lecturas';

    public function isConfigured(): bool
    {
        return filled(config('services.influxdb.url'))
            && filled(config('services.influxdb.org'))
            && filled(config('services.influxdb.bucket'))
            && filled(config('services.influxdb.token'));
    }

    public function writeReadings(array $readings): bool
    {
        if ($readings === []) {
            return false;
        }

        if (!$this->isConfigured()) {
            return $this->writeToLegacyDatabase($readings);
        }

        $lines = [];

        foreach ($readings as $reading) {
            if (!is_array($reading)) {
                continue;
            }

            $line = $this->toLineProtocol($reading);

            if ($line !== null) {
                $lines[] = $line;
            }
        }

        if ($lines === []) {
            return false;
        }

        $response = $this->client()
            ->withBody(implode("\n", $lines), 'text/plain; charset=utf-8')
            ->post($this->writeUrl());

        if ($response->successful()) {
            return true;
        }

        Log::warning('No se pudo escribir en InfluxDB', [
            'status' => $response->status(),
            'body' => $response->body(),
        ]);

        return false;
    }

    public function fetchReadings(int $limit = 24): array
    {
        $limit = max(1, min($limit, 200));

        if (!$this->isConfigured()) {
            return $this->fetchFromLegacyDatabase($limit);
        }

        $response = $this->client()
            ->withHeaders([
                'Accept' => 'application/csv',
                'Content-Type' => 'application/json',
            ])
            ->withBody($this->buildQuery($limit), 'application/json')
            ->post($this->queryUrl());

        if (!$response->successful()) {
            Log::warning('No se pudo consultar InfluxDB', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return [];
        }

        return $this->parseQueryResponse($response->body());
    }

    private function client(): PendingRequest
    {
        return Http::timeout((int) config('services.influxdb.timeout', 10))
            ->withHeaders([
                'Authorization' => 'Token ' . (string) config('services.influxdb.token'),
            ]);
    }

    private function writeUrl(): string
    {
        return rtrim((string) config('services.influxdb.url'), '/')
            . '/api/v2/write?org=' . rawurlencode((string) config('services.influxdb.org'))
            . '&bucket=' . rawurlencode((string) config('services.influxdb.bucket'))
            . '&precision=' . rawurlencode((string) config('services.influxdb.precision', 'ms'));
    }

    private function queryUrl(): string
    {
        return rtrim((string) config('services.influxdb.url'), '/')
            . '/api/v2/query?org=' . rawurlencode((string) config('services.influxdb.org'));
    }

    private function buildQuery(int $limit): string
    {
        $measurement = $this->escapeFluxString((string) config('services.influxdb.measurement', self::DEFAULT_MEASUREMENT));
        $bucket = $this->escapeFluxString((string) config('services.influxdb.bucket'));

        return <<<FLUX
from(bucket: "{$bucket}")
  |> range(start: -30d)
  |> filter(fn: (r) => r._measurement == "{$measurement}")
  |> filter(fn: (r) => contains(value: r._field, set: ["temp", "hum", "pres", "rs", "viento", "dir", "vibracion", "sonido"]))
  |> pivot(rowKey: ["_time", "sensor_id"], columnKey: ["_field"], valueColumn: "_value")
  |> sort(columns: ["_time"], desc: true)
  |> limit(n: {$limit})
FLUX;
    }

    private function parseQueryResponse(string $csv): array
    {
        $lines = preg_split('/\r\n|\r|\n/', trim($csv)) ?: [];
        $header = null;
        $rows = [];

        foreach ($lines as $line) {
            $line = trim($line);

            if ($line === '' || str_starts_with($line, '#')) {
                continue;
            }

            $columns = str_getcsv($line);

            if ($header === null) {
                $header = $columns;

                continue;
            }

            if (count($columns) !== count($header)) {
                continue;
            }

            $record = array_combine($header, $columns);

            if (!is_array($record)) {
                continue;
            }

            $rows[] = $this->normalizeInfluxRecord($record);
        }

        return array_values(array_reverse($rows));
    }

    private function normalizeInfluxRecord(array $record): array
    {
        return [
            'id' => (string) ($record['sensor_id'] ?? 'ESP32'),
            'temp' => $this->toFloat($record['temp'] ?? null),
            'hum' => $this->toFloat($record['hum'] ?? null),
            'pres' => $this->toFloat($record['pres'] ?? null),
            'rs' => $this->toFloat($record['rs'] ?? null),
            'viento' => $this->toFloat($record['viento'] ?? null),
            'dir' => $this->toFloat($record['dir'] ?? null),
            'vibracion' => $this->toInt($record['vibracion'] ?? null),
            'sonido' => $this->toInt($record['sonido'] ?? null),
            'received_at' => isset($record['_time']) && $record['_time'] !== ''
                ? Carbon::parse((string) $record['_time'])->toIso8601String()
                : null,
        ];
    }

    private function toLineProtocol(array $reading): ?string
    {
        $fields = [];

        foreach (['temp', 'hum', 'pres', 'rs', 'viento', 'dir'] as $field) {
            $value = $this->toFloat($reading[$field] ?? null);

            if ($value !== null) {
                $fields[] = $field . '=' . $value;
            }
        }

        foreach (['vibracion', 'sonido'] as $field) {
            $value = $this->toInt($reading[$field] ?? null);

            if ($value !== null) {
                $fields[] = $field . '=' . $value . 'i';
            }
        }

        if ($fields === []) {
            return null;
        }

        $measurement = $this->escapeLineProtocol((string) config('services.influxdb.measurement', self::DEFAULT_MEASUREMENT));
        $sensorId = $this->escapeTagValue((string) ($reading['id'] ?? 'ESP32'));
        $timestamp = Carbon::parse((string) ($reading['received_at'] ?? now()))->valueOf();

        return sprintf(
            '%s,sensor_id=%s %s %s',
            $measurement,
            $sensorId,
            implode(',', $fields),
            $timestamp,
        );
    }

    private function fetchFromLegacyDatabase(int $limit): array
    {
        return Lectura::query()
            ->latest('received_at')
            ->latest('id')
            ->limit($limit)
            ->get()
            ->reverse()
            ->values()
            ->map(fn (Lectura $row): array => [
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
            ])
            ->all();
    }

    private function writeToLegacyDatabase(array $readings): bool
    {
        $rows = [];

        foreach ($readings as $reading) {
            if (!is_array($reading)) {
                continue;
            }

            $rows[] = [
                'sensor_id' => (string) ($reading['id'] ?? 'ESP32'),
                'temp' => $this->toFloat($reading['temp'] ?? null),
                'hum' => $this->toFloat($reading['hum'] ?? null),
                'pres' => $this->toFloat($reading['pres'] ?? null),
                'rs' => $this->toFloat($reading['rs'] ?? null),
                'viento' => $this->toFloat($reading['viento'] ?? null),
                'dir' => $this->toFloat($reading['dir'] ?? null),
                'vibracion' => $this->toInt($reading['vibracion'] ?? null),
                'sonido' => $this->toInt($reading['sonido'] ?? null),
                'received_at' => $reading['received_at'] ?? now(),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        if ($rows === []) {
            return false;
        }

        return Lectura::query()->insert($rows);
    }

    private function escapeLineProtocol(string $value): string
    {
        return str_replace(['\\', ' ', ','], ['\\\\', '\\ ', '\\,'], $value);
    }

    private function escapeTagValue(string $value): string
    {
        return $this->escapeLineProtocol($value);
    }

    private function escapeFluxString(string $value): string
    {
        return str_replace(['\\', '"'], ['\\\\', '\\"'], $value);
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