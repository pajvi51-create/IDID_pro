<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // ชื่อหน่วยงาน/สถานประกอบการ
            $table->string('business_type')->nullable(); // เช่น Software House, Network, Data, IT Support
            $table->text('description')->nullable(); // รายละเอียด/ลักษณะงาน
            $table->string('contact_person')->nullable(); // ผู้ประสานงาน/บุคคลติดต่อ
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('website')->nullable();
            $table->text('address')->nullable();
            $table->string('province')->nullable();
            $table->integer('max_trainees')->default(2); // จำนวนที่เปิดรับ
            $table->boolean('has_allowance')->default(false); // มีเบี้ยเลี้ยงหรือไม่
            $table->decimal('allowance_amount', 10, 2)->nullable();
            $table->boolean('is_partner')->default(true); // บริษัทความร่วมมือของสาขา
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
