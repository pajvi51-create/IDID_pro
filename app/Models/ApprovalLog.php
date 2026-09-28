<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApprovalLog extends Model
{
    use HasFactory;

    public const ACTION_APPROVED = 'approved';
    public const ACTION_REVISION = 'revision_requested';
    public const ACTION_REJECTED = 'rejected';

    protected $fillable = [
        'application_id',
        'user_id',
        'stage',
        'action',
        'remarks',
    ];

    protected $casts = [
        'stage' => 'integer',
    ];

    protected $appends = ['stage_label', 'action_label'];

    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getStageLabelAttribute(): string
    {
        return match ($this->stage) {
            1 => 'ขั้นที่ 1: อาจารย์ผู้รับผิดชอบรายวิชา',
            2 => 'ขั้นที่ 2: ประธานหลักสูตร',
            default => 'ไม่ระบุขั้น',
        };
    }

    public function getActionLabelAttribute(): string
    {
        return match ($this->action) {
            self::ACTION_APPROVED => 'อนุมัติ / เห็นชอบผ่านเกณฑ์',
            self::ACTION_REVISION => 'ส่งกลับเพื่อให้นักศึกษาแก้ไขข้อมูล/เอกสาร',
            self::ACTION_REJECTED => 'ปฏิเสธคำขอ',
            default => $this->action,
        };
    }
}
