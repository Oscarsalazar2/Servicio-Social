<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lanzamientos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamp('fecha')->nullable();
            $table->unsignedSmallInteger('viento')->nullable();
            $table->unsignedSmallInteger('humedad')->nullable();
            $table->decimal('temperatura', 5, 2)->nullable();
            $table->unsignedInteger('presion_atm')->nullable();
            $table->string('botella')->nullable();
            $table->unsignedSmallInteger('presion')->nullable();
            $table->unsignedInteger('agua')->nullable();
            $table->string('modelo_botella')->nullable();
            $table->unsignedSmallInteger('uso_botella')->nullable();
            $table->unsignedInteger('altura')->nullable();
            $table->string('condiciones_optimas')->nullable();
            $table->string('resultado')->nullable();
            $table->text('descripcion')->nullable();
            $table->timestamps();

            $table->index('fecha');
            $table->index('resultado');
            $table->index('condiciones_optimas');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('lanzamientos');
    }
};
