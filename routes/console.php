<?php

use App\Services\InfluxDbService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('lecturas:fake {--count=1 : Numero de lecturas a enviar} {--delay=2 : Segundos entre envios} {--sensor=ESP32 : Identificador del sensor}', function () {
    $count = max(1, (int) $this->option('count'));
    $delay = max(0, (int) $this->option('delay'));
    $sensor = trim((string) $this->option('sensor')) ?: 'ESP32';

    $influxDb = app(InfluxDbService::class);

    if (!$influxDb->isConfigured()) {
        $this->error('Faltan variables de InfluxDB en la configuracion actual. Completa INFLUXDB_URL, INFLUXDB_ORG, INFLUXDB_BUCKET e INFLUXDB_TOKEN y luego ejecuta php artisan optimize:clear.');

        return self::FAILURE;
    }

    $this->info('Enviando ' . $count . ' lectura(s) aleatoria(s) directamente a InfluxDB');

    for ($index = 1; $index <= $count; $index++) {
        $payload = [
            'code' => $sensor,
            'dir' => round(random_int(0, 3599) / 10, 1),
            'vel' => round(random_int(0, 250) / 10, 1),
            'rad' => round(random_int(0, 9500) / 10, 1),
            't' => round(random_int(150, 380) / 10, 1),
            'h' => round(random_int(200, 950) / 10, 1),
            'p' => round(random_int(95000, 103500) / 100, 2),
            'v' => random_int(0, 1) === 1 ? 'ON' : 'OFF',
            's' => random_int(0, 1) === 1 ? 'ON' : 'OFF',
        ];

        if (!$influxDb->writeReadings([$payload])) {
            $this->error('Lectura ' . $index . '/' . $count . ' no se pudo guardar en InfluxDB.');

            return self::FAILURE;
        }

        $this->line('Lectura ' . $index . '/' . $count . ' guardada: ' . json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

        if ($index < $count && $delay > 0) {
            sleep($delay);
        }
    }

    $this->info('Listo. Abre el dashboard y deberías ver cambios en la siguiente consulta automática.');

    return self::SUCCESS;
})->purpose('Envía lecturas aleatorias al endpoint de Influx/Lecturas');

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
