<?php
header('Content-Type: text/html; charset=utf-8');
?>
<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SNRU Student API</title>
<style>
body{font-family:Arial,sans-serif;max-width:900px;margin:40px auto;padding:0 20px;line-height:1.6}
code{background:#f2f2f2;padding:3px 6px;border-radius:4px}
pre{background:#111;color:#eee;padding:16px;border-radius:8px;overflow:auto}
h1{margin-bottom:5px}
</style>
</head>
<body>
<h1>SNRU Student API</h1>
<p>PHP + MySQL REST API สำหรับโปรเจกต์ตัวอย่าง</p>

<h2>Endpoints</h2>
<ul>
<li><code>GET /api/students.php</code> — รายการนักศึกษา</li>
<li><code>GET /api/students.php?q=คำค้น</code> — ค้นหา</li>
<li><code>GET /api/students.php?faculty=ชื่อคณะ</code> — กรองคณะ</li>
<li><code>GET /api/students.php?major=ชื่อสาขา</code> — กรองสาขา</li>
<li><code>GET /api/students.php?year=1</code> — กรองชั้นปี</li>
<li><code>GET /api/student.php?id=รหัสนักศึกษา</code> — ดูข้อมูลรายบุคคล</li>
<li><code>GET /api/faculties.php</code> — รายชื่อคณะ</li>
<li><code>GET /api/majors.php</code> — รายชื่อสาขา</li>
</ul>

<h2>ตัวอย่าง</h2>
<pre>http://localhost/snru-student-api/api/students.php?limit=20
http://localhost/snru-student-api/api/students.php?faculty=วิทยาศาสตร์
http://localhost/snru-student-api/api/students.php?q=ตัวอย่าง
http://localhost/snru-student-api/api/student.php?id=671000001</pre>

<p><strong>หมายเหตุ:</strong> ข้อมูลในฐานข้อมูลเป็นข้อมูลตัวอย่าง ไม่ใช่ข้อมูลจริงของนักศึกษา SNRU</p>
</body>
</html>
