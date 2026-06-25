<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pegawai extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'employee_id',
        'full_name',
        'current_position',
        'department',
        'unit',
        'employment_status',
        'job_level',
        'mobile_phone',
        'place_of_birth',
        'date_of_birth',
        'join_date',
        'email',
        'nik',
        'nik_address',
        'residential_address',
        'gender',
        'marital_status',
        'education',
        'educational_institution',
        'is_active'
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'join_date' => 'date',
        'is_active' => 'boolean',
    ];

    // Accessors for calculated fields can be added here
}
