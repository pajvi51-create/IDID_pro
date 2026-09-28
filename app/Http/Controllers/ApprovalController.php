<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReviewApplicationRequest;
use App\Models\Application;
use App\Models\ApprovalLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ApprovalController extends Controller
{
    /**
     * Dashboard for Reviewers (Course Instructor and Program Chair)
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // 1. Stage 1 Applications (For Instructor)
        $stage1Applications = Application::with(['user.curriculum', 'company', 'documents'])
            ->where('status', Application::STATUS_PENDING_INSTRUCTOR)
            ->latest('submitted_at')
            ->get();

        // 2. Stage 2 Applications (For Chair)
        $stage2Applications = Application::with(['user.curriculum', 'company', 'documents', 'approvalLogs.user'])
            ->where('status', Application::STATUS_PENDING_CHAIR)
            ->latest('instructor_approved_at')
            ->get();

        // 3. Recently Processed Applications
        $historyApplications = Application::with(['user.curriculum', 'company', 'approvalLogs.user'])
            ->whereIn('status', [Application::STATUS_APPROVED, Application::STATUS_REVISION_REQUIRED, Application::STATUS_REJECTED])
            ->latest('updated_at')
            ->take(10)
            ->get();

        return Inertia::render('Approvals/Index', [
            'stage1Applications' => $stage1Applications,
            'stage2Applications' => $stage2Applications,
            'historyApplications' => $historyApplications,
            'isInstructor' => $user->isInstructor() || $user->isAdmin(),
            'isChair' => $user->isChair() || $user->isAdmin(),
        ]);
    }

    /**
     * Stage 1 Review: Course Instructor checks qualification & documents
     */
    public function reviewStage1(ReviewApplicationRequest $request, Application $application): RedirectResponse
    {
        $this->authorize('reviewTier1', $application);

        $action = $request->input('action');
        $remarks = $request->input('remarks');
        $user = $request->user();

        DB::beginTransaction();
        try {
            if ($action === ApprovalLog::ACTION_APPROVED) {
                $application->update([
                    'status' => Application::STATUS_PENDING_CHAIR,
                    'current_stage' => 2,
                    'instructor_approved_at' => now(),
                    'latest_remarks' => $remarks ?: 'อาจารย์ผู้รับผิดชอบรายวิชาตรวจสอบเอกสารครบถ้วนแล้ว เห็นชอบส่งต่อประธานหลักสูตร',
                ]);
                $message = 'ตรวจสอบผ่านเรียบร้อย! คำขอถูกส่งต่อไปยังประธานหลักสูตรเพื่อพิจารณาขั้นสุดท้าย (ขั้นที่ 2)';
            } elseif ($action === ApprovalLog::ACTION_REVISION) {
                $application->update([
                    'status' => Application::STATUS_REVISION_REQUIRED,
                    'current_stage' => 1,
                    'latest_remarks' => $remarks,
                ]);
                $message = 'ส่งคำขอพร้อมข้อเสนอแนะกลับไปให้นักศึกษาแก้ไขเรียบร้อยแล้ว';
            } else {
                $application->update([
                    'status' => Application::STATUS_REJECTED,
                    'latest_remarks' => $remarks,
                ]);
                $message = 'บันทึกการไม่อนุมัติคำขอเรียบร้อยแล้ว';
            }

            // Create immutable audit log
            ApprovalLog::create([
                'application_id' => $application->id,
                'user_id' => $user->id,
                'stage' => 1,
                'action' => $action,
                'remarks' => $remarks,
            ]);

            DB::commit();

            return redirect()->route('approvals.index')->with('success', $message);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'เกิดข้อผิดพลาดในการบันทึกผลการพิจารณา: ' . $e->getMessage());
        }
    }

    /**
     * Stage 2 Review: Program Chair gives final approval
     */
    public function reviewStage2(ReviewApplicationRequest $request, Application $application): RedirectResponse
    {
        $this->authorize('reviewTier2', $application);

        $action = $request->input('action');
        $remarks = $request->input('remarks');
        $user = $request->user();

        DB::beginTransaction();
        try {
            if ($action === ApprovalLog::ACTION_APPROVED) {
                $application->update([
                    'status' => Application::STATUS_APPROVED,
                    'current_stage' => 3,
                    'chair_approved_at' => now(),
                    'latest_remarks' => $remarks ?: 'ประธานหลักสูตรอนุมัติสถานที่ฝึกประสบการณ์วิชาชีพเรียบร้อยแล้ว',
                ]);
                $message = 'ประธานหลักสูตรอนุมัติขั้นสุดท้ายเรียบร้อยแล้ว! นักศึกษาสามารถพิมพ์หนังสือขอความอนุเคราะห์ได้';
            } elseif ($action === ApprovalLog::ACTION_REVISION) {
                $application->update([
                    'status' => Application::STATUS_REVISION_REQUIRED,
                    'latest_remarks' => $remarks,
                ]);
                $message = 'ส่งคำขอพร้อมข้อเสนอแนะกลับไปให้นักศึกษาแก้ไขเรียบร้อยแล้ว';
            } else {
                $application->update([
                    'status' => Application::STATUS_REJECTED,
                    'latest_remarks' => $remarks,
                ]);
                $message = 'บันทึกการไม่อนุมัติคำขอเรียบร้อยแล้ว';
            }

            // Create immutable audit log
            ApprovalLog::create([
                'application_id' => $application->id,
                'user_id' => $user->id,
                'stage' => 2,
                'action' => $action,
                'remarks' => $remarks,
            ]);

            DB::commit();

            return redirect()->route('approvals.index')->with('success', $message);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'เกิดข้อผิดพลาดในการบันทึกผลการพิจารณา: ' . $e->getMessage());
        }
    }
}
