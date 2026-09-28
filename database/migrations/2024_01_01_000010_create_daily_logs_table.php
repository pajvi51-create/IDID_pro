<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('application_id')->nullable()->constrained('applications')->onDelete('cascade');
            $table->date('log_date'); // วันที่ปฏิบัติงาน
            $table->string('check_in_time')->default('08:30'); // เวลาเข้างาน
            $table->string('check_out_time')->default('17:30'); // เวลาเลิกงาน
            $table->decimal('work_hours', 4, 1)->default(8.0); // จำนวนชั่วโมงปฏิบัติงาน
            $table->string('task_title'); // หัวข้องานที่ได้รับมอบหมาย
            $table->text('task_description'); // รายละเอียดงานที่ปฏิบัติจริง
            $table->string('tech_stack')->nullable(); // เทคโนโลยี/เครื่องมือที่ใช้ เช่น Laravel, React, MySQL
            $table->text('problems_encountered')->nullable(); // ปัญหาและอุปสรรคที่พบ
            $table->text('solutions_applied')->nullable(); // วิธีการแก้ไขปัญหา
            $table->text('learning_outcome')->nullable(); // สิ่งที่ได้เรียนรู้ใหม่
            $table->string('attachment_path')->nullable(); // ไฟล์หรือรูปภาพประกอบ
            
            // ข้อมูลการตรวจรับรองของอาจารย์
            $table->boolean('is_verified')->default(false); // อาจารย์ตรวจรับรองแล้วหรือไม่
            $table->foreignId('verified_by_user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->text('instructor_comment')->nullable(); // ความคิดเห็น/คำแนะนำของอาจารย์
            $table->timestamp('verified_at')->nullable(); // วันเวลาที่อาจารย์ตรวจ
            
            $table->timestamps();

            // Index เพื่อการค้นหาที่รวดเร็ว
            $table->index(['user_id', 'log_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_logs');
    }
};
