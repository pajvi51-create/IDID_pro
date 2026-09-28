<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'business_type',
        'description',
        'contact_person',
        'email',
        'phone',
        'website',
        'address',
        'province',
        'max_trainees',
        'has_allowance',
        'allowance_amount',
        'is_partner',
        'is_active',
    ];

    protected $casts = [
        'has_allowance' => 'boolean',
        'allowance_amount' => 'decimal:2',
        'is_partner' => 'boolean',
        'is_active' => 'boolean',
        'max_trainees' => 'integer',
    ];

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }
}
