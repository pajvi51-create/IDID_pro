<?php

namespace App\Http\Controllers;

use App\Models\Curriculum;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function showLogin(): Response
    {
        return Inertia::render('Auth/Login', [
            'roles' => Role::all(),
            'demoUsers' => [
                ['role' => 'student', 'label' => 'นักศึกษา (ปาจรีย์)', 'email' => 'student@snru.ac.th'],
                ['role' => 'instructor', 'label' => 'อาจารย์ผู้รับผิดชอบรายวิชา (ขั้นที่ 1)', 'email' => 'instructor@snru.ac.th'],
                ['role' => 'chair', 'label' => 'ประธานหลักสูตร (ขั้นที่ 2)', 'email' => 'chair@snru.ac.th'],
                ['role' => 'admin', 'label' => 'ผู้ดูแลระบบ (Admin)', 'email' => 'admin@snru.ac.th'],
            ],
        ]);
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        // Support login with either student_id or email
        $user = User::where('email', $credentials['email'])
            ->orWhere('student_id', $credentials['email'])
            ->first();

        if ($user && Hash::check($credentials['password'], $user->password)) {
            Auth::login($user, $request->boolean('remember'));
            $request->session()->regenerate();
            return redirect()->intended(route('dashboard'));
        }

        throw ValidationException::withMessages([
            'email' => 'รหัสนักศึกษา/อีเมล หรือรหัสผ่านไม่ถูกต้อง',
        ]);
    }

    public function showRegister(): Response
    {
        $curriculums = Curriculum::where('is_active', true)->get();

        return Inertia::render('Auth/Register', [
            'curriculums' => $curriculums,
        ]);
    }

    public function register(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'student_id' => ['required', 'string', 'max:20', 'unique:users,student_id'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
            'curriculum_id' => ['required', 'exists:curriculums,id'],
            'phone' => ['required', 'string', 'max:20'],
        ]);

        $studentRole = Role::where('name', Role::STUDENT)->firstOrFail();

        $user = User::create([
            'name' => $validated['name'],
            'student_id' => $validated['student_id'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'curriculum_id' => $validated['curriculum_id'],
            'phone' => $validated['phone'],
            'role_id' => $studentRole->id,
            'academic_year' => 'ชั้นปีที่ 3',
            'is_active' => true,
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('dashboard')->with('success', 'ลงทะเบียนเข้าสู่ระบบเรียบร้อยแล้ว');
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login')->with('success', 'ออกจากระบบเรียบร้อยแล้ว');
    }

    /**
     * Switch user session instantly for presentation and testing
     */
    public function switchRole(Request $request, string $role): RedirectResponse
    {
        $targetUser = match ($role) {
            'student' => User::where('email', 'student@snru.ac.th')->first(),
            'instructor' => User::where('email', 'instructor@snru.ac.th')->first(),
            'chair' => User::where('email', 'chair@snru.ac.th')->first(),
            'admin' => User::where('email', 'admin@snru.ac.th')->first(),
            default => null,
        };

        if ($targetUser) {
            Auth::login($targetUser);
            $request->session()->regenerate();
            return redirect()->route('dashboard')->with('success', 'สลับบทบาทเป็น: ' . $targetUser->role?->label);
        }

        return back()->with('error', 'ไม่พบบทบาทที่ต้องการ');
    }
}
