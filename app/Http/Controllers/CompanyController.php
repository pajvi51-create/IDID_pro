<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $province = $request->input('province');
        $hasAllowance = $request->boolean('has_allowance');

        $query = Company::query()->where('is_active', true);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('business_type', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($province) {
            $query->where('province', $province);
        }

        if ($hasAllowance) {
            $query->where('has_allowance', true);
        }

        $companies = $query->orderBy('is_partner', 'desc')
            ->orderBy('name', 'asc')
            ->paginate(12)
            ->withQueryString();

        $provinces = Company::whereNotNull('province')
            ->distinct()
            ->pluck('province');

        return Inertia::render('Companies/Index', [
            'companies' => $companies,
            'provinces' => $provinces,
            'filters' => $request->only(['search', 'province', 'has_allowance']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        if (!$user->isAdmin()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'business_type' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'contact_person' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email'],
            'phone' => ['nullable', 'string'],
            'website' => ['nullable', 'url'],
            'address' => ['nullable', 'string'],
            'province' => ['nullable', 'string'],
            'max_trainees' => ['required', 'integer', 'min:1'],
            'has_allowance' => ['boolean'],
            'allowance_amount' => ['nullable', 'numeric'],
            'is_partner' => ['boolean'],
        ]);

        Company::create($validated);

        return back()->with('success', 'เพิ่มสถานประกอบการเรียบร้อยแล้ว');
    }

    public function update(Request $request, Company $company): RedirectResponse
    {
        $user = $request->user();
        if (!$user->isAdmin()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'business_type' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'contact_person' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email'],
            'phone' => ['nullable', 'string'],
            'website' => ['nullable', 'url'],
            'address' => ['nullable', 'string'],
            'province' => ['nullable', 'string'],
            'max_trainees' => ['required', 'integer', 'min:1'],
            'has_allowance' => ['boolean'],
            'allowance_amount' => ['nullable', 'numeric'],
            'is_partner' => ['boolean'],
        ]);

        $company->update($validated);

        return back()->with('success', 'อัปเดตข้อมูลสถานประกอบการเรียบร้อยแล้ว');
    }

    public function destroy(Request $request, Company $company): RedirectResponse
    {
        $user = $request->user();
        if (!$user->isAdmin()) {
            abort(403);
        }

        $company->update(['is_active' => false]);

        return back()->with('success', 'ยกเลิกสถานะสถานประกอบการเรียบร้อยแล้ว');
    }
}
