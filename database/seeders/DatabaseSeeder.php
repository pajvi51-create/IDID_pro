<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\ApplicationDocument;
use App\Models\ApprovalLog;
use App\Models\Company;
use App\Models\Curriculum;
use App\Models\DailyLog;
use App\Models\DownloadableForm;
use App\Models\Guideline;
use App\Models\Role;
use App\Models\SnruStudent;
use App\Models\Timeline;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Roles
        $studentRole = Role::firstOrCreate(['name' => Role::STUDENT], [
            'label' => 'นักศึกษาชั้นปีที่ 3',
            'description' => 'นักศึกษาสาขาวิชาคอมพิวเตอร์ที่ลงทะเบียนเตรียมฝึกประสบการณ์วิชาชีพ',
        ]);

        $instructorRole = Role::firstOrCreate(['name' => Role::INSTRUCTOR], [
            'label' => 'อาจารย์ผู้รับผิดชอบรายวิชา',
            'description' => 'อาจารย์ผู้ตรวจสอบคำขอและเอกสารในลำดับขั้นที่ 1',
        ]);

        $chairRole = Role::firstOrCreate(['name' => Role::CHAIR], [
            'label' => 'ประธานหลักสูตร',
            'description' => 'ประธานหลักสูตรผู้พิจารณาอนุมัติคำขอในลำดับขั้นสุดท้าย',
        ]);

        $adminRole = Role::firstOrCreate(['name' => Role::ADMIN], [
            'label' => 'ผู้ดูแลระบบ',
            'description' => 'ผู้ดูแลระบบและจัดการข้อมูลกลางทั้งหมด',
        ]);

        // 2. Curriculums (ข้อมูลหลักสูตรจริงจาก com.snru.ac.th)
        $currCDT = Curriculum::firstOrCreate(['code' => 'CDT-2563'], [
            'name' => 'เทคโนโลยีคอมพิวเตอร์และดิจิทัล ฉบับปรับปรุง พ.ศ. 2563',
            'degree' => 'วท.บ. (เทคโนโลยีคอมพิวเตอร์และดิจิทัล)',
            'department' => 'สาขาวิชาคอมพิวเตอร์',
            'faculty' => 'คณะวิทยาศาสตร์และเทคโนโลยี',
            'is_active' => true,
        ]);

        $currCS = Curriculum::firstOrCreate(['code' => 'CS-2569'], [
            'name' => 'วิทยาการคอมพิวเตอร์ ฉบับปรับปรุง ปี 2569 (และ 2564)',
            'degree' => 'วท.บ. (วิทยาการคอมพิวเตอร์)',
            'department' => 'สาขาวิชาคอมพิวเตอร์',
            'faculty' => 'คณะวิทยาศาสตร์และเทคโนโลยี',
            'is_active' => true,
        ]);

        $currIT = Curriculum::firstOrCreate(['code' => 'IT-2568'], [
            'name' => 'เทคโนโลยีสารสนเทศ ฉบับปรับปรุง พ.ศ. 2568',
            'degree' => 'วท.บ. (เทคโนโลยีสารสนเทศ)',
            'department' => 'สาขาวิชาคอมพิวเตอร์',
            'faculty' => 'คณะวิทยาศาสตร์และเทคโนโลยี',
            'is_active' => true,
        ]);

        // 3. Demo Users (บุคลากรจริงจาก com.snru.ac.th/บุคลากร)
        $admin = User::firstOrCreate(['email' => 'admin@snru.ac.th'], [
            'name' => 'ผู้ดูแลระบบ สาขาวิชาคอมพิวเตอร์ มรภ.สกลนคร',
            'password' => Hash::make('password123'),
            'role_id' => $adminRole->id,
            'phone' => '042-772391',
            'is_active' => true,
        ]);

        $instructor = User::firstOrCreate(['email' => 'instructor@snru.ac.th'], [
            'name' => 'อาจารย์ ดร.ชายแดน มิ่งเมือง (อาจารย์ผู้รับผิดชอบรายวิชา)',
            'password' => Hash::make('password123'),
            'role_id' => $instructorRole->id,
            'curriculum_id' => $currCDT->id,
            'phone' => '081-234-5678',
            'is_active' => true,
        ]);

        $chair = User::firstOrCreate(['email' => 'chair@snru.ac.th'], [
            'name' => 'อาจารย์ ดร.ชัยนันท์ สมพงษ์ (ประธานสาขาวิชาและประธานหลักสูตร)',
            'password' => Hash::make('password123'),
            'role_id' => $chairRole->id,
            'curriculum_id' => $currCDT->id,
            'phone' => '089-876-5432',
            'is_active' => true,
        ]);

        $student = User::firstOrCreate(['email' => 'student@snru.ac.th'], [
            'name' => 'นางสาว ปาจรีย์ สุคนธชาติ (ผู้เสนอโครงงาน)',
            'student_id' => '67102122131',
            'password' => Hash::make('password123'),
            'role_id' => $studentRole->id,
            'curriculum_id' => $currCDT->id,
            'academic_year' => 'ชั้นปีที่ 3',
            'phone' => '095-123-4567',
            'is_active' => true,
        ]);

        $student2 = User::firstOrCreate(['email' => 'student2@snru.ac.th'], [
            'name' => 'นาย ณัฐวุฒิ พัฒนาการ',
            'student_id' => '67102122145',
            'password' => Hash::make('password123'),
            'role_id' => $studentRole->id,
            'curriculum_id' => $currCS->id,
            'academic_year' => 'ชั้นปีที่ 3',
            'phone' => '092-987-6543',
            'is_active' => true,
        ]);

        // 4. Partner Companies & MOU Partners (ข้อมูลจริงจาก com.snru.ac.th)
        $compMOU1 = Company::firstOrCreate(['name' => 'หอการค้าจังหวัดสกลนคร (MOU ความร่วมมือ)'], [
            'business_type' => 'Business & IT Development Support',
            'description' => 'หน่วยงานเครือข่ายความร่วมมือทางวิชาการ (MOU) สนับสนุนการฝึกงานและการพัฒนาเทคโนโลยีดิจิทัลสำหรับธุรกิจในจังหวัดสกลนคร',
            'contact_person' => 'ฝ่ายประสานงานความร่วมมือทางวิชาการ',
            'email' => 'chamber-sn@snru-network.org',
            'phone' => '042-711-234',
            'website' => 'https://com.snru.ac.th',
            'address' => 'อำเภอเมือง จังหวัดสกลนคร',
            'province' => 'สกลนคร',
            'max_trainees' => 4,
            'has_allowance' => false,
            'is_partner' => true,
            'is_active' => true,
        ]);

        $compMOU2 = Company::firstOrCreate(['name' => 'สมาคมปัญญาประดิษฐ์ (MOU เครือข่าย AI)'], [
            'business_type' => 'AI, Data Science & Machine Learning',
            'description' => 'เครือข่ายความร่วมมือด้านเทคโนโลยีปัญญาประดิษฐ์ (AI Literacy Ready ASEAN ร่วมกับ Google)',
            'contact_person' => 'ฝ่ายพัฒนาทักษะวิชาชีพไอที',
            'email' => 'contact@ai-network.or.th',
            'phone' => '02-555-8899',
            'website' => 'https://com.snru.ac.th',
            'address' => 'กรุงเทพมหานคร และศูนย์ความร่วมมือ มรภ.สกลนคร',
            'province' => 'กรุงเทพมหานคร',
            'max_trainees' => 3,
            'has_allowance' => true,
            'allowance_amount' => 400.00,
            'is_partner' => true,
            'is_active' => true,
        ]);

        $comp1 = Company::firstOrCreate(['name' => 'บริษัท วัน โค้ด โซลูชั่น จำกัด (One Code Solutions)'], [
            'business_type' => 'Software House & Web Development',
            'description' => 'พัฒนาเว็บแอปพลิเคชัน โมบายแอปพลิเคชัน และระบบคลาวด์สำหรับองค์กรด้วย Laravel, React และ Next.js',
            'contact_person' => 'คุณกิตติศักดิ์ พัฒนกิจ (HR Manager)',
            'email' => 'hr@onecode.co.th',
            'phone' => '02-123-4567',
            'website' => 'https://example.com/onecode',
            'address' => 'อาคารซอฟต์แวร์พาร์ค ชั้น 12 ถนนแจ้งวัฒนะ ตำบลคลองเกลือ อำเภอปากเกร็ด นนทบุรี',
            'province' => 'นนทบุรี',
            'max_trainees' => 4,
            'has_allowance' => true,
            'allowance_amount' => 350.00,
            'is_partner' => true,
            'is_active' => true,
        ]);

        $comp2 = Company::firstOrCreate(['name' => 'ศูนย์เทคโนโลยีดิจิทัลและสารสนเทศ มหาวิทยาลัยราชภัฏสกลนคร'], [
            'business_type' => 'Network & System Infrastructure',
            'description' => 'ดูแลระบบเครือข่าย อินเทอร์เน็ต เซิร์ฟเวอร์ และระบบงานสารสนเทศของมหาวิทยาลัยราชภัฏสกลนคร',
            'contact_person' => 'นายสมชาย วิศวกรไอที (หัวหน้างานระบบ)',
            'email' => 'tech-center@snru.ac.th',
            'phone' => '042-772392',
            'website' => 'https://its.snru.ac.th',
            'address' => '680 ถนนนิตโย ตำบลธาตุเชิงชุม อำเภอเมือง สกลนคร',
            'province' => 'สกลนคร',
            'max_trainees' => 3,
            'has_allowance' => false,
            'is_partner' => true,
            'is_active' => true,
        ]);

        // 5. Official Downloadable Forms (ดึงไฟล์จริงจาก com.snru.ac.th)
        DownloadableForm::truncate();

        DownloadableForm::create([
            'title' => 'แบบฟอร์มประวัตินักศึกษาฝึกประสบการณ์วิชาชีพคอมพิวเตอร์',
            'description' => 'เอกสารทางการของสาขาวิชาคอมพิวเตอร์ มรภ.สกลนคร สำหรับนักศึกษาที่ผ่านการพิจารณาใช้กรอกประวัติส่งสาขาวิชา',
            'file_name' => 'Form_Student_Profile.docx',
            'file_path' => 'forms/Form_Student_Profile.docx',
            'file_extension' => 'docx',
            'file_size' => 55286,
            'download_count' => 128,
            'is_active' => true,
        ]);

        DownloadableForm::create([
            'title' => 'ขั้นตอนการเสนอและปฎิทินการฝึกประสบการณ์วิชาชีพคอมพิวเตอร์ (หลักสูตรเทคโนโลยีคอมพิวเตอร์และดิจิทัล)',
            'description' => 'ประกาศทางการเรื่องขั้นตอนและกำหนดการยื่นขออนุมัติสถานที่ฝึกงานประจำปีการศึกษา',
            'file_name' => 'Internship_Digital_Tech_67.pdf',
            'file_path' => 'forms/Internship_Digital_Tech_67.pdf',
            'file_extension' => 'pdf',
            'file_size' => 77739,
            'download_count' => 95,
            'is_active' => true,
        ]);

        DownloadableForm::create([
            'title' => 'ขั้นตอนการเสนอที่ฝึกประสบการณ์วิชาชีพคอมพิวเตอร์ สาขาวิชาคอมพิวเตอร์',
            'description' => 'แผนผังขั้นตอนการปฏิบัติ ตั้งแต่การสำรวจสถานที่ฝึกงาน การยื่นผ่านระบบ และการออกหนังสือส่งตัว',
            'file_name' => 'Internship_Submission_Procedure.pdf',
            'file_path' => 'forms/Internship_Submission_Procedure.pdf',
            'file_extension' => 'pdf',
            'file_size' => 91543,
            'download_count' => 84,
            'is_active' => true,
        ]);

        DownloadableForm::create([
            'title' => 'เอกสารหมายเลข 1 แบบฟอร์มเค้าโครงโครงงาน (คง.ค 1)',
            'description' => 'แบบฟอร์มเสนอเค้าโครงโครงงานด้านเทคโนโลยีคอมพิวเตอร์และดิจิทัล / เตรียมฝึกประสบการณ์วิชาชีพ',
            'file_name' => 'Form_CP01_Outline.pdf',
            'file_path' => 'forms/Form_CP01_Outline.pdf',
            'file_extension' => 'pdf',
            'file_size' => 114360,
            'download_count' => 142,
            'is_active' => true,
        ]);

        DownloadableForm::create([
            'title' => 'แบบขอเสนอสอบหัวข้อโครงงานคอมพิวเตอร์ 1 (คง.ค. 2)',
            'description' => 'แบบคำขอแต่งตั้งคณะกรรมการและขอเสนอสอบหัวข้อโครงงานคอมพิวเตอร์',
            'file_name' => 'Form_CP02_Topic_Proposal.pdf',
            'file_path' => 'forms/Form_CP02_Topic_Proposal.pdf',
            'file_extension' => 'pdf',
            'file_size' => 83769,
            'download_count' => 76,
            'is_active' => true,
        ]);

        DownloadableForm::create([
            'title' => 'แบบคำขอทั่วไป สาขาวิชาคอมพิวเตอร์ (คง.ค.-6)',
            'description' => 'แบบฟอร์มคำขอทั่วไปสำหรับการประสานงาน ติดต่ออาจารย์ และงานเอกสารภายในสาขาวิชา',
            'file_name' => 'Form_General_Request_CP06.docx',
            'file_path' => 'forms/Form_General_Request_CP06.docx',
            'file_extension' => 'docx',
            'file_size' => 27941,
            'download_count' => 61,
            'is_active' => true,
        ]);

        DownloadableForm::create([
            'title' => 'คู่มือโครงงานคอมพิวเตอร์และการเตรียมตัวฝึกงาน ฉบับสมบูรณ์',
            'description' => 'คู่มือมาตรฐานการวิจัยระดับปริญญาตรี รูปเล่ม การเขียนรายงาน และแนวทางการฝึกงาน สาขาวิชาคอมพิวเตอร์ มรภ.สกลนคร',
            'file_name' => 'Handbook_Computer_Project.pdf',
            'file_path' => 'forms/Handbook_Computer_Project.pdf',
            'file_extension' => 'pdf',
            'file_size' => 1029745,
            'download_count' => 210,
            'is_active' => true,
        ]);

        // 6. Guidelines (ข้อมูลจริงจาก com.snru.ac.th)
        Guideline::truncate();

        Guideline::create([
            'category' => 'resume',
            'title' => 'แนวทางการจัดทำ Resume และทักษะวิชาชีพคอมพิวเตอร์',
            'summary' => 'เคล็ดลับการนำเสนอทักษะทางเทคนิค Tech Stack (เช่น Laravel, Node.js, RESTful API, AI) และโปรเจกต์',
            'content' => "### คำแนะนำการทำ Resume สำหรับนักศึกษาสาขาวิชาคอมพิวเตอร์ มรภ.สกลนคร\n\n1. **Technical Stack:** ระบุเครื่องมือและภาษาที่สอดคล้องกับหลักสูตร เช่น PHP/Laravel, JavaScript/React, Python, RESTful API และระบบฐานข้อมูล MySQL\n2. **Academic & Classroom Projects:** ระบุผลงานจากรายวิชาโครงงาน หรือโปรเจกต์สัมมนา พร้อมลิงก์ GitHub และตัวอย่างระบบ\n3. **กิจกรรมและเวิร์กช็อป:** ระบุการเข้าร่วมอบรมเสริมศักยภาพ เช่น โครงการ Full-Stack Development, อบรม AI Literacy หรือ Cybersecurity ที่สาขาวิชาจัดขึ้น",
            'icon' => 'file-text',
            'is_published' => true,
        ]);

        Guideline::create([
            'category' => 'qualification',
            'title' => 'เกณฑ์และคุณสมบัติการลงทะเบียนเตรียมฝึกประสบการณ์วิชาชีพ (มรภ.สกลนคร)',
            'summary' => 'ข้อกำหนดการสอบผ่านรายวิชาแกน ชั้นปีที่ 3 และเงื่อนไขการเสนอสถานที่ฝึกงาน',
            'content' => "### ขั้นตอนและคุณสมบัติของนักศึกษา\n\n1. เป็นนักศึกษาสาขาวิชาคอมพิวเตอร์ ชั้นปีที่ 3 ที่มีผลการเรียนตามเกณฑ์หลักสูตร\n2. ศึกษาคุณสมบัติและค้นหาสถานประกอบการที่เกี่ยวข้องกับงานสายคอมพิวเตอร์ ซอฟต์แวร์ หรือเครือข่าย\n3. ยื่นข้อมูลสถานที่ฝึกงานและอัปโหลดเอกสารผ่านระบบออนไลน์ตามลำดับขั้นตอน\n4. ผ่านการตรวจสอบจากอาจารย์ผู้รับผิดชอบรายวิชา (ขั้นที่ 1) และการอนุมัติจากประธานหลักสูตร (ขั้นที่ 2)\n5. เข้าร่วมกิจกรรมปฐมนิเทศก่อนออกฝึกประสบการณ์วิชาชีพตามปฏิทินที่สาขาวิชากำหนด",
            'icon' => 'check-circle',
            'is_published' => true,
        ]);

        Guideline::create([
            'category' => 'portfolio',
            'title' => 'การเตรียมความพร้อมก่อนออกฝึก “Reboot ยังไง… ก่อนออกฝึก”',
            'summary' => 'แนวทางการเตรียมตัวด้านมารยาท วัฒนธรรมองค์กร และการนำเสนอ Portfolio ในวันสัมภาษณ์งาน',
            'content' => "### การเตรียมความพร้อมทางวิชาชีพ\n\n- ตรวจสอบความถูกต้องของข้อมูลในแบบฟอร์มประวัติส่วนตัว\n- จัดเตรียมผลงานโปรเจกต์ในรูปแบบดิจิทัล (GitHub Repository / Live Demo Link)\n- ศึกษาข้อมูลองค์กรและตำแหน่งงานที่ขอรับการฝึกงานล่วงหน้า\n- ปฏิบัติตนตามระเบียบวินัยและข้อบังคับของมหาวิทยาลัยราชภัฏสกลนครและหน่วยงานอย่างเคร่งครัด",
            'icon' => 'briefcase',
            'is_published' => true,
        ]);

        // 7. Academic Timelines (ปฏิทินจริงจาก com.snru.ac.th)
        Timeline::truncate();

        Timeline::create([
            'title' => 'วันเปิดระบบเสนอและยื่นคำขออนุมัติสถานที่ฝึกประสบการณ์วิชาชีพ',
            'description' => 'นักศึกษาชั้นปีที่ 3 ยื่นเสนอสถานที่ฝึกงานและแนบเอกสารผ่านระบบออนไลน์',
            'start_date' => Carbon::now()->subDays(5)->toDateString(),
            'end_date' => Carbon::now()->addDays(20)->toDateString(),
            'badge_type' => 'deadline',
            'is_published' => true,
        ]);

        Timeline::create([
            'title' => 'วันปฐมนิเทศนักศึกษาก่อนออกฝึกประสบการณ์วิชาชีพด้านคอมพิวเตอร์',
            'description' => 'กิจกรรมเตรียมความพร้อม “Reboot ยังไง… ก่อนออกฝึก” ชี้แจงระเบียบและการปฏิบัติตน ณ ห้องประชุมสาขาวิชาคอมพิวเตอร์',
            'start_date' => Carbon::now()->addDays(28)->toDateString(),
            'end_date' => Carbon::now()->addDays(28)->toDateString(),
            'badge_type' => 'orientation',
            'is_published' => true,
        ]);

        Timeline::create([
            'title' => 'กำหนดการออกหนังสือขอความอนุเคราะห์และส่งตัวนักศึกษาฝึกประสบการณ์วิชาชีพ',
            'description' => 'สาขาวิชาคอมพิวเตอร์ คณะวิทยาศาสตร์และเทคโนโลยี ออกหนังสือส่งตัวอย่างเป็นทางการให้แก่หน่วยงาน',
            'start_date' => Carbon::now()->addDays(40)->toDateString(),
            'end_date' => Carbon::now()->addDays(50)->toDateString(),
            'badge_type' => 'letter',
            'is_published' => true,
        ]);

        Timeline::create([
            'title' => 'กำหนดการปัจฉิมนิเทศหลังฝึกประสบการณ์วิชาชีพและนำเสนอผลงาน',
            'description' => 'นำเสนอรายงานผลการฝึกงาน ประเมินผล และปัจฉิมนิเทศหลังเสร็จสิ้นการฝึกประสบการณ์วิชาชีพ',
            'start_date' => Carbon::now()->addDays(150)->toDateString(),
            'end_date' => Carbon::now()->addDays(150)->toDateString(),
            'badge_type' => 'calendar',
            'is_published' => true,
        ]);

        // 8. Sample Applications & Daily Logs (เพื่อการทดสอบระบบสมุดบันทึกและการนิเทศก์)
        $appPajaree = Application::firstOrCreate([
            'user_id' => $student->id,
            'company_id' => $comp1->id,
        ], [
            'position_title' => 'Full-Stack Developer Intern (นักศึกษาฝึกงานพัฒนาเว็บแอปพลิเคชัน)',
            'job_description' => 'พัฒนา Web Application ด้วย Laravel, React, Inertia.js และออกแบบ REST API',
            'start_date' => Carbon::now()->subDays(10)->toDateString(),
            'end_date' => Carbon::now()->addDays(80)->toDateString(),
            'coordinator_name' => 'คุณกิตติศักดิ์ พัฒนกิจ',
            'coordinator_position' => 'Senior Engineering Manager',
            'coordinator_phone' => '02-123-4567',
            'coordinator_email' => 'hr@onecode.co.th',
            'status' => Application::STATUS_APPROVED,
            'current_stage' => 2,
            'submitted_at' => Carbon::now()->subDays(12),
            'instructor_approved_at' => Carbon::now()->subDays(11),
            'chair_approved_at' => Carbon::now()->subDays(10),
        ]);

        $appNatthawut = Application::firstOrCreate([
            'user_id' => $student2->id,
            'company_id' => $comp2->id,
        ], [
            'position_title' => 'Network & System Administrator Intern',
            'job_description' => 'ดูแลระบบเครือข่าย อินเทอร์เน็ต เซิร์ฟเวอร์ และระบบงานสารสนเทศ มรภ.สกลนคร',
            'start_date' => Carbon::now()->subDays(5)->toDateString(),
            'end_date' => Carbon::now()->addDays(85)->toDateString(),
            'coordinator_name' => 'นายสมชาย วิศวกรไอที',
            'coordinator_position' => 'หัวหน้างานระบบเครือข่าย',
            'coordinator_phone' => '042-772392',
            'coordinator_email' => 'tech-center@snru.ac.th',
            'status' => Application::STATUS_APPROVED,
            'current_stage' => 2,
            'submitted_at' => Carbon::now()->subDays(7),
            'instructor_approved_at' => Carbon::now()->subDays(6),
            'chair_approved_at' => Carbon::now()->subDays(5),
        ]);

        // Daily Logs for Pajaree
        DailyLog::firstOrCreate([
            'user_id' => $student->id,
            'log_date' => Carbon::now()->subDays(4)->toDateString(),
        ], [
            'application_id' => $appPajaree->id,
            'check_in_time' => '08:30',
            'check_out_time' => '17:30',
            'work_hours' => 8.0,
            'task_title' => 'ปฐมนิเทศพนักงานใหม่และติดตั้ง Development Environment',
            'task_description' => 'เข้าร่วมการปฐมนิเทศนักศึกษาฝึกงานของบริษัท One Code Solutions รับฟังระเบียบและข้อตกลงในการรักษาความลับ (NDA) จากนั้นติดตั้ง Docker Desktop, PHP 8.3, Composer และ Git พร้อมโคลน Source Code ของโปรเจกต์ต้นแบบ',
            'tech_stack' => 'Docker, PHP 8.3, Git, VS Code',
            'problems_encountered' => 'พบปัญหา Docker WSL 2 Integration ขัดข้องบนเครื่องปฏิบัติงาน',
            'solutions_applied' => 'อัปเดต Linux Kernel Package ผ่าน PowerShell และรีสตาร์ต Docker Daemon สำเร็จ',
            'learning_outcome' => 'เข้าใจกระบวนการ Onboarding ของบริษัทพัฒนาซอฟต์แวร์ และการเตรียม Environment ด้วย Containerization',
            'is_verified' => true,
            'verified_by_user_id' => $instructor->id,
            'instructor_comment' => 'ดีมากครับที่ตั้งค่า Environment ได้เรียบร้อย การฝึกงานที่ One Code Solutions จะเน้น Best Practices ทางวิศวกรรมซอฟต์แวร์ ให้หมั่นสังเกตและจดบันทึก Architecture ของระบบครับ',
            'verified_at' => Carbon::now()->subDays(3)->setHour(18),
        ]);

        DailyLog::firstOrCreate([
            'user_id' => $student->id,
            'log_date' => Carbon::now()->subDays(3)->toDateString(),
        ], [
            'application_id' => $appPajaree->id,
            'check_in_time' => '08:30',
            'check_out_time' => '17:30',
            'work_hours' => 8.0,
            'task_title' => 'ศึกษา Database Schema และออกแบบ Migration ระบบเอกสาร',
            'task_description' => 'วิเคราะห์ Entity Relationship Diagram (ERD) ของระบบเอกสารออนไลน์ ร่วมกับ Senior Developer และเขียน Migration ของ Laravel 11 สำหรับจัดการตารางเอกสาร สิทธิ์การเข้าถึง และ Log การลงนาม',
            'tech_stack' => 'Laravel 11, MySQL, Draw.io, Artisan',
            'problems_encountered' => 'มีปัญหา Foreign Key Constraint Fail ตอนรันคำสั่ง migrate:fresh',
            'solutions_applied' => 'ตรวจสอบลำดับการสร้างตารางใน Migration file ให้ตารางแม่ถูกสร้างก่อนตารางลูก',
            'learning_outcome' => 'เข้าใจการออกแบบ Normalized Database สำหรับระบบองค์กรและการจัดการ Foreign Key Cascade',
            'is_verified' => true,
            'verified_by_user_id' => $instructor->id,
            'instructor_comment' => 'การจัดการ Database Migration และ Foreign Key ในระบบขนาดใหญ่มีความสำคัญมาก ชื่นชมการแก้ไขปัญหาตามลำดับขั้นตอนครับ',
            'verified_at' => Carbon::now()->subDays(2)->setHour(19),
        ]);

        DailyLog::firstOrCreate([
            'user_id' => $student->id,
            'log_date' => Carbon::now()->subDays(2)->toDateString(),
        ], [
            'application_id' => $appPajaree->id,
            'check_in_time' => '08:30',
            'check_out_time' => '17:30',
            'work_hours' => 8.0,
            'task_title' => 'พัฒนา RESTful API Endpoints สำหรับการอัปโหลดไฟล์และ Authentication',
            'task_description' => 'สร้าง Controller และ Form Request Validation สำหรับระบบอัปโหลดไฟล์ PDF พร้อมทั้งตั้งค่า Storage Disk ของ Laravel และเขียน Unit Test เพื่อทดสอบ API Endpoint',
            'tech_stack' => 'Laravel Sanctum, PHPUnit, Postman, REST API',
            'problems_encountered' => 'ขนาดไฟล์อัปโหลดเกินขีดจำกัด upload_max_filesize',
            'solutions_applied' => 'ปรับคอนฟิก php.ini และเพิ่ม Validation Rule ให้รองรับขนาดไฟล์ไม่เกิน 10MB',
            'learning_outcome' => 'เข้าใจการเขียน API ที่ปลอดภัยและการทำ Multipart form-data validation ใน Laravel',
            'is_verified' => true,
            'verified_by_user_id' => $instructor->id,
            'instructor_comment' => 'อย่าลืมตรวจสอบ API Response Standard (HTTP Status Codes, Error payload) ให้ตรงตามมาตรฐานของทีมพัฒนาด้วยนะครับ',
            'verified_at' => Carbon::now()->subDays(1)->setHour(20),
        ]);

        DailyLog::firstOrCreate([
            'user_id' => $student->id,
            'log_date' => Carbon::now()->subDays(1)->toDateString(),
        ], [
            'application_id' => $appPajaree->id,
            'check_in_time' => '08:30',
            'check_out_time' => '17:30',
            'work_hours' => 8.0,
            'task_title' => 'เชื่อมต่อ Frontend React (Inertia.js) กับ Backend และจัดการ State',
            'task_description' => 'พัฒนา Component หน้าแบบฟอร์มเอกสารด้วย React และ Tailwind CSS เชื่อมต่อกับ Inertia form helper เพื่อส่งข้อมูลไปยัง Backend พร้อมทำ Flash Alert แจ้งเตือนสถานะการทำงาน',
            'tech_stack' => 'React, Inertia.js, Tailwind CSS, Lucide Icons',
            'problems_encountered' => 'State ของฟอร์มไม่รีเซ็ตหลังจากส่งข้อมูลสำเร็จ',
            'solutions_applied' => 'ใช้ onSuccess callback ของ useForm เพื่อเรียก form.reset() ให้ทำงานอัตโนมัติ',
            'learning_outcome' => 'เข้าใจสถาปัตยกรรม Monolith SPA แบบ Modern Laravel + Inertia.js ที่ไม่ต้องเขียน Redux ให้ซับซ้อน',
            'is_verified' => false, // รออาจารย์ตรวจ
            'verified_by_user_id' => null,
            'instructor_comment' => null,
            'verified_at' => null,
        ]);

        DailyLog::firstOrCreate([
            'user_id' => $student->id,
            'log_date' => Carbon::now()->toDateString(),
        ], [
            'application_id' => $appPajaree->id,
            'check_in_time' => '08:30',
            'check_out_time' => '17:30',
            'work_hours' => 8.0,
            'task_title' => 'แก้ไขปัญหา CORS และ Optimize Database Query ด้วย Eager Loading',
            'task_description' => 'ตรวจสอบพบปัญหา N+1 Query ในหน้าแสดงรายการเอกสาร จึงปรับปรุง Eloquent Query โดยใส่ with() Eager Loading และติดตั้ง Laravel Debugbar เพื่อวัดผล Execution Time ที่ลดลงจาก 420ms เหลือ 65ms',
            'tech_stack' => 'Laravel Eloquent, Laravel Debugbar, SQL Profiling',
            'problems_encountered' => 'หน้าเว็บโหลดช้าลงอย่างเห็นได้ชัดเมื่อมีข้อมูลเอกสารมากกว่า 100 รายการ',
            'solutions_applied' => 'แก้ไขคำสั่งจาก $applications->get() เป็น Application::with(["company", "documents"])->get()',
            'learning_outcome' => 'ตระหนักถึงประสิทธิภาพของระบบฐานข้อมูลในระดับ Production และเทคนิคการลด Round-trip Query',
            'is_verified' => false, // รออาจารย์ตรวจ
            'verified_by_user_id' => null,
            'instructor_comment' => null,
            'verified_at' => null,
        ]);

        // Daily Logs for Natthawut
        DailyLog::firstOrCreate([
            'user_id' => $student2->id,
            'log_date' => Carbon::now()->subDays(1)->toDateString(),
        ], [
            'application_id' => $appNatthawut->id,
            'check_in_time' => '08:30',
            'check_out_time' => '17:30',
            'work_hours' => 8.0,
            'task_title' => 'ตรวจสอบการเดินสายสัญญาณใยแก้วนำแสง (Fiber Optic) อาคารเรียนรวม',
            'task_description' => 'ร่วมกับพี่เลี้ยงประจำศูนย์ไอที สำรวจจุดเชื่อมต่อ Core Switch และทดสอบค่า Loss ของสายสัญญาณใยแก้วนำแสงด้วยเครื่อง OTDR',
            'tech_stack' => 'OTDR, Fiber Optic, Cisco Catalyst, Network Rack',
            'problems_encountered' => 'จุดเชื่อมต่อ Rack ชั้น 3 มีค่าสัญญาณ Loss สูงกว่าปกติ',
            'solutions_applied' => 'ทำความสะอาดหัวคอนเน็กเตอร์ LC และ Fusion Splicing ซ่อมแซมสายช่วงที่มีปัญหา',
            'learning_outcome' => 'ได้ฝึกทักษะการซ่อมบำรุงสายเคเบิลความเร็วสูงในสภาพแวดล้อมระบบขนาดใหญ่',
            'is_verified' => true,
            'verified_by_user_id' => $instructor->id,
            'instructor_comment' => 'การทำงานกับสายใยแก้วนำแสงต้องอาศัยความประณีตและความปลอดภัย เป็นประสบการณ์จริงที่ดีมากครับ',
            'verified_at' => Carbon::now()->subDays(1)->setHour(19),
        ]);

        DailyLog::firstOrCreate([
            'user_id' => $student2->id,
            'log_date' => Carbon::now()->toDateString(),
        ], [
            'application_id' => $appNatthawut->id,
            'check_in_time' => '08:30',
            'check_out_time' => '17:30',
            'work_hours' => 8.0,
            'task_title' => 'กำหนดค่า VLAN และทดสอบ Access Switch เครือข่าย Wi-Fi นักศึกษา',
            'task_description' => 'Config VLAN 20 (Student Wi-Fi) และ VLAN 30 (Staff) บน Switch Cisco พร้อมทั้งทดสอบการแจก IP ผ่าน DHCP Relay Server',
            'tech_stack' => 'Cisco IOS, CLI, VLAN, DHCP Relay, Wi-Fi 6',
            'problems_encountered' => 'Client เชื่อมต่อ Access Point แล้วไม่ได้รับหมายเลข IP',
            'solutions_applied' => 'เพิ่มคำสั่ง ip helper-address ชี้ไปยัง DHCP Server ใน SVI Interface',
            'learning_outcome' => 'เข้าใจกระบวนการแบ่ง Network Segmentation และการทำงานของ DHCP Relay Agent',
            'is_verified' => false, // รออาจารย์ตรวจ
            'verified_by_user_id' => null,
            'instructor_comment' => null,
            'verified_at' => null,
        ]);

        // 9. SNRU Student Database Records (จาก snru_student_api/database.sql)
        $snruData = [
            [
                'student_id' => '671000001',
                'full_name' => 'นายตัวอย่าง หนึ่ง',
                'faculty' => 'คณะวิทยาศาสตร์และเทคโนโลยี',
                'major' => 'เทคโนโลยีคอมพิวเตอร์และดิจิทัล',
                'year_level' => 2,
                'status' => 'active',
                'email' => 'sample1@snru.ac.th',
                'phone' => '081-111-0001',
            ],
            [
                'student_id' => '671000002',
                'full_name' => 'นางสาวตัวอย่าง สอง',
                'faculty' => 'คณะวิทยาศาสตร์และเทคโนโลยี',
                'major' => 'เทคโนโลยีคอมพิวเตอร์และดิจิทัล',
                'year_level' => 2,
                'status' => 'active',
                'email' => 'sample2@snru.ac.th',
                'phone' => '081-111-0002',
            ],
            [
                'student_id' => '681000001',
                'full_name' => 'นายตัวอย่าง สาม',
                'faculty' => 'คณะวิทยาศาสตร์และเทคโนโลยี',
                'major' => 'วิทยาการข้อมูล',
                'year_level' => 1,
                'status' => 'active',
                'email' => 'sample3@snru.ac.th',
                'phone' => '081-111-0003',
            ],
            [
                'student_id' => '661000001',
                'full_name' => 'นางสาวตัวอย่าง สี่',
                'faculty' => 'คณะมนุษยศาสตร์และสังคมศาสตร์',
                'major' => 'ภาษาอังกฤษ',
                'year_level' => 4,
                'status' => 'active',
                'email' => 'sample4@snru.ac.th',
                'phone' => '081-111-0004',
            ],
            [
                'student_id' => '651000001',
                'full_name' => 'นายตัวอย่าง ห้า',
                'faculty' => 'คณะวิทยาการจัดการ',
                'major' => 'บริหารธุรกิจ',
                'year_level' => 4,
                'status' => 'graduated',
                'email' => 'sample5@snru.ac.th',
                'phone' => '081-111-0005',
            ],
            [
                'student_id' => '67102122131',
                'full_name' => 'นางสาว ปาจรีย์ สุคนธชาติ',
                'faculty' => 'คณะวิทยาศาสตร์และเทคโนโลยี',
                'major' => 'เทคโนโลยีคอมพิวเตอร์และดิจิทัล',
                'year_level' => 3,
                'status' => 'active',
                'email' => 'student@snru.ac.th',
                'phone' => '095-123-4567',
            ],
            [
                'student_id' => '67102122145',
                'full_name' => 'นาย ณัฐวุฒิ พัฒนาการ',
                'faculty' => 'คณะวิทยาศาสตร์และเทคโนโลยี',
                'major' => 'วิทยาการคอมพิวเตอร์',
                'year_level' => 3,
                'status' => 'active',
                'email' => 'student2@snru.ac.th',
                'phone' => '092-987-6543',
            ],
        ];

        foreach ($snruData as $stu) {
            SnruStudent::updateOrCreate(
                ['student_id' => $stu['student_id']],
                $stu
            );
        }
    }
}
