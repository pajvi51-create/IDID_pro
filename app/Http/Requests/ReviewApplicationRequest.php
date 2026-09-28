<?php

namespace App\Http\Requests;

use App\Models\ApprovalLog;
use Illuminate\Foundation\Http\FormRequest;

class ReviewApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        return $user && ($user->isInstructor() || $user->isChair() || $user->isAdmin());
    }

    public function rules(): array
    {
        return [
            'action' => ['required', 'string', 'in:' . implode(',', [
                ApprovalLog::ACTION_APPROVED,
                ApprovalLog::ACTION_REVISION,
                ApprovalLog::ACTION_REJECTED,
            ])],
            'remarks' => [
                'nullable',
                'string',
                'max:2000',
                function ($attribute, $value, $fail) {
                    $action = $this->input('action');
                    if (in_array($action, [ApprovalLog::ACTION_REVISION, ApprovalLog::ACTION_REJECTED]) && empty(trim($value ?? ''))) {
                        $fail('กรุณาระบุข้อเสนอแนะหรือเหตุผลในการส่งกลับแก้ไข/ปฏิเสธคำขอ');
                    }
                },
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'action.required' => 'กรุณาเลือกผลการพิจารณา (อนุมัติ, ส่งกลับแก้ไข หรือ ปฏิเสธ)',
            'action.in' => 'ผลการพิจารณาไม่ถูกต้อง',
            'remarks.max' => 'ข้อความข้อเสนอแนะต้องไม่เกิน 2,000 ตัวอักษร',
        ];
    }
}
