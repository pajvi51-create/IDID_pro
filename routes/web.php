<?php

use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\ApprovalController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DailyLogController;
use App\Http\Controllers\ResourceController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Guest Routes
Route::middleware('guest')->group(function () {
    Route::get('/', fn() => redirect()->route('login'));
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

// Authenticated Routes
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::post('/switch-role/{role}', [AuthController::class, 'switchRole'])->name('switch-role');

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Applications (Student submission & tracking)
    Route::get('/applications', [ApplicationController::class, 'index'])->name('applications.index');
    Route::get('/applications/create', [ApplicationController::class, 'create'])->name('applications.create');
    Route::post('/applications', [ApplicationController::class, 'store'])->name('applications.store');
    Route::get('/applications/{application}', [ApplicationController::class, 'show'])->name('applications.show');
    Route::get('/applications/{application}/edit', [ApplicationController::class, 'edit'])->name('applications.edit');
    Route::post('/applications/{application}', [ApplicationController::class, 'update'])->name('applications.update');
    Route::post('/applications/{application}/submit', [ApplicationController::class, 'submit'])->name('applications.submit');

    // Approvals (2-tier Review Workflow)
    Route::get('/approvals', [ApprovalController::class, 'index'])
        ->middleware('role:instructor,chair,admin')
        ->name('approvals.index');
    Route::post('/approvals/{application}/stage1', [ApprovalController::class, 'reviewStage1'])
        ->middleware('role:instructor,admin')
        ->name('approvals.stage1');
    Route::post('/approvals/{application}/stage2', [ApprovalController::class, 'reviewStage2'])
        ->middleware('role:chair,admin')
        ->name('approvals.stage2');

    // Companies / Workplace Directory
    Route::get('/companies', [CompanyController::class, 'index'])->name('companies.index');
    Route::post('/companies', [CompanyController::class, 'store'])->name('companies.store');
    Route::put('/companies/{company}', [CompanyController::class, 'update'])->name('companies.update');
    Route::delete('/companies/{company}', [CompanyController::class, 'destroy'])->name('companies.destroy');

    // Resources, Forms & Guidelines
    Route::get('/guidelines', [ResourceController::class, 'guidelines'])->name('resources.guidelines');
    Route::get('/forms', [ResourceController::class, 'forms'])->name('resources.forms');
    Route::get('/forms/{form}/download', [ResourceController::class, 'downloadForm'])->name('resources.forms.download');
    Route::get('/timeline', [ResourceController::class, 'timeline'])->name('resources.timeline');

    // Daily Logbook & Supervision (บันทึกประจำวันและติดตามการนิเทศก์งาน)
    Route::get('/logbook', [DailyLogController::class, 'index'])->name('logbook.index');
    Route::post('/logbook', [DailyLogController::class, 'store'])->name('logbook.store');
    Route::put('/logbook/{dailyLog}', [DailyLogController::class, 'update'])->name('logbook.update');
    Route::delete('/logbook/{dailyLog}', [DailyLogController::class, 'destroy'])->name('logbook.destroy');
    Route::post('/logbook/{dailyLog}/verify', [DailyLogController::class, 'verify'])
        ->middleware('role:instructor,chair,admin')
        ->name('logbook.verify');
});
