<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SnruStudent extends Model
{
    use HasFactory;

    protected $table = 'snru_students';

    protected $fillable = [
        'student_id',
        'full_name',
        'faculty',
        'major',
        'year_level',
        'status',
        'email',
        'phone',
    ];

    protected $casts = [
        'year_level' => 'integer',
    ];
}
