<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

$id = trim((string)($_GET['id'] ?? ''));

if ($id === '') {
    jsonResponse([
        'success' => false,
        'message' => 'Missing required parameter: id'
    ], 400);
}

$stmt = $pdo->prepare(
    'SELECT id, student_id, full_name, faculty, major, year_level, status
     FROM students
     WHERE student_id = :student_id
     LIMIT 1'
);
$stmt->execute([':student_id' => $id]);
$student = $stmt->fetch();

if (!$student) {
    jsonResponse([
        'success' => false,
        'message' => 'Student not found'
    ], 404);
}

jsonResponse([
    'success' => true,
    'data' => $student
]);
