<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('attachments', function (Blueprint $table) {
            $table->string('file_name')->nullable()->after('file_path');
            $table->string('mime')->nullable()->after('file_name');
            $table->unsignedBigInteger('size')->nullable()->after('mime');
        });
    }
    public function down(): void {
        Schema::table('attachments', function (Blueprint $table) {
            $table->dropColumn(['file_name', 'mime', 'size']);
        });
    }
};
