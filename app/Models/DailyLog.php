<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DailyLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'application_id',
        'log_date',
        'check_in_time',
        'check_out_time',
        'work_hours',
        'task_title',
        'task_description',
        'tech_stack',
        'problems_encountered',
        'solutions_applied',
        'learning_outcome',
        'attachment_path',
        'is_verified',
        'verified_by_user_id',
        'instructor_comment',
        'verified_at',
    ];

    protected $casts = [
        'log_date' => 'date',
        'work_hours' => 'decimal:1',
        'is_verified' => 'boolean',
        'verified_at' => 'datetime',
    ];

    protected $appends = [
        'formatted_date',
        'tech_tags',
        'status_badge',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by_user_id');
    }

    public function getFormattedDateAttribute(): string
    {
        if (!$this->log_date) {
            return '';
        }

        $thaiMonths = [
            1 => 'มกราคม', 2 => 'กุมภาพันธ์', 3 => 'มีนาคม', 4 => 'เมษายน',
            5 => 'พฤษภาคม', 6 => 'มิถุนายน', 7 => 'กรกฎาคม', 8 => 'สิงหาคม',
            9 => 'กันยายน', 10 => 'ตุลาคม', 11 => 'พฤศจิกายน', 12 => 'ธันวาคม',
        ];

        $thaiDays = [
            'Sunday' => 'วันอาทิตย์',
            'Monday' => 'วันจันทร์',
            'Tuesday' => 'วันอังคาร',
            'Wednesday' => 'วันพุธ',
            'Thursday' => 'วันพฤหัสบดี',
            'Friday' => 'วันศุกร์',
            'Saturday' => 'วันเสาร์',
        ];

        $carbon = Carbon::parse($this->log_date);
        $dayName = $thaiDays[$carbon->format('l')] ?? '';
        $day = $carbon->day;
        $month = $thaiMonths[$carbon->month] ?? '';
        $year = $carbon->year + 543;

        return "{$dayName}ที่ {$day} {$month} {$year}";
    }

    public function getTechTagsAttribute(): array
    {
        if (empty($this->tech_stack)) {
            return [];
        }

        return array_map('trim', explode(',', $this->tech_stack));
    }

    public function getStatusBadgeAttribute(): array
    {
        if ($this->is_verified) {
            return [
                'text' => 'ตรวจรับรองแล้ว',
                'color' => 'bg-emerald-50 text-emerald-700 border-emerald-300',
            ];
        }

        return [
            'text' => 'รออาจารย์ตรวจรับรอง',
            'color' => 'bg-amber-50 text-amber-700 border-amber-300',
        ];
    }
}
