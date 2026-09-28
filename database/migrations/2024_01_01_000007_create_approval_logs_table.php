<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('approval_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained('applications')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // ผู้พิจารณา (อาจารย์/ประธาน)
            $table->tinyInteger('stage'); // 1 = อาจารย์ผู้รับผิดชอบรายวิชา, 2 = ประธานหลักสูตร
            $table->enum('action', ['approved', 'revision_requested', 'rejected']);
            $table->text('remarks')->nullable(); // ข้อความแนะนำ/เหตุผลที่สั่งแก้ไข
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('approval_logs');
    }
};
