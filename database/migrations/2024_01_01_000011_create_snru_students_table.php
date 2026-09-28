<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('snru_students', function (Blueprint $table) {
            $table->id();
            $table->string('student_id', 20)->unique();
            $table->string('full_name', 150);
            $table->string('faculty', 255);
            $table->string('major', 255);
            $table->unsignedTinyInteger('year_level')->default(3);
            $table->enum('status', ['active', 'inactive', 'graduated'])->default('active');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->timestamps();

            $table->index('faculty');
            $table->index('major');
            $table->index('year_level');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('snru_students');
    }
};
