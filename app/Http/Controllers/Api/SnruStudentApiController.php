<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SnruStudent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SnruStudentApiController extends Controller
{
    /**
     * GET /api/snru/students
     * Query and search SNRU students with filters: q, faculty, major, year, student_id, limit, page
     */
    public function index(Request $request): JsonResponse
    {
        $page = max(1, (int) $request->query('page', 1));
        $limit = min(100, max(1, (int) $request->query('limit', 20)));
        $offset = ($page - 1) * $limit;

        $studentId = trim((string) $request->query('student_id', ''));
        $faculty = trim((string) $request->query('faculty', ''));
        $major = trim((string) $request->query('major', ''));
        $year = (int) $request->query('year', 0);
        $q = trim((string) $request->query('q', ''));

        $query = SnruStudent::query();

        if ($studentId !== '') {
            $query->where('student_id', $studentId);
        }

        if ($faculty !== '') {
            $query->where('faculty', 'like', "%{$faculty}%");
        }

        if ($major !== '') {
            $query->where('major', 'like', "%{$major}%");
        }

        if ($year > 0) {
            $query->where('year_level', $year);
        }

        if ($q !== '') {
            $query->where(function ($sub) use ($q) {
                $sub->where('student_id', 'like', "%{$q}%")
                    ->orWhere('full_name', 'like', "%{$q}%")
                    ->orWhere('faculty', 'like', "%{$q}%")
                    ->orWhere('major', 'like', "%{$q}%");
            });
        }

        $total = $query->count();
        $students = $query->orderBy('student_id', 'asc')
            ->skip($offset)
            ->take($limit)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $students,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'total_pages' => $limit > 0 ? (int) ceil($total / $limit) : 0,
            ],
        ]);
    }

    /**
     * GET /api/snru/student/{id}
     * Lookup student by student_id
     */
    public function show(Request $request, string $id = null): JsonResponse
    {
        $searchId = $id ?: $request->query('id');

        if (!$searchId) {
            return response()->json([
                'success' => false,
                'message' => 'Missing required parameter: id or student_id',
            ], 400);
        }

        $student = SnruStudent::where('student_id', $searchId)
            ->orWhere('id', $searchId)
            ->first();

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Student not found in SNRU Database',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $student,
        ]);
    }

    /**
     * GET /api/snru/faculties
     */
    public function faculties(): JsonResponse
    {
        $faculties = SnruStudent::distinct()
            ->whereNotNull('faculty')
            ->where('faculty', '<>', '')
            ->orderBy('faculty')
            ->pluck('faculty');

        return response()->json([
            'success' => true,
            'data' => $faculties,
        ]);
    }

    /**
     * GET /api/snru/majors
     */
    public function majors(Request $request): JsonResponse
    {
        $faculty = trim((string) $request->query('faculty', ''));
        $query = SnruStudent::distinct()->whereNotNull('major')->where('major', '<>', '');

        if ($faculty !== '') {
            $query->where('faculty', 'like', "%{$faculty}%");
        }

        $majors = $query->orderBy('major')->pluck('major');

        return response()->json([
            'success' => true,
            'data' => $majors,
        ]);
    }
}
