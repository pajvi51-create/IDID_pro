<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    use HasFactory;

    public const STUDENT = 'student';
    public const INSTRUCTOR = 'instructor';
    public const CHAIR = 'chair';
    public const ADMIN = 'admin';

    protected $fillable = [
        'name',
        'label',
        'description',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
