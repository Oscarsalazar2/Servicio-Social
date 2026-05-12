<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('lecturas', function (Blueprint $table) {
            $table->id();
            $table->string('sensor_id')->default('ESP32');
            $table->decimal('temp', 8, 2)->nullable();
            $table->decimal('hum', 8, 2)->nullable();
            $table->decimal('pres', 10, 2)->nullable();
            $table->decimal('rs', 10, 2)->nullable();
            $table->decimal('viento', 8, 2)->nullable();
            $table->decimal('dir', 8, 2)->nullable();
            $table->tinyInteger('vibracion')->nullable();
            $table->tinyInteger('sonido')->nullable();
            $table->timestamp('received_at')->nullable()->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lecturas');
    }
};
