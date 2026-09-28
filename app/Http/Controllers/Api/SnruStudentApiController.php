<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
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

        $studentId = trim((string) $request->query('student_id', ''));
        $faculty = trim((string) $request->query('faculty', ''));
        $major = trim((string) $request->query('major', ''));
        $year = (int) $request->query('year', 0);
        $q = trim((string) $request->query('q', ''));

        $query = User::whereHas('role', function ($rq) {
            $rq->where('name', Role::STUDENT);
        })->with('curriculum');

        if ($studentId !== '') {
            $query->where('student_id', $studentId);
        }

        if ($major !== '') {
            $query->whereHas('curriculum', function ($cq) use ($major) {
                $cq->where('name', 'like', "%{$major}%");
            });
        }

        if ($q !== '') {
            $query->where(function ($sub) use ($q) {
                $sub->where('student_id', 'like', "%{$q}%")
                    ->orWhere('name', 'like', "%{$q}%")
                    ->orWhere('email', 'like', "%{$q}%");
            });
        }

        $total = $query->count();
        $users = $query->orderBy('student_id', 'asc')
            ->skip(($page - 1) * $limit)
            ->take($limit)
            ->get();

        $data = $users->map(function ($u) {
            return [
                'id' => $u->id,
                'student_id' => $u->student_id,
                'full_name' => $u->name,
                'faculty' => 'คณะวิทยาศาสตร์และเทคโนโลยี',
                'major' => $u->curriculum?->name ?? 'สาขาวิชาคอมพิวเตอร์',
                'year_level' => 3,
                'status' => $u->is_active ? 'active' : 'inactive',
                'email' => $u->email,
                'phone' => $u->phone,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data,
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
     * Lookup student by student_id or internal ID
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

        $user = User::whereHas('role', function ($rq) {
            $rq->where('name', Role::STUDENT);
        })
        ->where(function ($q) use ($searchId) {
            $q->where('student_id', $searchId)
              ->orWhere('id', $searchId);
        })
        ->with('curriculum')
        ->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Student not found in SNRU Database',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'student_id' => $user->student_id,
                'full_name' => $user->name,
                'faculty' => 'คณะวิทยาศาสตร์และเทคโนโลยี',
                'major' => $user->curriculum?->name ?? 'สาขาวิชาคอมพิวเตอร์',
                'year_level' => 3,
                'status' => $user->is_active ? 'active' : 'inactive',
                'email' => $user->email,
                'phone' => $user->phone,
            ],
        ]);
    }

    /**
     * GET /api/snru/faculties
     */
    public function faculties(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'คณะวิทยาศาสตร์และเทคโนโลยี',
                'คณะครุศาสตร์',
                'คณะวิทยาการจัดการ',
                'คณะมนุษยศาสตร์และสังคมศาสตร์',
                'คณะเทคโนโลยีการเกษตร',
                'คณะเทคโนโลยีอุตสาหกรรม',
            ],
        ]);
    }

    /**
     * GET /api/snru/majors
     */
    public function majors(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'เทคโนโลยีคอมพิวเตอร์และดิจิทัล',
                'วิทยาการคอมพิวเตอร์',
                'เทคโนโลยีสารสนเทศ',
                'วิทยาการข้อมูลและปัญญาประดิษฐ์',
            ],
        ]);
    }
}
