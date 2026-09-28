# SNRU Student API — PHP + MySQL

โปรเจกต์ REST API ตัวอย่างสำหรับระบบข้อมูลนักศึกษา ใช้ PHP + MySQL และรันบน XAMPP ได้

> ฐานข้อมูลในโปรเจกต์นี้มีเฉพาะข้อมูลตัวอย่าง ห้ามนำไปตีความว่าเป็นข้อมูลจริงของ SNRU

## 1. ติดตั้ง XAMPP

ติดตั้ง XAMPP แล้วเปิด:
- Apache
- MySQL

## 2. วางโปรเจกต์

คัดลอกโฟลเดอร์ `snru-student-api` ไปไว้ที่:

C:\xampp\htdocs\snru-student-api

## 3. สร้างฐานข้อมูล

เปิด:

http://localhost/phpmyadmin

เลือกแท็บ SQL แล้วนำเนื้อหาจาก `database.sql` ไป Execute

## 4. ตั้งค่าฐานข้อมูล

ไฟล์:

config/database.php

ค่าพื้นฐานของ XAMPP:

host = localhost
database = snru_students
user = root
password = ''

ถ้าคุณตั้งรหัสผ่าน MySQL ให้แก้ `$pass`

## 5. ทดสอบ API

เปิด:

http://localhost/snru-student-api/api/students.php

ตัวอย่าง:

http://localhost/snru-student-api/api/students.php?limit=2

ค้นหา:

http://localhost/snru-student-api/api/students.php?q=ตัวอย่าง

กรองคณะ:

http://localhost/snru-student-api/api/students.php?faculty=วิทยาศาสตร์

ดูรายบุคคล:

http://localhost/snru-student-api/api/student.php?id=671000001

## 6. Response

ตัวอย่าง:

{
  "success": true,
  "data": [
    {
      "id": 1,
      "student_id": "671000001",
      "full_name": "นายตัวอย่าง หนึ่ง",
      "faculty": "คณะวิทยาศาสตร์และเทคโนโลยี",
      "major": "เทคโนโลยีคอมพิวเตอร์และดิจิทัล",
      "year_level": 2,
      "status": "active"
    }
  ]
}

## 7. นำไปใช้กับ JavaScript

fetch('http://localhost/snru-student-api/api/students.php')
  .then(response => response.json())
  .then(result => {
      console.log(result.data);
  });

## หมายเหตุด้านข้อมูลส่วนบุคคล

ก่อนเชื่อมต่อกับข้อมูลจริงของมหาวิทยาลัย ควรได้รับอนุญาตจากหน่วยงานเจ้าของข้อมูล และกำหนดสิทธิ์การเข้าถึงข้อมูลตามวัตถุประสงค์การใช้งาน
