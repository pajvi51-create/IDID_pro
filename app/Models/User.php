<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'student_id',
        'phone',
        'role_id',
        'curriculum_id',
        'academic_year',
        'avatar',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function curriculum(): BelongsTo
    {
        return $this->belongsTo(Curriculum::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }

    public function approvalLogs(): HasMany
    {
        return $this->hasMany(ApprovalLog::class);
    }

    public function dailyLogs(): HasMany
    {
        return $this->hasMany(DailyLog::class);
    }

    public function verifiedDailyLogs(): HasMany
    {
        return $this->hasMany(DailyLog::class, 'verified_by_user_id');
    }

    // Role helper methods
    public function isStudent(): bool
    {
        return $this->role?->name === Role::STUDENT;
    }

    public function isInstructor(): bool
    {
        return $this->role?->name === Role::INSTRUCTOR;
    }

    public function isChair(): bool
    {
        return $this->role?->name === Role::CHAIR;
    }

    public function isAdmin(): bool
    {
        return $this->role?->name === Role::ADMIN;
    }
}
