<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // แบบฟอร์มและเอกสารดาวน์โหลด
        Schema::create('downloadable_forms', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // e.g. "แบบคำร้องขออนุมัติสถานที่ฝึกงาน (คพ.01)"
            $table->text('description')->nullable();
            $table->string('file_name');
            $table->string('file_path');
            $table->string('file_extension')->default('pdf');
            $table->unsignedBigInteger('file_size')->default(0);
            $table->integer('download_count')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // คำแนะนำการเตรียมตัว เช่น Resume, Portfolio
        Schema::create('guidelines', function (Blueprint $table) {
            $table->id();
            $table->string('category'); // resume, portfolio, qualification, general
            $table->string('title');
            $table->text('summary')->nullable();
            $table->longText('content');
            $table->string('icon')->default('file-text');
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guidelines');
        Schema::dropIfExists('downloadable_forms');
    }
};
