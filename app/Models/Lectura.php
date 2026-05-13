<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lectura extends Model
{
    protected $table = 'lecturas';

    protected $fillable = [
        'sensor_id',
        'temp',
        'hum',
        'pres',
        'rs',
        'viento',
        'dir',
        'vibracion',
        'sonido',
        'received_at',
    ];

    protected $casts = [
        'temp' => 'float',
        'hum' => 'float',
        'pres' => 'float',
        'rs' => 'float',
        'viento' => 'float',
        'dir' => 'float',
        'vibracion' => 'integer',
        'sonido' => 'integer',
        'received_at' => 'datetime',
    ];
}
