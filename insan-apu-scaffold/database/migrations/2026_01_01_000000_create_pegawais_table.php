<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pegawais', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id')->unique();
            $table->string('full_name');
            $table->string('current_position')->nullable();
            $table->string('department');
            $table->string('unit')->nullable();
            $table->string('employment_status');
            $table->integer('job_level');
            $table->string('mobile_phone')->nullable();
            $table->string('place_of_birth')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->date('join_date')->nullable();
            $table->string('email')->nullable();
            $table->string('nik')->nullable();
            $table->text('nik_address')->nullable();
            $table->text('residential_address')->nullable();
            $table->char('gender', 1)->nullable();
            $table->string('marital_status')->nullable();
            $table->string('education')->nullable();
            $table->string('educational_institution')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pegawais');
    }
};
