<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Guideline extends Model
{
    use HasFactory;

    protected $fillable = [
        'category',
        'title',
        'summary',
        'content',
        'icon',
        'is_published',
    ];

    protected $casts = [
        'is_published' => 'boolean',
    ];
}
