CREATE DATABASE IF NOT EXISTS snru_students
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE snru_students;

CREATE TABLE IF NOT EXISTS students (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    faculty VARCHAR(255) NOT NULL,
    major VARCHAR(255) NOT NULL,
    year_level TINYINT UNSIGNED NOT NULL,
    status ENUM('active','inactive','graduated') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_faculty (faculty),
    INDEX idx_major (major),
    INDEX idx_year_level (year_level),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO students
(student_id, full_name, faculty, major, year_level, status)
VALUES
('671000001','นายตัวอย่าง หนึ่ง','คณะวิทยาศาสตร์และเทคโนโลยี','เทคโนโลยีคอมพิวเตอร์และดิจิทัล',2,'active'),
('671000002','นางสาวตัวอย่าง สอง','คณะวิทยาศาสตร์และเทคโนโลยี','เทคโนโลยีคอมพิวเตอร์และดิจิทัล',2,'active'),
('681000001','นายตัวอย่าง สาม','คณะวิทยาศาสตร์และเทคโนโลยี','วิทยาการข้อมูล',1,'active'),
('661000001','นางสาวตัวอย่าง สี่','คณะมนุษยศาสตร์และสังคมศาสตร์','ภาษาอังกฤษ',4,'active'),
('651000001','นายตัวอย่าง ห้า','คณะวิทยาการจัดการ','บริหารธุรกิจ',4,'graduated');
