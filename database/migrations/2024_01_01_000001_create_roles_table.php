<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // 'student', 'instructor', 'chair', 'admin'
            $table->string('label'); // 'นักศึกษา', 'อาจารย์ผู้รับผิดชอบรายวิชา', 'ประธานหลักสูตร', 'ผู้ดูแลระบบ'
            $table->string('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};
