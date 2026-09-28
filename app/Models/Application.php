<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Application extends Model
{
    use HasFactory;

    public const STATUS_DRAFT = 'draft';
    public const STATUS_PENDING_INSTRUCTOR = 'pending_instructor';
    public const STATUS_PENDING_CHAIR = 'pending_chair';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_REVISION_REQUIRED = 'revision_required';
    public const STATUS_REJECTED = 'rejected';

    protected $fillable = [
        'user_id',
        'company_id',
        'position_title',
        'job_description',
        'start_date',
        'end_date',
        'coordinator_name',
        'coordinator_position',
        'coordinator_phone',
        'coordinator_email',
        'status',
        'current_stage',
        'student_notes',
        'latest_remarks',
        'submitted_at',
        'instructor_approved_at',
        'chair_approved_at',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'current_stage' => 'integer',
        'submitted_at' => 'datetime',
        'instructor_approved_at' => 'datetime',
        'chair_approved_at' => 'datetime',
    ];

    protected $appends = ['status_label', 'status_badge_color', 'progress_percentage'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(ApplicationDocument::class);
    }

    public function approvalLogs(): HasMany
    {
        return $this->hasMany(ApprovalLog::class)->orderBy('created_at', 'desc');
    }

    public function dailyLogs(): HasMany
    {
        return $this->hasMany(DailyLog::class)->orderBy('log_date', 'desc');
    }

    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            self::STATUS_DRAFT => 'ฉบับร่าง (Draft)',
            self::STATUS_PENDING_INSTRUCTOR => 'รออาจารย์ผู้รับผิดชอบรายวิชาตรวจสอบ (ขั้นที่ 1)',
            self::STATUS_PENDING_CHAIR => 'รอประธานหลักสูตรพิจารณาอนุมัติ (ขั้นที่ 2)',
            self::STATUS_APPROVED => 'อนุมัติสถานที่ฝึกงานเรียบร้อยแล้ว',
            self::STATUS_REVISION_REQUIRED => 'ส่งกลับเพื่อแก้ไขข้อมูล/เอกสาร',
            self::STATUS_REJECTED => 'ไม่อนุมัติ',
            default => 'ไม่ระบุ',
        };
    }

    public function getStatusBadgeColorAttribute(): string
    {
        return match ($this->status) {
            self::STATUS_DRAFT => 'bg-gray-100 text-gray-700 border-gray-300',
            self::STATUS_PENDING_INSTRUCTOR => 'bg-amber-50 text-amber-700 border-amber-300',
            self::STATUS_PENDING_CHAIR => 'bg-blue-50 text-blue-700 border-blue-300',
            self::STATUS_APPROVED => 'bg-emerald-50 text-emerald-700 border-emerald-300',
            self::STATUS_REVISION_REQUIRED => 'bg-rose-50 text-rose-700 border-rose-300',
            self::STATUS_REJECTED => 'bg-red-100 text-red-800 border-red-300',
            default => 'bg-gray-100 text-gray-700 border-gray-300',
        };
    }

    public function getProgressPercentageAttribute(): int
    {
        return match ($this->status) {
            self::STATUS_DRAFT => 15,
            self::STATUS_PENDING_INSTRUCTOR => 40,
            self::STATUS_PENDING_CHAIR => 75,
            self::STATUS_APPROVED => 100,
            self::STATUS_REVISION_REQUIRED => 35,
            self::STATUS_REJECTED => 0,
            default => 0,
        };
    }

    // State transition helpers
    public function canEdit(): bool
    {
        return in_array($this->status, [self::STATUS_DRAFT, self::STATUS_REVISION_REQUIRED]);
    }

    public function isPendingInstructor(): bool
    {
        return $this->status === self::STATUS_PENDING_INSTRUCTOR;
    }

    public function isPendingChair(): bool
    {
        return $this->status === self::STATUS_PENDING_CHAIR;
    }

    public function isApproved(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }
}
