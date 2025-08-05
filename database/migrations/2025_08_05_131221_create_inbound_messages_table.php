<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inbound_messages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('phone');
            $table->text('message');
            $table->string('device_id');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inbound_messages');
    }
};
