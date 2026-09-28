import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { 
    Clock, 
    CheckCircle2, 
    FileText, 
    Building2, 
    Calendar, 
    Download, 
    ArrowRight, 
    AlertCircle, 
    ChevronRight,
    Users,
    GraduationCap,
    Send,
    Edit3
} from 'lucide-react';

export default function Dashboard({ timelines, guidelines, forms, roleData }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const role = user?.role?.name || 'student';

    return (
        <AppLayout>
            <Head title="แดชบอร์ดภาพรวม" />

            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-8 pointer-events-none">
                    <GraduationCap size={240} />
                </div>
                <div className="relative z-10 max-w-2xl">
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-medium font-prompt text-blue-100 mb-3">
                        ปีการศึกษา 1/2569 • สาขาวิชาคอมพิวเตอร์
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-bold font-prompt text-white tracking-tight leading-snug">
                        สวัสดี, {user?.name}
                    </h1>
                    <p className="mt-2 text-sm sm:text-base text-blue-100/90 leading-relaxed">
                        {role === 'student' && 'ยินดีต้อนรับสู่ระบบบริหารจัดการการเตรียมฝึกประสบการณ์วิชาชีพ ตรวจสอบคุณสมบัติ ดาวน์โหลดแบบฟอร์ม และยื่นขออนุมัติสถานที่ฝึกงานได้ที่นี่'}
                        {role === 'instructor' && 'อาจารย์ผู้รับผิดชอบรายวิชา: ระบบสนับสนุนการตรวจสอบคุณสมบัติ สถานประกอบการ และเอกสารของนักศึกษาในลำดับขั้นที่ 1'}
                        {role === 'chair' && 'ประธานหลักสูตร: ระบบพิจารณาอนุมัติสถานที่ฝึกประสบการณ์วิชาชีพของนักศึกษาในขั้นตอนสุดท้าย (ขั้นที่ 2)'}
                        {role === 'admin' && 'ผู้ดูแลระบบ: จัดการข้อมูลพื้นฐาน ผู้ใช้งาน หลักสูตร สถานประกอบการ และภาพรวมของระบบทั้งหมด'}
                    </p>
                    
                    {role === 'student' && (
                        <div className="mt-5 flex flex-wrap gap-3">
                            <Link
                                href="/applications"
                                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white text-blue-700 hover:bg-blue-50 font-semibold rounded-xl text-sm transition shadow-md font-prompt"
                            >
                                <FileText size={18} />
                                <span>{roleData?.application ? 'ตรวจสอบสถานะคำขอของฉัน' : 'ยื่นขออนุมัติสถานที่ฝึกงาน'}</span>
                            </Link>
                            <Link
                                href="/companies"
                                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600/40 hover:bg-blue-600/60 text-white font-medium rounded-xl text-sm border border-white/20 transition font-prompt"
                            >
                                <Building2 size={18} />
                                <span>ดูสถานประกอบการแนะนำ</span>
                            </Link>
                        </div>
                    )}

                    {['instructor', 'chair'].includes(role) && (
                        <div className="mt-5">
                            <Link
                                href="/approvals"
                                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-amber-400 text-slate-900 hover:bg-amber-300 font-bold rounded-xl text-sm transition shadow-md font-prompt"
                            >
                                <CheckCircle2 size={18} />
                                <span>เข้าสู่หน้ารายการพิจารณาอนุมัติ ({roleData?.pendingCount || 0} รายการรอตรวจ)</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* ROLE SPECIFIC SECTION */}
            {role === 'student' && (
                <div className="mb-8">
                    {roleData?.application ? (
                        /* Student Active Application Status Card */
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-5">
                                <div>
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-prompt">
                                        สถานะคำขออนุมัติสถานที่ฝึกงานล่าสุด
                                    </span>
                                    <h3 className="text-lg font-bold text-slate-900 font-prompt">
                                        {roleData.application.company?.name}
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        ตำแหน่ง: {roleData.application.position_title}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className={`text-xs px-3 py-1.5 rounded-full font-semibold border ${roleData.application.status_badge_color}`}>
                                        {roleData.application.status_label}
                                    </span>
                                    <Link
                                        href={`/applications/${roleData.application.id}`}
                                        className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                        title="ดูรายละเอียดฉบับเต็ม"
                                    >
                                        <ChevronRight size={20} />
                                    </Link>
                                </div>
                            </div>

                            {/* 4-Step Visual Progress Stepper */}
                            <div className="my-6">
                                <div className="grid grid-cols-4 gap-2 text-center text-xs font-prompt">
                                    {/* Step 1 */}
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold mb-1 shadow-sm">
                                            ✓
                                        </div>
                                        <span className="font-semibold text-slate-800">1. ยื่นคำขอ</span>
                                        <span className="text-[10px] text-slate-400">ส่งเอกสารเรียบร้อย</span>
                                    </div>
                                    {/* Step 2 */}
                                    <div className="flex flex-col items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 shadow-sm ${
                                            ['pending_chair', 'approved'].includes(roleData.application.status) 
                                                ? 'bg-emerald-600 text-white' 
                                                : roleData.application.status === 'pending_instructor' 
                                                ? 'bg-amber-500 text-white animate-pulse' 
                                                : roleData.application.status === 'revision_required'
                                                ? 'bg-rose-500 text-white'
                                                : 'bg-slate-200 text-slate-500'
                                        }`}>
                                            {['pending_chair', 'approved'].includes(roleData.application.status) ? '✓' : '2'}
                                        </div>
                                        <span className="font-semibold text-slate-800">2. อาจารย์ผู้สอนตรวจ</span>
                                        <span className="text-[10px] text-slate-400">ตรวจสอบขั้นที่ 1</span>
                                    </div>
                                    {/* Step 3 */}
                                    <div className="flex flex-col items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 shadow-sm ${
                                            roleData.application.status === 'approved' 
                                                ? 'bg-emerald-600 text-white' 
                                                : roleData.application.status === 'pending_chair' 
                                                ? 'bg-blue-600 text-white animate-pulse' 
                                                : 'bg-slate-200 text-slate-500'
                                        }`}>
                                            {roleData.application.status === 'approved' ? '✓' : '3'}
                                        </div>
                                        <span className="font-semibold text-slate-800">3. ประธานหลักสูตร</span>
                                        <span className="text-[10px] text-slate-400">พิจารณาขั้นสุดท้าย</span>
                                    </div>
                                    {/* Step 4 */}
                                    <div className="flex flex-col items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 shadow-sm ${
                                            roleData.application.status === 'approved' 
                                                ? 'bg-emerald-600 text-white' 
                                                : 'bg-slate-200 text-slate-500'
                                        }`}>
                                            {roleData.application.status === 'approved' ? '✓' : '4'}
                                        </div>
                                        <span className="font-semibold text-slate-800">4. อนุมัติสำเร็จ</span>
                                        <span className="text-[10px] text-slate-400">ออกหนังสือส่งตัว</span>
                                    </div>
                                </div>
                                {/* Progress Bar Line */}
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
                                    <div 
                                        className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-500"
                                        style={{ width: `${roleData.application.progress_percentage}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Remarks notice if returned for edits */}
                            {roleData.application.latest_remarks && (
                                <div className="mt-4 p-4 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start space-x-3">
                                    <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-semibold font-prompt">ข้อเสนอแนะล่าสุดจากผู้ตรวจ:</div>
                                        <div className="mt-1 leading-relaxed">{roleData.application.latest_remarks}</div>
                                    </div>
                                </div>
                            )}

                            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                                <Link
                                    href={`/applications/${roleData.application.id}`}
                                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1 font-prompt"
                                >
                                    <span>ดูรายละเอียดคำขอและประวัติการตรวจสอบทั้งหมด</span>
                                    <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    ) : (
                        /* If no application yet */
                        <div className="bg-white rounded-2xl p-6 border border-dashed border-slate-300 text-center">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                <FileText size={24} />
                            </div>
                            <h3 className="text-base font-bold text-slate-800 font-prompt">
                                คุณยังไม่ได้ยื่นคำขออนุมัติสถานที่ฝึกงาน
                            </h3>
                            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                                กรุณาศึกษาคุณสมบัติ จัดเตรียมเอกสารเรซูเม่ และยื่นคำขอผ่านระบบก่อนหมดเขตตามปฏิทินการศึกษา
                            </p>
                            <Link
                                href="/applications/create"
                                className="mt-4 inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition font-prompt shadow-sm"
                            >
                                <Send size={16} />
                                <span>เริ่มยื่นคำขออนุมัติสถานที่ฝึกงาน</span>
                            </Link>
                        </div>
                    )}
                </div>
            )}

            {/* REVIEWER QUEUE SECTION (Instructor & Chair) */}
            {['instructor', 'chair'].includes(role) && (
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-900 font-prompt flex items-center space-x-2">
                            <span>รายการคำขอที่รอการพิจารณาตรวจสอบ</span>
                            <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                                {roleData?.pendingApplications?.length || 0} รายการ
                            </span>
                        </h2>
                        <Link href="/approvals" className="text-xs font-semibold text-blue-600 hover:underline font-prompt">
                            ไปยังหน้าระบบอนุมัติ 2 ขั้นตอน &rarr;
                        </Link>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        {roleData?.pendingApplications?.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {roleData.pendingApplications.map((app) => (
                                    <div key={app.id} className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 hover:bg-slate-50/80 transition">
                                        <div className="space-y-1">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-bold text-sm text-slate-900 font-prompt">
                                                    {app.user?.name}
                                                </span>
                                                <span className="text-xs text-slate-500">
                                                    (รหัส {app.user?.student_id})
                                                </span>
                                                <span className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                                                    {app.user?.curriculum?.code}
                                                </span>
                                            </div>
                                            <div className="text-xs text-slate-600">
                                                <span className="font-semibold text-slate-700">{app.company?.name}</span> • ตำแหน่ง: {app.position_title}
                                            </div>
                                            <div className="text-[11px] text-slate-400">
                                                ยื่นคำขอเมื่อ: {new Date(app.submitted_at).toLocaleDateString('th-TH')}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Link
                                                href={`/applications/${app.id}`}
                                                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition font-prompt"
                                            >
                                                ดูข้อมูล/เอกสาร
                                            </Link>
                                            <Link
                                                href="/approvals"
                                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition font-prompt shadow-sm flex items-center space-x-1"
                                            >
                                                <span>ตรวจพิจารณา</span>
                                                <ChevronRight size={15} />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-slate-400 text-xs">
                                ไม่มีคำขอที่รอการพิจารณาในขณะนี้
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ADMIN KPI SECTION */}
            {role === 'admin' && roleData?.stats && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                        <div className="text-xs text-slate-500 font-medium">นักศึกษาในระบบ</div>
                        <div className="text-2xl font-bold font-prompt text-slate-900 mt-1">{roleData.stats.totalStudents}</div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                        <div className="text-xs text-slate-500 font-medium">สถานประกอบการ</div>
                        <div className="text-2xl font-bold font-prompt text-blue-600 mt-1">{roleData.stats.totalCompanies}</div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                        <div className="text-xs text-slate-500 font-medium">คำขอทั้งหมด</div>
                        <div className="text-2xl font-bold font-prompt text-indigo-600 mt-1">{roleData.stats.totalApplications}</div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                        <div className="text-xs text-slate-500 font-medium">รออาจารย์ตรวจ</div>
                        <div className="text-2xl font-bold font-prompt text-amber-600 mt-1">{roleData.stats.pendingInstructor}</div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                        <div className="text-xs text-slate-500 font-medium">รอประธานตรวจ</div>
                        <div className="text-2xl font-bold font-prompt text-blue-600 mt-1">{roleData.stats.pendingChair}</div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                        <div className="text-xs text-slate-500 font-medium">อนุมัติสำเร็จแล้ว</div>
                        <div className="text-2xl font-bold font-prompt text-emerald-600 mt-1">{roleData.stats.approvedApplications}</div>
                    </div>
                </div>
            )}

            {/* THREE-COLUMN RESOURCE & CALENDAR GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. Academic Calendar / Timeline */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                        <h3 className="font-prompt font-bold text-slate-900 text-sm flex items-center space-x-2">
                            <Calendar size={18} className="text-blue-600" />
                            <span>ปฏิทินและกำหนดการสำคัญ</span>
                        </h3>
                        <Link href="/timeline" className="text-xs text-blue-600 hover:underline">
                            ดูทั้งหมด
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {timelines.map((item) => (
                            <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                                <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
                                    <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                                        {item.badge_type === 'deadline' ? 'วันกำหนดส่ง' : item.badge_type === 'orientation' ? 'ปฐมนิเทศ' : 'กำหนดการ'}
                                    </span>
                                    <span>{new Date(item.start_date).toLocaleDateString('th-TH')}</span>
                                </div>
                                <div className="font-semibold text-slate-800 font-prompt mt-1">
                                    {item.title}
                                </div>
                                <div className="text-slate-500 mt-0.5 text-[11px] leading-relaxed">
                                    {item.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Preparation Guides (Resume, Portfolio, Qualifications) */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                        <h3 className="font-prompt font-bold text-slate-900 text-sm flex items-center space-x-2">
                            <FileText size={18} className="text-indigo-600" />
                            <span>คำแนะนำ Resume & พอร์ตโฟลิโอ</span>
                        </h3>
                        <Link href="/guidelines" className="text-xs text-indigo-600 hover:underline">
                            อ่านคู่มือ
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {guidelines.map((guide) => (
                            <Link 
                                key={guide.id}
                                href="/guidelines"
                                className="block p-3 bg-slate-50 hover:bg-indigo-50/50 rounded-xl border border-slate-100 transition group text-xs"
                            >
                                <div className="font-semibold text-slate-800 group-hover:text-indigo-700 font-prompt">
                                    {guide.title}
                                </div>
                                <div className="text-slate-500 text-[11px] mt-1 line-clamp-2">
                                    {guide.summary}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* 3. Official Forms Download */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                        <h3 className="font-prompt font-bold text-slate-900 text-sm flex items-center space-x-2">
                            <Download size={18} className="text-emerald-600" />
                            <span>เอกสารและแบบฟอร์มดาวน์โหลด</span>
                        </h3>
                        <Link href="/forms" className="text-xs text-emerald-600 hover:underline">
                            คลังแบบฟอร์ม
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {forms.map((form) => (
                            <div key={form.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-2 text-xs">
                                <div>
                                    <div className="font-semibold text-slate-800 font-prompt">
                                        {form.title}
                                    </div>
                                    <div className="text-[11px] text-slate-400 mt-0.5">
                                        {form.formatted_file_size} • ดาวน์โหลดแล้ว {form.download_count} ครั้ง
                                    </div>
                                </div>
                                <a
                                    href={`/forms/${form.id}/download`}
                                    className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition"
                                    title="ดาวน์โหลดไฟล์แบบฟอร์ม"
                                >
                                    <Download size={16} />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
