<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/response.php';

$faculty = trim((string)($_GET['faculty'] ?? ''));

if ($faculty !== '') {
    $stmt = $pdo->prepare(
        'SELECT DISTINCT major
         FROM students
         WHERE faculty LIKE :faculty AND major <> ""
         ORDER BY major'
    );
    $stmt->execute([':faculty' => "%{$faculty}%"]);
} else {
    $stmt = $pdo->query(
        'SELECT DISTINCT major
         FROM students
         WHERE major <> ""
         ORDER BY major'
    );
}

jsonResponse([
    'success' => true,
    'data' => $stmt->fetchAll()
]);
