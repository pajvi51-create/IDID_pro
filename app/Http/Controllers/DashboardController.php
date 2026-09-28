<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Company;
use App\Models\Curriculum;
use App\Models\DownloadableForm;
use App\Models\Guideline;
use App\Models\Role;
use App\Models\Timeline;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user()->load(['role', 'curriculum']);
        $roleName = $user->role?->name ?? 'student';

        $timelines = Timeline::where('is_published', true)
            ->orderBy('start_date', 'asc')
            ->take(5)
            ->get();

        $guidelines = Guideline::where('is_published', true)
            ->take(4)
            ->get();

        $forms = DownloadableForm::where('is_active', true)
            ->orderBy('download_count', 'desc')
            ->take(4)
            ->get();

        // Data specifically tailored per role
        $roleData = [];

        if ($roleName === Role::STUDENT) {
            $application = Application::with(['company', 'documents', 'approvalLogs.user.role'])
                ->where('user_id', $user->id)
                ->latest()
                ->first();

            $partnerCompanies = Company::where('is_active', true)
                ->where('is_partner', true)
                ->take(6)
                ->get();

            $roleData = [
                'application' => $application,
                'partnerCompanies' => $partnerCompanies,
            ];
        } elseif ($roleName === Role::INSTRUCTOR) {
            $pendingApplications = Application::with(['user.curriculum', 'company', 'documents'])
                ->where('status', Application::STATUS_PENDING_INSTRUCTOR)
                ->latest('submitted_at')
                ->get();

            $reviewedCount = Application::whereIn('status', [
                Application::STATUS_PENDING_CHAIR,
                Application::STATUS_APPROVED,
                Application::STATUS_REVISION_REQUIRED,
            ])->count();

            $roleData = [
                'pendingCount' => $pendingApplications->count(),
                'reviewedCount' => $reviewedCount,
                'pendingApplications' => $pendingApplications,
            ];
        } elseif ($roleName === Role::CHAIR) {
            $pendingApplications = Application::with(['user.curriculum', 'company', 'documents', 'approvalLogs.user'])
                ->where('status', Application::STATUS_PENDING_CHAIR)
                ->latest('instructor_approved_at')
                ->get();

            $approvedCount = Application::where('status', Application::STATUS_APPROVED)->count();

            $roleData = [
                'pendingCount' => $pendingApplications->count(),
                'approvedCount' => $approvedCount,
                'pendingApplications' => $pendingApplications,
            ];
        } elseif ($roleName === Role::ADMIN) {
            $roleData = [
                'stats' => [
                    'totalStudents' => User::whereHas('role', fn($q) => $q->where('name', Role::STUDENT))->count(),
                    'totalCompanies' => Company::where('is_active', true)->count(),
                    'totalApplications' => Application::count(),
                    'approvedApplications' => Application::where('status', Application::STATUS_APPROVED)->count(),
                    'pendingInstructor' => Application::where('status', Application::STATUS_PENDING_INSTRUCTOR)->count(),
                    'pendingChair' => Application::where('status', Application::STATUS_PENDING_CHAIR)->count(),
                ],
                'curriculums' => Curriculum::where('is_active', true)->withCount('users')->get(),
            ];
        }

        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => $user,
            ],
            'timelines' => $timelines,
            'guidelines' => $guidelines,
            'forms' => $forms,
            'roleData' => $roleData,
        ]);
    }
}
