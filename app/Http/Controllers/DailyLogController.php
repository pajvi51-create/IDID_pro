<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\DailyLog;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DailyLogController extends Controller
{
    /**
     * Display the daily logbook page.
     * Dual-perspective: Student records/views history; Instructor/Chair selects students to inspect & supervise.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $isInstructorOrAdmin = in_array($user->role?->name, [Role::INSTRUCTOR, Role::CHAIR, Role::ADMIN]);

        if ($isInstructorOrAdmin) {
            return $this->instructorView($request);
        }

        return $this->studentView($user);
    }

    /**
     * View for Students: Record daily work, track hours, view chronological history & teacher feedback.
     */
    protected function studentView(User $user): Response
    {
        $activeApplication = $user->applications()
            ->with('company')
            ->latest()
            ->first();

        $dailyLogs = DailyLog::where('user_id', $user->id)
            ->with(['verifier:id,name'])
            ->orderBy('log_date', 'desc')
            ->get();

        $totalHours = (float) $dailyLogs->sum('work_hours');
        $requiredHours = 400; // เกณฑ์มาตรฐานชั่วโมงฝึกงานหลักสูตรคอมพิวเตอร์
        $verifiedCount = $dailyLogs->where('is_verified', true)->count();
        $pendingCount = $dailyLogs->where('is_verified', false)->count();

        $stats = [
            'total_hours' => $totalHours,
            'required_hours' => $requiredHours,
            'remaining_hours' => max(0, $requiredHours - $totalHours),
            'progress_percentage' => min(100, round(($totalHours / $requiredHours) * 100)),
            'total_days' => $dailyLogs->count(),
            'verified_count' => $verifiedCount,
            'pending_count' => $pendingCount,
        ];

        return Inertia::render('Logbook/Index', [
            'isInstructorView' => false,
            'dailyLogs' => $dailyLogs,
            'stats' => $stats,
            'activeApplication' => $activeApplication,
        ]);
    }

    /**
     * View for Instructors/Chair: Select students from roster and inspect their day-by-day activities.
     */
    protected function instructorView(Request $request): Response
    {
        // 1. Fetch student roster with their aggregated log metrics and workplace info
        $students = User::whereHas('role', function ($q) {
            $q->where('name', Role::STUDENT);
        })
        ->with([
            'curriculum:id,name,code',
            'applications' => fn($q) => $q->with('company')->latest(),
        ])
        ->withCount([
            'dailyLogs',
            'dailyLogs as pending_logs_count' => fn($q) => $q->where('is_verified', false),
            'dailyLogs as verified_logs_count' => fn($q) => $q->where('is_verified', true),
        ])
        ->withSum('dailyLogs as total_hours', 'work_hours')
        ->get()
        ->map(function ($student) {
            $activeApp = $student->applications->first();
            return [
                'id' => $student->id,
                'name' => $student->name,
                'student_id' => $student->student_id,
                'curriculum' => $student->curriculum?->name ?? 'สาขาวิชาคอมพิวเตอร์',
                'company_name' => $activeApp?->company?->name ?? 'ยังไม่ระบุสถานที่ฝึกงาน',
                'position_title' => $activeApp?->position_title ?? 'นักศึกษาฝึกงาน',
                'total_hours' => (float) ($student->total_hours ?? 0),
                'total_days' => (int) $student->daily_logs_count,
                'pending_count' => (int) $student->pending_logs_count,
                'verified_count' => (int) $student->verified_logs_count,
            ];
        });

        // 2. Determine which student is selected (from query param or default to student with pending logs or first student)
        $selectedStudentId = (int) $request->query('student_id');
        $selectedStudent = null;

        if ($selectedStudentId) {
            $selectedStudent = $students->firstWhere('id', $selectedStudentId);
        }

        if (!$selectedStudent && $students->isNotEmpty()) {
            // Priority: select the student with pending logs to review, otherwise first student
            $selectedStudent = $students->firstWhere('pending_count', '>', 0) ?? $students->first();
        }

        // 3. Load daily logs and detailed stats for the selected student
        $dailyLogs = collect();
        $stats = [
            'total_hours' => 0,
            'required_hours' => 400,
            'remaining_hours' => 400,
            'progress_percentage' => 0,
            'total_days' => 0,
            'verified_count' => 0,
            'pending_count' => 0,
        ];

        if ($selectedStudent) {
            $dailyLogs = DailyLog::where('user_id', $selectedStudent['id'])
                ->with(['verifier:id,name'])
                ->orderBy('log_date', 'desc')
                ->get();

            $totalHours = (float) $dailyLogs->sum('work_hours');
            $requiredHours = 400;
            $verifiedCount = $dailyLogs->where('is_verified', true)->count();
            $pendingCount = $dailyLogs->where('is_verified', false)->count();

            $stats = [
                'total_hours' => $totalHours,
                'required_hours' => $requiredHours,
                'remaining_hours' => max(0, $requiredHours - $totalHours),
                'progress_percentage' => min(100, round(($totalHours / $requiredHours) * 100)),
                'total_days' => $dailyLogs->count(),
                'verified_count' => $verifiedCount,
                'pending_count' => $pendingCount,
            ];
        }

        return Inertia::render('Logbook/Index', [
            'isInstructorView' => true,
            'students' => $students,
            'selectedStudent' => $selectedStudent,
            'dailyLogs' => $dailyLogs,
            'stats' => $stats,
        ]);
    }

    /**
     * Store a newly created daily log entry (by Student).
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'log_date' => 'required|date',
            'check_in_time' => 'required|string|max:10',
            'check_out_time' => 'required|string|max:10',
            'work_hours' => 'required|numeric|min:0.5|max:24',
            'task_title' => 'required|string|max:255',
            'task_description' => 'required|string',
            'tech_stack' => 'nullable|string|max:255',
            'problems_encountered' => 'nullable|string',
            'solutions_applied' => 'nullable|string',
            'learning_outcome' => 'nullable|string',
        ], [
            'log_date.required' => 'กรุณาระบุวันที่ปฏิบัติงาน',
            'task_title.required' => 'กรุณาระบุหัวข้องานที่ปฏิบัติ',
            'task_description.required' => 'กรุณาระบุรายละเอียดการปฏิบัติงาน',
            'work_hours.required' => 'กรุณาระบุจำนวนชั่วโมง',
        ]);

        $activeApp = $user->applications()->latest()->first();

        DailyLog::create([
            'user_id' => $user->id,
            'application_id' => $activeApp?->id,
            'log_date' => $validated['log_date'],
            'check_in_time' => $validated['check_in_time'],
            'check_out_time' => $validated['check_out_time'],
            'work_hours' => $validated['work_hours'],
            'task_title' => $validated['task_title'],
            'task_description' => $validated['task_description'],
            'tech_stack' => $validated['tech_stack'],
            'problems_encountered' => $validated['problems_encountered'],
            'solutions_applied' => $validated['solutions_applied'],
            'learning_outcome' => $validated['learning_outcome'],
            'is_verified' => false,
        ]);

        return redirect()->route('logbook.index')
            ->with('success', 'บันทึกการปฏิบัติงานประจำวันเรียบร้อยแล้ว');
    }

    /**
     * Update an existing daily log entry.
     */
    public function update(Request $request, DailyLog $dailyLog): RedirectResponse
    {
        $user = $request->user();

        // Only the owner can edit, and only if not verified yet (or user is instructor/admin)
        if ($dailyLog->user_id !== $user->id && !in_array($user->role?->name, [Role::INSTRUCTOR, Role::CHAIR, Role::ADMIN])) {
            abort(403, 'ไม่มีสิทธิ์แก้ไขบันทึกนี้');
        }

        $validated = $request->validate([
            'log_date' => 'required|date',
            'check_in_time' => 'required|string|max:10',
            'check_out_time' => 'required|string|max:10',
            'work_hours' => 'required|numeric|min:0.5|max:24',
            'task_title' => 'required|string|max:255',
            'task_description' => 'required|string',
            'tech_stack' => 'nullable|string|max:255',
            'problems_encountered' => 'nullable|string',
            'solutions_applied' => 'nullable|string',
            'learning_outcome' => 'nullable|string',
        ]);

        $dailyLog->update($validated);

        return redirect()->back()
            ->with('success', 'อัปเดตบันทึกการปฏิบัติงานเรียบร้อยแล้ว');
    }

    /**
     * Delete an unverified daily log entry.
     */
    public function destroy(Request $request, DailyLog $dailyLog): RedirectResponse
    {
        $user = $request->user();

        if ($dailyLog->user_id !== $user->id && !in_array($user->role?->name, [Role::ADMIN])) {
            abort(403, 'ไม่มีสิทธิ์ลบบันทึกนี้');
        }

        if ($dailyLog->is_verified && $user->role?->name !== Role::ADMIN) {
            return redirect()->back()
                ->with('error', 'ไม่สามารถลบบันทึกที่อาจารย์ตรวจรับรองแล้วได้');
        }

        $dailyLog->delete();

        return redirect()->back()
            ->with('success', 'ลบบันทึกการปฏิบัติงานเรียบร้อยแล้ว');
    }

    /**
     * Verify and provide feedback for a student's daily log (Instructor/Chair/Admin).
     */
    public function verify(Request $request, DailyLog $dailyLog): RedirectResponse
    {
        $user = $request->user();

        if (!in_array($user->role?->name, [Role::INSTRUCTOR, Role::CHAIR, Role::ADMIN])) {
            abort(403, 'เฉพาะอาจารย์หรือประธานสาขาวิชาเท่านั้นที่มีสิทธิ์ตรวจรับรองบันทึก');
        }

        $validated = $request->validate([
            'instructor_comment' => 'nullable|string|max:1000',
            'is_verified' => 'required|boolean',
        ]);

        $dailyLog->update([
            'is_verified' => $validated['is_verified'],
            'verified_by_user_id' => $user->id,
            'instructor_comment' => $validated['instructor_comment'] ?? null,
            'verified_at' => now(),
        ]);

        $statusText = $validated['is_verified'] ? 'ตรวจรับรองและให้คำแนะนำการฝึกงาน' : 'ยกเลิกการรับรอง';

        return redirect()->back()
            ->with('success', "{$statusText}ของนักศึกษาเรียบร้อยแล้ว");
    }
}
