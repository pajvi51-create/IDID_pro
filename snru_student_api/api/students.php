<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

$page = max(1, (int)($_GET['page'] ?? 1));
$limit = min(100, max(1, (int)($_GET['limit'] ?? 20)));
$offset = ($page - 1) * $limit;

$studentId = trim((string)($_GET['student_id'] ?? ''));
$faculty   = trim((string)($_GET['faculty'] ?? ''));
$major     = trim((string)($_GET['major'] ?? ''));
$year      = (int)($_GET['year'] ?? 0);
$q         = trim((string)($_GET['q'] ?? ''));

$where = [];
$params = [];

if ($studentId !== '') {
    $where[] = 'student_id = :student_id';
    $params[':student_id'] = $studentId;
}

if ($faculty !== '') {
    $where[] = 'faculty LIKE :faculty';
    $params[':faculty'] = "%{$faculty}%";
}

if ($major !== '') {
    $where[] = 'major LIKE :major';
    $params[':major'] = "%{$major}%";
}

if ($year > 0) {
    $where[] = 'year_level = :year_level';
    $params[':year_level'] = $year;
}

if ($q !== '') {
    $where[] = '(student_id LIKE :q OR full_name LIKE :q OR faculty LIKE :q OR major LIKE :q)';
    $params[':q'] = "%{$q}%";
}

$whereSql = $where ? ' WHERE ' . implode(' AND ', $where) : '';

$countStmt = $pdo->prepare("SELECT COUNT(*) FROM students{$whereSql}");
$countStmt->execute($params);
$total = (int)$countStmt->fetchColumn();

$sql = "SELECT id, student_id, full_name, faculty, major, year_level, status
        FROM students{$whereSql}
        ORDER BY student_id ASC
        LIMIT :limit OFFSET :offset";

$stmt = $pdo->prepare($sql);

foreach ($params as $key => $value) {
    $stmt->bindValue($key, $value);
}
$stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();

$data = $stmt->fetchAll();

jsonResponse([
    'success' => true,
    'data' => $data,
    'pagination' => [
        'page' => $page,
        'limit' => $limit,
        'total' => $total,
        'total_pages' => $limit > 0 ? (int)ceil($total / $limit) : 0
    ]
]);
