<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Lanzamiento extends Model
{
    use HasFactory;

    protected $table = 'lanzamientos';

    protected $fillable = [
        'user_id',
        'fecha',
        'viento',
        'humedad',
        'temperatura',
        'presion_atm',
        'botella',
        'presion',
        'agua',
        'modelo_botella',
        'uso_botella',
        'altura',
        'condiciones_optimas',
        'resultado',
        'descripcion',
    ];

    protected $casts = [
        'fecha' => 'datetime',
        'temperatura' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
