<?php

namespace App\Policies;

use App\Models\Application;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ApplicationPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Application $application): Response
    {
        if ($user->isAdmin() || $user->isInstructor() || $user->isChair()) {
            return Response::allow();
        }

        if ($user->isStudent() && $user->id === $application->user_id) {
            return Response::allow();
        }

        return Response::deny('คุณไม่มีสิทธิ์เข้าดูข้อมูลคำขอฝึกงานนี้');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): Response
    {
        if ($user->isStudent()) {
            return Response::allow();
        }

        return Response::deny('เฉพาะนักศึกษาเท่านั้นที่สามารถยื่นคำขออนุมัติสถานที่ฝึกงานได้');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Application $application): Response
    {
        if ($user->id !== $application->user_id) {
            return Response::deny('คุณไม่ใช่เจ้าของคำขอนี้');
        }

        if (!$application->canEdit()) {
            return Response::deny('คำขอนี้อยู่ระหว่างการตรวจสอบ ไม่สามารถแก้ไขได้');
        }

        return Response::allow();
    }

    /**
     * Determine whether the user can submit the application into review pipeline.
     */
    public function submit(User $user, Application $application): Response
    {
        if ($user->id !== $application->user_id) {
            return Response::deny('คุณไม่ใช่เจ้าของคำขอนี้');
        }

        if (!$application->canEdit()) {
            return Response::deny('คำขอนี้ถูกส่งเข้าสู่ระบบการตรวจสอบแล้ว');
        }

        return Response::allow();
    }

    /**
     * Determine whether the user can perform Tier 1 Review (Course Instructor).
     */
    public function reviewTier1(User $user, Application $application): Response
    {
        if (!$user->isInstructor() && !$user->isAdmin()) {
            return Response::deny('เฉพาะอาจารย์ผู้รับผิดชอบรายวิชาเท่านั้นที่สามารถตรวจสอบในขั้นที่ 1 ได้');
        }

        if ($application->status !== Application::STATUS_PENDING_INSTRUCTOR) {
            return Response::deny('คำขอนี้ไม่ได้อยู่ในสถานะรออาจารย์ผู้รับผิดชอบรายวิชาตรวจสอบ');
        }

        return Response::allow();
    }

    /**
     * Determine whether the user can perform Tier 2 Review (Program Chair).
     */
    public function reviewTier2(User $user, Application $application): Response
    {
        if (!$user->isChair() && !$user->isAdmin()) {
            return Response::deny('เฉพาะประธานหลักสูตรเท่านั้นที่สามารถพิจารณาอนุมัติขั้นสุดท้ายได้');
        }

        if ($application->status !== Application::STATUS_PENDING_CHAIR) {
            return Response::deny('คำขอนี้ไม่ได้อยู่ในสถานะรอประธานหลักสูตรอนุมัติ (ต้องผ่านขั้นที่ 1 ก่อน)');
        }

        return Response::allow();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Application $application): Response
    {
        if ($user->isAdmin()) {
            return Response::allow();
        }

        if ($user->id === $application->user_id && $application->status === Application::STATUS_DRAFT) {
            return Response::allow();
        }

        return Response::deny('ไม่สามารถลบคำขอนี้ได้');
    }
}
