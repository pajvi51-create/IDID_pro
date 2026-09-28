<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/response.php';

$stmt = $pdo->query(
    'SELECT DISTINCT faculty
     FROM students
     WHERE faculty <> ""
     ORDER BY faculty'
);

jsonResponse([
    'success' => true,
    'data' => $stmt->fetchAll()
]);
