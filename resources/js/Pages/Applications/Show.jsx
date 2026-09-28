import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { 
    FileText, 
    Building2, 
    User, 
    Calendar, 
    Briefcase, 
    CheckCircle2, 
    Clock, 
    RotateCcw, 
    AlertCircle, 
    Download, 
    Edit3, 
    Send, 
    ArrowLeft,
    ShieldCheck
} from 'lucide-react';

export default function ApplicationShow({ application }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const role = user?.role?.name || 'student';
    const isOwner = user?.id === application.user_id;

    return (
        <AppLayout>
            <Head title={`คำขอฝึกงาน - ${application.company?.name}`} />

            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <Link
                            href="/applications"
                            className="inline-flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-800 font-prompt mb-2 transition"
                        >
                            <ArrowLeft size={16} />
                            <span>ย้อนกลับไปรายการคำขอ</span>
                        </Link>
                        <h1 className="text-2xl font-bold font-prompt text-slate-900 flex items-center space-x-2">
                            <span>คำขออนุมัติสถานที่เตรียมฝึกประสบการณ์วิชาชีพ</span>
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            ยื่นโดย: <strong>{application.user?.name}</strong> (รหัส {application.user?.student_id}) • {application.user?.curriculum?.name}
                        </p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <span className={`text-xs px-3.5 py-1.5 rounded-full font-semibold border ${application.status_badge_color}`}>
                            {application.status_label}
                        </span>

                        {isOwner && ['draft', 'revision_required'].includes(application.status) && (
                            <Link
                                href={`/applications/${application.id}/edit`}
                                className="inline-flex items-center space-x-1 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold font-prompt shadow-sm transition"
                            >
                                <Edit3 size={14} />
                                <span>แก้ไขข้อมูล</span>
                            </Link>
                        )}
                    </div>
                </div>

                {/* 2-Tier Approval Stepper */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6">
                    <h3 className="font-prompt font-bold text-xs uppercase tracking-wider text-slate-400 mb-4">
                        ลำดับขั้นตอนการพิจารณาตรวจสอบ (2-Tier Approval Pipeline)
                    </h3>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs font-prompt">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center">
                            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold mb-1 shadow-sm">
                                ✓
                            </div>
                            <span className="font-semibold text-slate-800">1. ยื่นคำขอ</span>
                            <span className="text-[10px] text-slate-400">
                                {application.submitted_at ? new Date(application.submitted_at).toLocaleDateString('th-TH') : 'บันทึกแบบร่าง'}
                            </span>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold mb-1 shadow-sm ${
                                ['pending_chair', 'approved'].includes(application.status) 
                                    ? 'bg-emerald-600 text-white' 
                                    : application.status === 'pending_instructor' 
                                    ? 'bg-amber-500 text-white animate-pulse' 
                                    : application.status === 'revision_required'
                                    ? 'bg-rose-500 text-white'
                                    : 'bg-slate-200 text-slate-500'
                            }`}>
                                {['pending_chair', 'approved'].includes(application.status) ? '✓' : '2'}
                            </div>
                            <span className="font-semibold text-slate-800">2. อาจารย์ตรวจ (ขั้น 1)</span>
                            <span className="text-[10px] text-slate-400">
                                {application.instructor_approved_at ? 'ผ่านเกณฑ์แล้ว' : 'อาจารย์ผู้รับผิดชอบ'}
                            </span>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold mb-1 shadow-sm ${
                                application.status === 'approved' 
                                    ? 'bg-emerald-600 text-white' 
                                    : application.status === 'pending_chair' 
                                    ? 'bg-blue-600 text-white animate-pulse' 
                                    : 'bg-slate-200 text-slate-500'
                            }`}>
                                {application.status === 'approved' ? '✓' : '3'}
                            </div>
                            <span className="font-semibold text-slate-800">3. ประธานหลักสูตร (ขั้น 2)</span>
                            <span className="text-[10px] text-slate-400">
                                {application.chair_approved_at ? 'อนุมัติแล้ว' : 'พิจารณาขั้นสุดท้าย'}
                            </span>
                        </div>

                        {/* Step 4 */}
                        <div className="flex flex-col items-center">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold mb-1 shadow-sm ${
                                application.status === 'approved' 
                                    ? 'bg-emerald-600 text-white' 
                                    : 'bg-slate-200 text-slate-500'
                            }`}>
                                {application.status === 'approved' ? '✓' : '4'}
                            </div>
                            <span className="font-semibold text-slate-800">4. อนุมัติสำเร็จ</span>
                            <span className="text-[10px] text-slate-400">ออกหนังสือส่งตัว</span>
                        </div>
                    </div>

                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-4">
                        <div 
                            className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-500"
                            style={{ width: `${application.progress_percentage}%` }}
                        ></div>
                    </div>
                </div>

                {/* Latest Remarks Alert */}
                {application.latest_remarks && (
                    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-3 text-xs text-amber-900 shadow-xs">
                        <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <span className="font-bold font-prompt text-sm block">บันทึกข้อเสนอแนะล่าสุดจากผู้ตรวจ:</span>
                            <p className="mt-1 leading-relaxed">{application.latest_remarks}</p>
                        </div>
                    </div>
                )}

                {/* Grid Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Workplace details */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 text-xs">
                        <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                            <Building2 size={18} className="text-blue-600" />
                            <h3 className="font-prompt font-bold text-sm text-slate-800">ข้อมูลสถานประกอบการ</h3>
                        </div>
                        <div>
                            <span className="text-slate-400 block">ชื่อบริษัท/หน่วยงาน:</span>
                            <span className="font-bold text-slate-800 font-prompt text-sm">{application.company?.name}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block">ประเภทธุรกิจ:</span>
                            <span className="text-slate-700">{application.company?.business_type || '-'}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block">ที่อยู่:</span>
                            <span className="text-slate-700">{application.company?.address || application.company?.province}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block">ตำแหน่งที่ขอฝึกงาน:</span>
                            <span className="font-semibold text-blue-700 text-sm">{application.position_title}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block">ระยะเวลาการฝึกงาน:</span>
                            <span className="text-slate-700">
                                {new Date(application.start_date).toLocaleDateString('th-TH')} ถึง {new Date(application.end_date).toLocaleDateString('th-TH')}
                            </span>
                        </div>
                        {application.job_description && (
                            <div>
                                <span className="text-slate-400 block">ลักษณะงาน:</span>
                                <p className="text-slate-700 mt-1 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                    {application.job_description}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Coordinator & Student Notes */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 text-xs">
                        <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                            <Briefcase size={18} className="text-blue-600" />
                            <h3 className="font-prompt font-bold text-sm text-slate-800">ผู้ประสานงานในสถานประกอบการ</h3>
                        </div>
                        <div>
                            <span className="text-slate-400 block">ชื่อ-นามสกุล ผู้ประสานงาน:</span>
                            <span className="font-semibold text-slate-800 font-prompt">{application.coordinator_name}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block">ตำแหน่ง:</span>
                            <span className="text-slate-700">{application.coordinator_position || '-'}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block">เบอร์โทรศัพท์:</span>
                            <span className="text-slate-700">{application.coordinator_phone}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block">อีเมล:</span>
                            <span className="text-slate-700">{application.coordinator_email || '-'}</span>
                        </div>
                        {application.student_notes && (
                            <div className="pt-2 border-t border-slate-100">
                                <span className="text-slate-400 block">หมายเหตุจากนักศึกษา:</span>
                                <p className="text-slate-600 mt-1 italic">{application.student_notes}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Attached Documents Card */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-6">
                    <div className="flex items-center space-x-2 pb-3 mb-3 border-b border-slate-100">
                        <FileText size={18} className="text-blue-600" />
                        <h3 className="font-prompt font-bold text-sm text-slate-800">เอกสารแนบประกอบคำขอ</h3>
                    </div>
                    {application.documents?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {application.documents.map((doc) => (
                                <div key={doc.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                                    <div className="space-y-0.5">
                                        <div className="font-semibold text-slate-800 font-prompt">{doc.title}</div>
                                        <div className="text-[11px] text-slate-400">{doc.original_name} ({doc.formatted_file_size})</div>
                                    </div>
                                    <a
                                        href={`/storage/${doc.file_path}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-semibold font-prompt transition"
                                    >
                                        <Download size={14} />
                                        <span>เปิดดู</span>
                                    </a>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-xs text-slate-400 text-center py-4">ไม่มีเอกสารแนบ</div>
                    )}
                </div>

                {/* Audit Trail: Approval Logs */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-6">
                    <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-slate-100">
                        <ShieldCheck size={18} className="text-blue-600" />
                        <h3 className="font-prompt font-bold text-sm text-slate-800">ประวัติและบันทึกการตรวจสอบ (Audit Trail)</h3>
                    </div>

                    {application.approval_logs?.length > 0 ? (
                        <div className="space-y-4">
                            {application.approval_logs.map((log) => (
                                <div key={log.id} className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100 text-xs">
                                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-bold text-slate-900 font-prompt">{log.stage_label}</span>
                                            <span className="text-slate-500">โดย {log.user?.name}</span>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                                            log.action === 'approved' 
                                                ? 'bg-emerald-100 text-emerald-800' 
                                                : log.action === 'revision_requested' 
                                                ? 'bg-amber-100 text-amber-800' 
                                                : 'bg-rose-100 text-rose-800'
                                        }`}>
                                            {log.action_label}
                                        </span>
                                    </div>
                                    {log.remarks && (
                                        <p className="text-slate-700 mt-1 bg-white p-2.5 rounded-lg border border-slate-200/60 leading-relaxed">
                                            {log.remarks}
                                        </p>
                                    )}
                                    <div className="text-[10px] text-slate-400 mt-1.5">
                                        บันทึกเมื่อ: {new Date(log.created_at).toLocaleString('th-TH')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-xs text-slate-400 text-center py-4">
                            ยังไม่มีประวัติการพิจารณาตรวจสอบ
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
