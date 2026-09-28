<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreApplicationRequest;
use App\Models\Application;
use App\Models\ApplicationDocument;
use App\Models\Company;
use App\Models\Curriculum;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ApplicationController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = Application::with(['user.curriculum', 'company', 'documents'])
            ->latest();

        if ($user->isStudent()) {
            $query->where('user_id', $user->id);
        } elseif ($user->isInstructor()) {
            // Instructor sees pending instructor + reviewed
            $query->whereIn('status', [
                Application::STATUS_PENDING_INSTRUCTOR,
                Application::STATUS_PENDING_CHAIR,
                Application::STATUS_APPROVED,
                Application::STATUS_REVISION_REQUIRED,
            ]);
        } elseif ($user->isChair()) {
            // Chair sees pending chair + approved
            $query->whereIn('status', [
                Application::STATUS_PENDING_CHAIR,
                Application::STATUS_APPROVED,
                Application::STATUS_REVISION_REQUIRED,
            ]);
        }

        $applications = $query->paginate(15);

        return Inertia::render('Applications/Index', [
            'applications' => $applications,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorize('create', Application::class);

        $user = $request->user()->load(['curriculum', 'role']);

        // Check if student already has an active application
        $existing = Application::where('user_id', $user->id)
            ->whereIn('status', [
                Application::STATUS_DRAFT,
                Application::STATUS_PENDING_INSTRUCTOR,
                Application::STATUS_PENDING_CHAIR,
                Application::STATUS_APPROVED,
                Application::STATUS_REVISION_REQUIRED,
            ])
            ->first();

        if ($existing) {
            return redirect()->route('applications.show', $existing->id);
        }

        $companies = Company::where('is_active', true)->orderBy('name')->get();
        $curriculums = Curriculum::where('is_active', true)->get();

        return Inertia::render('Applications/Create', [
            'companies' => $companies,
            'curriculums' => $curriculums,
            'user' => $user,
        ]);
    }

    public function store(StoreApplicationRequest $request): RedirectResponse
    {
        $user = $request->user();

        DB::beginTransaction();
        try {
            $isSubmitting = $request->boolean('submit_now', true);
            $initialStatus = $isSubmitting ? Application::STATUS_PENDING_INSTRUCTOR : Application::STATUS_DRAFT;

            $application = Application::create([
                'user_id' => $user->id,
                'company_id' => $request->input('company_id'),
                'position_title' => $request->input('position_title'),
                'job_description' => $request->input('job_description'),
                'start_date' => $request->input('start_date'),
                'end_date' => $request->input('end_date'),
                'coordinator_name' => $request->input('coordinator_name'),
                'coordinator_position' => $request->input('coordinator_position'),
                'coordinator_phone' => $request->input('coordinator_phone'),
                'coordinator_email' => $request->input('coordinator_email'),
                'student_notes' => $request->input('student_notes'),
                'status' => $initialStatus,
                'current_stage' => 1,
                'submitted_at' => $isSubmitting ? now() : null,
            ]);

            // Handle file uploads
            $this->handleFileUpload($request, $application, 'resume_file', 'resume', 'เรซูเม่ (Resume)');
            $this->handleFileUpload($request, $application, 'acceptance_file', 'acceptance_letter', 'หนังสือตอบรับจากสถานประกอบการ');
            $this->handleFileUpload($request, $application, 'consent_file', 'parent_consent', 'หนังสือยินยอมจากผู้ปกครอง');

            DB::commit();

            $msg = $isSubmitting
                ? 'ยื่นคำขออนุมัติสถานที่ฝึกงานเรียบร้อยแล้ว คำขอถูกส่งไปยังอาจารย์ผู้รับผิดชอบรายวิชาเพื่อตรวจสอบในขั้นที่ 1'
                : 'บันทึกแบบร่างคำขออนุมัติเรียบร้อยแล้ว';

            return redirect()->route('applications.show', $application->id)
                ->with('success', $msg);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withInput()->with('error', 'เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' . $e->getMessage());
        }
    }

    public function show(Application $application): Response
    {
        $this->authorize('view', $application);

        $application->load([
            'user.curriculum',
            'company',
            'documents',
            'approvalLogs.user.role',
        ]);

        return Inertia::render('Applications/Show', [
            'application' => $application,
        ]);
    }

    public function edit(Application $application): Response|RedirectResponse
    {
        $this->authorize('update', $application);

        $application->load(['company', 'documents', 'approvalLogs.user']);
        $companies = Company::where('is_active', true)->orderBy('name')->get();

        return Inertia::render('Applications/Edit', [
            'application' => $application,
            'companies' => $companies,
        ]);
    }

    public function update(StoreApplicationRequest $request, Application $application): RedirectResponse
    {
        $this->authorize('update', $application);

        DB::beginTransaction();
        try {
            $isSubmitting = $request->boolean('submit_now', true);
            $newStatus = $isSubmitting ? Application::STATUS_PENDING_INSTRUCTOR : $application->status;

            $application->update([
                'company_id' => $request->input('company_id'),
                'position_title' => $request->input('position_title'),
                'job_description' => $request->input('job_description'),
                'start_date' => $request->input('start_date'),
                'end_date' => $request->input('end_date'),
                'coordinator_name' => $request->input('coordinator_name'),
                'coordinator_position' => $request->input('coordinator_position'),
                'coordinator_phone' => $request->input('coordinator_phone'),
                'coordinator_email' => $request->input('coordinator_email'),
                'student_notes' => $request->input('student_notes'),
                'status' => $newStatus,
                'current_stage' => 1,
                'submitted_at' => $isSubmitting ? now() : $application->submitted_at,
            ]);

            // Handle optional new file uploads
            $this->handleFileUpload($request, $application, 'resume_file', 'resume', 'เรซูเม่ (Resume)');
            $this->handleFileUpload($request, $application, 'acceptance_file', 'acceptance_letter', 'หนังสือตอบรับจากสถานประกอบการ');
            $this->handleFileUpload($request, $application, 'consent_file', 'parent_consent', 'หนังสือยินยอมจากผู้ปกครอง');

            DB::commit();

            $msg = $isSubmitting
                ? 'ส่งคำขอที่แก้ไขแล้วไปยังอาจารย์ผู้รับผิดชอบรายวิชาเรียบร้อยแล้ว'
                : 'บันทึกการแก้ไขข้อมูลเรียบร้อยแล้ว';

            return redirect()->route('applications.show', $application->id)
                ->with('success', $msg);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withInput()->with('error', 'เกิดข้อผิดพลาดในการอัปเดต: ' . $e->getMessage());
        }
    }

    public function submit(Request $request, Application $application): RedirectResponse
    {
        $this->authorize('submit', $application);

        $application->update([
            'status' => Application::STATUS_PENDING_INSTRUCTOR,
            'current_stage' => 1,
            'submitted_at' => now(),
        ]);

        return redirect()->route('applications.show', $application->id)
            ->with('success', 'ยื่นคำขอไปยังอาจารย์ผู้รับผิดชอบรายวิชาเพื่อพิจารณาขั้นที่ 1 เรียบร้อยแล้ว');
    }

    private function handleFileUpload(Request $request, Application $application, string $fieldName, string $docType, string $title): void
    {
        if ($request->hasFile($fieldName)) {
            $file = $request->file($fieldName);
            $path = $file->store('applications/' . $application->id, 'public');

            // Delete old doc of this type if exists
            $existing = ApplicationDocument::where('application_id', $application->id)
                ->where('document_type', $docType)
                ->first();

            if ($existing) {
                Storage::disk('public')->delete($existing->file_path);
                $existing->delete();
            }

            ApplicationDocument::create([
                'application_id' => $application->id,
                'document_type' => $docType,
                'title' => $title,
                'original_name' => $file->getClientOriginalName(),
                'file_path' => $path,
                'file_size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
            ]);
        }
    }
}
