<?php

namespace App\Http\Requests;

use App\Models\Application;
use Illuminate\Foundation\Http\FormRequest;

class StoreApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Application::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'company_id' => ['required', 'exists:companies,id'],
            'position_title' => ['required', 'string', 'max:255'],
            'job_description' => ['nullable', 'string', 'max:2000'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'coordinator_name' => ['required', 'string', 'max:255'],
            'coordinator_position' => ['nullable', 'string', 'max:255'],
            'coordinator_phone' => ['required', 'string', 'max:50'],
            'coordinator_email' => ['nullable', 'email', 'max:255'],
            'student_notes' => ['nullable', 'string', 'max:1000'],
            'submit_now' => ['nullable', 'boolean'],
            'resume_file' => ['nullable', 'file', 'mimes:pdf', 'max:10240'], // 10MB
            'acceptance_file' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'],
            'consent_file' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'],
        ];
    }

    public function messages(): array
    {
        return [
            'company_id.required' => 'กรุณาเลือกสถานประกอบการที่ต้องการยื่นฝึกงาน',
            'company_id.exists' => 'ไม่พบข้อมูลสถานประกอบการที่เลือกในระบบ',
            'position_title.required' => 'กรุณาระบุตำแหน่งที่ขอฝึกงาน',
            'start_date.required' => 'กรุณาระบุวันที่เริ่มต้นการฝึกประสบการณ์',
            'end_date.required' => 'กรุณาระบุวันที่สิ้นสุดการฝึกประสบการณ์',
            'end_date.after' => 'วันที่สิ้นสุดต้องอยู่หลังจากวันที่เริ่มต้น',
            'coordinator_name.required' => 'กรุณาระบุชื่อผู้ประสานงานในสถานประกอบการ',
            'coordinator_phone.required' => 'กรุณาระบุเบอร์โทรศัพท์ผู้ประสานงาน',
            'resume_file.mimes' => 'เอกสารเรซูเม่ต้องเป็นไฟล์ PDF เท่านั้น',
            'resume_file.max' => 'ขนาดไฟล์เรซูเม่ต้องไม่เกิน 10MB',
        ];
    }
}
