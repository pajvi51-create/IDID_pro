<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // นักศึกษาผู้ยื่นคำขอ
            $table->foreignId('company_id')->constrained('companies')->onDelete('restrict'); // สถานประกอบการ
            $table->string('position_title'); // ตำแหน่งที่ขอฝึกงาน
            $table->text('job_description')->nullable(); // รายละเอียดงานที่ได้รับมอบหมาย
            $table->date('start_date'); // วันที่เริ่มฝึก
            $table->date('end_date'); // วันที่สิ้นสุด
            
            // ข้อมูลผู้ประสานงานในสถานประกอบการ
            $table->string('coordinator_name');
            $table->string('coordinator_position')->nullable();
            $table->string('coordinator_phone');
            $table->string('coordinator_email')->nullable();
            
            // สถานะขั้นตอนการอนุมัติ 2 ลำดับขั้น
            $table->enum('status', [
                'draft',
                'pending_instructor',
                'pending_chair',
                'approved',
                'revision_required',
                'rejected'
            ])->default('draft');
            
            $table->tinyInteger('current_stage')->default(1); // 1 = รออาจารย์, 2 = รอประธานหลักสูตร, 3 = เสร็จสิ้น
            $table->text('student_notes')->nullable();
            $table->text('latest_remarks')->nullable(); // บันทึกข้อเสนอแนะล่าสุดจากผู้ตรวจ
            
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('instructor_approved_at')->nullable();
            $table->timestamp('chair_approved_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
