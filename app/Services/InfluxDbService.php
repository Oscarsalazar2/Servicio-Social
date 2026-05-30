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

            $line = $this->toLineProtocol($this->normalizeIncomingReading($reading));

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
                'Content-Type' => 'application/vnd.flux',
            ])
            ->withBody($this->buildQuery($limit), 'application/vnd.flux')
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
    |> filter(fn: (r) => contains(value: r._field, set: ["dir", "vel", "rad", "t", "h", "p", "temp", "hum", "pres", "rs", "viento"]))
    |> group()
    |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
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

            // Flux CSV repite encabezado por cada tabla; lo detectamos y actualizamos header.
            if (in_array('_time', $columns, true) && in_array('table', $columns, true)) {
                $header = $columns;

                continue;
            }

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

            if (($record['_time'] ?? null) === null || ($record['_time'] ?? '') === '_time') {
                continue;
            }

            $rows[] = $this->normalizeInfluxRecord($record);
        }

        return array_values(array_reverse($rows));
    }

    private function normalizeInfluxRecord(array $record): array
    {
        return [
            'id' => (string) ($record['code'] ?? $record['sensor_id'] ?? 'ESP32'),
            'temp' => $this->toFloat($record['temp'] ?? $record['t'] ?? null),
            'hum' => $this->toFloat($record['hum'] ?? $record['h'] ?? null),
            'pres' => $this->toFloat($record['pres'] ?? $record['p'] ?? null),
            'rs' => $this->toFloat($record['rs'] ?? $record['rad'] ?? null),
            'viento' => $this->toFloat($record['viento'] ?? $record['vel'] ?? null),
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
        $code = $this->escapeTagValue((string) ($reading['code'] ?? 'ESP32'));
        $v = $this->escapeTagValue((string) $reading['v']);
        $s = $this->escapeTagValue((string) $reading['s']);
        $fields = [];

        foreach (['dir', 'vel', 'rad', 't', 'h', 'p'] as $field) {
            $value = $this->toFloat($reading[$field] ?? null);

            if ($value !== null) {
                $fields[] = $field . '=' . $value;
            }
        }

        if ($fields === []) {
            return null;
        }

        $measurement = $this->escapeLineProtocol((string) config('services.influxdb.measurement', self::DEFAULT_MEASUREMENT));
        $timestamp = Carbon::parse((string) ($reading['received_at'] ?? now()))->valueOf();

        $tags = ['code=' . $code];

        if ($v !== '') {
            $tags[] = 'v=' . $v;
        }

        if ($s !== '') {
            $tags[] = 's=' . $s;
        }

        return sprintf(
            '%s,%s %s %s',
            $measurement,
            implode(',', $tags),
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
            ->map(fn(Lectura $row): array => [
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

            $normalized = $this->normalizeIncomingReading($reading);

            $rows[] = [
                'sensor_id' => (string) $normalized['code'],
                'temp' => $normalized['t'],
                'hum' => $normalized['h'],
                'pres' => $normalized['p'],
                'rs' => $normalized['rad'],
                'viento' => $normalized['vel'],
                'dir' => $normalized['dir'],
                'vibracion' => $this->toBinaryInt($normalized['v']),
                'sonido' => $this->toBinaryInt($normalized['s']),
                'received_at' => $normalized['received_at'],
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

    private function normalizeIncomingReading(array $reading): array
    {
        return [
            'code' => (string) ($reading['code'] ?? $reading['id'] ?? 'ESP32'),
            'dir' => $this->toFloat($reading['dir'] ?? null),
            'vel' => $this->toFloat($reading['vel'] ?? $reading['viento'] ?? null),
            'rad' => $this->toFloat($reading['rad'] ?? $reading['rs'] ?? null),
            't' => $this->toFloat($reading['t'] ?? $reading['temp'] ?? null),
            'h' => $this->toFloat($reading['h'] ?? $reading['hum'] ?? null),
            'p' => $this->toFloat($reading['p'] ?? $reading['pres'] ?? null),
            'v' => $this->toTagState($reading['v'] ?? $reading['vibracion'] ?? $reading['Vibracion'] ?? null),
            's' => $this->toTagState($reading['s'] ?? $reading['sonido'] ?? $reading['Sonido'] ?? null),
            'received_at' => $reading['received_at'] ?? now(),
        ];
    }

    private function toTagState(mixed $value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_bool($value)) {
            return $value ? 'ON' : 'OFF';
        }

        if (is_numeric($value)) {
            return (float) $value > 0 ? 'ON' : 'OFF';
        }

        if (is_string($value)) {
            $normalized = strtoupper(trim($value));

            return match ($normalized) {
                'ON', 'TRUE', 'HIGH', '1' => 'ON',
                'OFF', 'FALSE', 'LOW', '0' => 'OFF',
                default => $normalized,
            };
        }

        return null;
    }

    private function toBinaryInt(mixed $value): ?int
    {
        $state = $this->toTagState($value);

        return match ($state) {
            'ON' => 1,
            'OFF' => 0,
            default => null,
        };
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
