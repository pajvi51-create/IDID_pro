<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('curriculums', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // e.g. CS-2565
            $table->string('name'); // e.g. วิทยาการคอมพิวเตอร์ (Computer Science)
            $table->string('degree')->default('วท.บ. (วิทยาศาสตรบัณฑิต)');
            $table->string('department')->default('สาขาวิชาคอมพิวเตอร์');
            $table->string('faculty')->default('คณะวิทยาศาสตร์และเทคโนโลยี');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('curriculums');
    }
};
