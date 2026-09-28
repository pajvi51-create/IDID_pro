<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('student_id')->nullable()->unique()->after('id');
            $table->foreignId('role_id')->nullable()->after('email')->constrained('roles')->onDelete('set null');
            $table->foreignId('curriculum_id')->nullable()->after('role_id')->constrained('curriculums')->onDelete('set null');
            $table->string('phone')->nullable()->after('password');
            $table->string('academic_year')->nullable()->after('phone'); // เช่น ชั้นปีที่ 3
            $table->string('avatar')->nullable()->after('academic_year');
            $table->boolean('is_active')->default(true)->after('avatar');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            $table->dropForeign(['curriculum_id']);
            $table->dropColumn(['student_id', 'role_id', 'curriculum_id', 'phone', 'academic_year', 'avatar', 'is_active']);
        });
    }
};
