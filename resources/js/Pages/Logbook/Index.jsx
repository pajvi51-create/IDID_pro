import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    Calendar,
    Clock,
    Plus,
    CheckCircle2,
    Clock3,
    AlertCircle,
    Building2,
    Code,
    Sparkles,
    Wrench,
    MessageSquare,
    Search,
    Filter,
    Trash2,
    Edit3,
    UserCheck,
    ChevronRight,
    Award,
    BookOpen,
    Send,
    X,
    FileText,
    Check,
    User
} from 'lucide-react';

export default function LogbookIndex({ 
    isInstructorView, 
    dailyLogs = [], 
    stats = {}, 
    activeApplication = null, 
    students = [], 
    selectedStudent = null 
}) {
    // Student Form Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingLog, setEditingLog] = useState(null);

    // Instructor Verification Modal State
    const [verifyingLog, setVerifyingLog] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, verified, pending
    const [studentSearch, setStudentSearch] = useState('');

    // Student Log Form
    const logForm = useForm({
        log_date: new Date().toISOString().split('T')[0],
        check_in_time: '08:30',
        check_out_time: '17:30',
        work_hours: 8.0,
        task_title: '',
        task_description: '',
        tech_stack: '',
        problems_encountered: '',
        solutions_applied: '',
        learning_outcome: '',
    });

    // Instructor Verification Form
    const verifyForm = useForm({
        is_verified: true,
        instructor_comment: '',
    });

    // Open create modal
    const handleOpenCreateModal = () => {
        setEditingLog(null);
        logForm.reset();
        logForm.setData({
            log_date: new Date().toISOString().split('T')[0],
            check_in_time: '08:30',
            check_out_time: '17:30',
            work_hours: 8.0,
            task_title: '',
            task_description: '',
            tech_stack: '',
            problems_encountered: '',
            solutions_applied: '',
            learning_outcome: '',
        });
        setIsCreateModalOpen(true);
    };

    // Open edit modal for student
    const handleOpenEditModal = (log) => {
        setEditingLog(log);
        logForm.setData({
            log_date: log.log_date ? log.log_date.split('T')[0] : '',
            check_in_time: log.check_in_time || '08:30',
            check_out_time: log.check_out_time || '17:30',
            work_hours: log.work_hours || 8.0,
            task_title: log.task_title || '',
            task_description: log.task_description || '',
            tech_stack: log.tech_stack || '',
            problems_encountered: log.problems_encountered || '',
            solutions_applied: log.solutions_applied || '',
            learning_outcome: log.learning_outcome || '',
        });
        setIsCreateModalOpen(true);
    };

    // Submit student log (create or update)
    const handleLogSubmit = (e) => {
        e.preventDefault();
        if (editingLog) {
            logForm.put(`/logbook/${editingLog.id}`, {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    setEditingLog(null);
                }
            });
        } else {
            logForm.post('/logbook', {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    logForm.reset();
                }
            });
        }
    };

    // Delete student log
    const handleDeleteLog = (logId) => {
        if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบบันทึกการปฏิบัติงานนี้?')) {
            router.delete(`/logbook/${logId}`);
        }
    };

    // Open verification dialog (Instructor)
    const handleOpenVerifyModal = (log) => {
        setVerifyingLog(log);
        verifyForm.setData({
            is_verified: true,
            instructor_comment: log.instructor_comment || '',
        });
    };

    // Submit teacher verification
    const handleVerifySubmit = (e) => {
        e.preventDefault();
        if (!verifyingLog) return;

        verifyForm.post(`/logbook/${verifyingLog.id}/verify`, {
            preserveScroll: true,
            onSuccess: () => {
                setVerifyingLog(null);
                verifyForm.reset();
            }
        });
    };

    // Filter student logs
    const filteredLogs = dailyLogs.filter(log => {
        const matchesSearch = 
            (log.task_title && log.task_title.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (log.task_description && log.task_description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (log.tech_stack && log.tech_stack.toLowerCase().includes(searchTerm.toLowerCase()));

        if (!matchesSearch) return false;

        if (filterStatus === 'verified') return log.is_verified;
        if (filterStatus === 'pending') return !log.is_verified;
        return true;
    });

    // Filter students for instructor list
    const filteredStudents = students.filter(stu => {
        return (
            stu.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
            (stu.student_id && stu.student_id.includes(studentSearch)) ||
            (stu.company_name && stu.company_name.toLowerCase().includes(studentSearch.toLowerCase()))
        );
    });

    return (
        <AppLayout title={isInstructorView ? 'ระบบตรวจนิเทศก์และบันทึกงานนักศึกษา' : 'สมุดบันทึกการปฏิบัติงานประจำวัน'}>
            <Head title={isInstructorView ? 'ระบบตรวจนิเทศก์และบันทึกงานนักศึกษา' : 'สมุดบันทึกงานประจำวัน'} />

            {/* Header Banner */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 rounded-2xl text-white shadow-lg">
                <div>
                    <div className="flex items-center space-x-2 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-1">
                        <Award size={16} />
                        <span>หลักสูตรสาขาวิชาคอมพิวเตอร์ มรภ.สกลนคร</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold font-prompt text-white tracking-tight">
                        {isInstructorView 
                            ? 'ระบบตรวจติดตามและนิเทศก์งานนักศึกษา' 
                            : 'สมุดบันทึกการปฏิบัติงานประจำวัน (Internship Logbook)'}
                    </h1>
                    <p className="mt-1 text-slate-300 text-sm max-w-2xl">
                        {isInstructorView 
                            ? 'ตรวจสอบการบันทึกงานประจำวันของนักศึกษาในสังกัด ให้ข้อเสนอแนะเชิงวิชาการ และตรวจรับรองชั่วโมงปฏิบัติงานรายวัน' 
                            : 'บันทึกกิจกรรมประจำวัน การแก้ไขปัญหา และติดตามชั่วโมงสะสมเพื่อการฝึกประสบการณ์วิชาชีพ'}
                    </p>
                </div>

                {!isInstructorView && (
                    <div>
                        <button
                            onClick={handleOpenCreateModal}
                            className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-prompt font-semibold text-sm shadow-md shadow-blue-500/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <Plus size={18} />
                            <span>+ บันทึกงานประจำวัน</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Main Content Layout */}
            {isInstructorView ? (
                /* ================= INSTRUCTOR VIEW: STUDENT SELECTOR & LOG REVIEW ================= */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Student Roster Selector (4 cols) */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-prompt font-bold text-slate-800 text-base flex items-center space-x-2">
                                    <UserCheck size={18} className="text-blue-600" />
                                    <span>รายชื่อนักศึกษาฝึกงาน ({students.length})</span>
                                </h3>
                            </div>

                            {/* Search Students */}
                            <div className="relative mb-3">
                                <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="ค้นหาชื่อ, รหัสนักศึกษา, หน่วยงาน..."
                                    value={studentSearch}
                                    onChange={(e) => setStudentSearch(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sarabun"
                                />
                            </div>

                            {/* Student List */}
                            <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
                                {filteredStudents.length === 0 ? (
                                    <div className="text-center py-8 text-slate-400 text-xs">
                                        ไม่พบข้อมูลนักศึกษาตามเงื่อนไข
                                    </div>
                                ) : (
                                    filteredStudents.map((stu) => {
                                        const isSelected = selectedStudent?.id === stu.id;
                                        return (
                                            <div
                                                key={stu.id}
                                                onClick={() => {
                                                    router.get('/logbook', { student_id: stu.id }, { preserveState: true, preserveScroll: true });
                                                }}
                                                className={`p-3.5 rounded-xl border transition cursor-pointer text-left ${
                                                    isSelected
                                                        ? 'bg-blue-50/70 border-blue-500 shadow-sm ring-1 ring-blue-500/20'
                                                        : 'bg-white hover:bg-slate-50 border-slate-200/80 hover:border-slate-300'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center space-x-2.5">
                                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                                                            isSelected ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
                                                        }`}>
                                                            {stu.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-prompt font-semibold text-slate-900 text-sm leading-snug">
                                                                {stu.name}
                                                            </div>
                                                            <div className="text-xs text-slate-500">
                                                                รหัส {stu.student_id || 'ไม่ระบุ'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <ChevronRight size={16} className={`transition ${isSelected ? 'text-blue-600 translate-x-0.5' : 'text-slate-300'}`} />
                                                </div>

                                                <div className="mt-2.5 pt-2.5 border-t border-slate-100 text-xs space-y-1">
                                                    <div className="flex items-center space-x-1.5 text-slate-600 truncate">
                                                        <Building2 size={13} className="text-slate-400 flex-shrink-0" />
                                                        <span className="truncate">{stu.company_name}</span>
                                                    </div>

                                                    <div className="flex items-center justify-between pt-1">
                                                        <span className="text-slate-500 font-medium">
                                                            บันทึก: <strong className="text-slate-800">{stu.total_hours}</strong> / 400 ชม. ({stu.total_days} วัน)
                                                        </span>
                                                        {stu.pending_count > 0 ? (
                                                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                                                                รอตรวจ {stu.pending_count} รายการ
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                                ตรวจครบแล้ว
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Selected Student's Dossier & Daily Logs (8 cols) */}
                    <div className="lg:col-span-8 space-y-5">
                        {selectedStudent ? (
                            <>
                                {/* Selected Student Header Card */}
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
                                        <div className="flex items-center space-x-3.5">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20">
                                                {selectedStudent.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <h2 className="text-lg font-bold font-prompt text-slate-900">
                                                        {selectedStudent.name}
                                                    </h2>
                                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                                        รหัส {selectedStudent.student_id}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-0.5">
                                                    {selectedStudent.curriculum} • ตำแหน่ง: {selectedStudent.position_title}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-left sm:text-right">
                                            <div className="text-xs text-slate-500">สถานที่ปฏิบัติงานฝึกงาน</div>
                                            <div className="text-sm font-semibold text-slate-800 flex items-center sm:justify-end space-x-1.5 mt-0.5">
                                                <Building2 size={15} className="text-blue-600" />
                                                <span>{selectedStudent.company_name}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Selected Student Metrics */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                            <div className="text-xs text-slate-500">ชั่วโมงสะสม</div>
                                            <div className="text-xl font-bold font-prompt text-blue-600 mt-0.5">
                                                {stats.total_hours} <span className="text-xs text-slate-500 font-normal">/ 400 ชม.</span>
                                            </div>
                                            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                                                <div 
                                                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" 
                                                    style={{ width: `${stats.progress_percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                            <div className="text-xs text-slate-500">จำนวนวันที่บันทึก</div>
                                            <div className="text-xl font-bold font-prompt text-slate-800 mt-0.5">
                                                {stats.total_days} <span className="text-xs text-slate-500 font-normal">วัน</span>
                                            </div>
                                            <div className="text-[11px] text-slate-400 mt-1.5">เฉลี่ย 8 ชม./วัน</div>
                                        </div>

                                        <div className="bg-emerald-50/60 rounded-xl p-3 border border-emerald-100">
                                            <div className="text-xs text-emerald-700">ตรวจรับรองแล้ว</div>
                                            <div className="text-xl font-bold font-prompt text-emerald-700 mt-0.5">
                                                {stats.verified_count} <span className="text-xs text-emerald-600 font-normal">รายการ</span>
                                            </div>
                                            <div className="text-[11px] text-emerald-600 mt-1.5">ได้รับการประเมินแล้ว</div>
                                        </div>

                                        <div className="bg-amber-50/60 rounded-xl p-3 border border-amber-100">
                                            <div className="text-xs text-amber-700">รออาจารย์ตรวจ</div>
                                            <div className="text-xl font-bold font-prompt text-amber-700 mt-0.5">
                                                {stats.pending_count} <span className="text-xs text-amber-600 font-normal">รายการ</span>
                                            </div>
                                            <div className="text-[11px] text-amber-600 mt-1.5">ต้องดำเนินการตรวจสอบ</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Daily Logs Timeline for Selected Student */}
                                <div className="space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <h3 className="font-prompt font-bold text-slate-800 text-base flex items-center space-x-2">
                                            <FileText size={18} className="text-indigo-600" />
                                            <span>ประวัติการบันทึกงานรายวันของ {selectedStudent.name} ({filteredLogs.length})</span>
                                        </h3>

                                        {/* Status Filter */}
                                        <div className="flex items-center space-x-1 bg-white border border-slate-200 rounded-xl p-1 text-xs">
                                            <button
                                                onClick={() => setFilterStatus('all')}
                                                className={`px-3 py-1 rounded-lg font-medium transition ${
                                                    filterStatus === 'all' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:text-slate-900'
                                                }`}
                                            >
                                                ทั้งหมด ({dailyLogs.length})
                                            </button>
                                            <button
                                                onClick={() => setFilterStatus('pending')}
                                                className={`px-3 py-1 rounded-lg font-medium transition ${
                                                    filterStatus === 'pending' ? 'bg-amber-500 text-white' : 'text-slate-600 hover:text-amber-600'
                                                }`}
                                            >
                                                รอตรวจ ({stats.pending_count})
                                            </button>
                                            <button
                                                onClick={() => setFilterStatus('verified')}
                                                className={`px-3 py-1 rounded-lg font-medium transition ${
                                                    filterStatus === 'verified' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-emerald-600'
                                                }`}
                                            >
                                                ตรวจแล้ว ({stats.verified_count})
                                            </button>
                                        </div>
                                    </div>

                                    {/* Daily Log Cards List */}
                                    {filteredLogs.length === 0 ? (
                                        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 text-slate-400">
                                            <Calendar size={36} className="mx-auto mb-2 text-slate-300" />
                                            <p className="font-medium text-slate-600">ยังไม่มีบันทึกการปฏิบัติงานในตัวกรองนี้</p>
                                        </div>
                                    ) : (
                                        filteredLogs.map((log) => (
                                            <DailyLogCard 
                                                key={log.id} 
                                                log={log} 
                                                isInstructorView={true} 
                                                onVerify={() => handleOpenVerifyModal(log)} 
                                            />
                                        ))
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-400">
                                <User size={48} className="mx-auto mb-3 text-slate-300" />
                                <h3 className="font-prompt font-bold text-slate-700 text-lg">กรุณาเลือกนักศึกษาจากรายชื่อด้านซ้าย</h3>
                                <p className="text-xs text-slate-500 mt-1">คลิกเลือกนักศึกษาเพื่อตรวจสอบประวัติการบันทึกงานประจำวันและการนิเทศก์</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* ================= STUDENT VIEW: PERSONAL LOGBOOK & STATS ================= */
                <div className="space-y-6">
                    {/* Active Internship Info Banner */}
                    {activeApplication ? (
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex items-center space-x-3.5">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg shadow-sm">
                                        <Building2 size={24} />
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 font-medium">สถานที่ฝึกประสบการณ์วิชาชีพปัจจุบัน</div>
                                        <h2 className="text-lg font-bold font-prompt text-slate-900 leading-snug">
                                            {activeApplication.company?.name || 'สถานประกอบการ'}
                                        </h2>
                                        <div className="text-xs text-slate-600 mt-0.5">
                                            ตำแหน่ง: <span className="font-semibold text-slate-800">{activeApplication.position_title}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <span className={`text-xs px-3 py-1.5 rounded-full font-semibold border ${activeApplication.status_badge_color}`}>
                                        {activeApplication.status_label}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-amber-800 text-xs flex items-center space-x-3">
                            <AlertCircle size={20} className="flex-shrink-0 text-amber-600" />
                            <span>
                                คุณยังไม่มีคำขอฝึกงานที่ได้รับการอนุมัติอย่างเป็นทางการ แต่ยังสามารถทดลองบันทึกกิจกรรมประจำวันล่วงหน้าเพื่อเตรียมพร้อมได้
                            </span>
                        </div>
                    )}

                    {/* Personal Hours Metrics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
                            <div className="text-xs text-slate-500 font-medium">ชั่วโมงปฏิบัติงานสะสม</div>
                            <div className="text-3xl font-extrabold font-prompt text-blue-600 mt-1">
                                {stats.total_hours} <span className="text-sm font-normal text-slate-500">/ 400 ชม.</span>
                            </div>
                            <div className="mt-3">
                                <div className="flex justify-between text-xs text-slate-500 mb-1">
                                    <span>ความคืบหน้า</span>
                                    <span className="font-semibold text-blue-600">{stats.progress_percentage}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                    <div 
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2.5 rounded-full transition-all duration-500" 
                                        style={{ width: `${stats.progress_percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                            <div className="text-xs text-slate-500 font-medium">จำนวนวันที่บันทึกแล้ว</div>
                            <div className="text-3xl font-extrabold font-prompt text-slate-800 mt-1">
                                {stats.total_days} <span className="text-sm font-normal text-slate-500">วัน</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-3">
                                ขาดอีก <strong className="text-slate-800">{stats.remaining_hours}</strong> ชั่วโมง จะครบเกณฑ์ 400 ชั่วโมง
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                            <div className="text-xs text-emerald-700 font-medium">อาจารย์ตรวจรับรองแล้ว</div>
                            <div className="text-3xl font-extrabold font-prompt text-emerald-600 mt-1">
                                {stats.verified_count} <span className="text-sm font-normal text-slate-500">รายการ</span>
                            </div>
                            <p className="text-xs text-emerald-600/90 mt-3 flex items-center space-x-1">
                                <CheckCircle2 size={14} />
                                <span>ผ่านการตรวจและบันทึกข้อเสนอแนะแล้ว</span>
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                            <div className="text-xs text-amber-700 font-medium">รออาจารย์ตรวจรับรอง</div>
                            <div className="text-3xl font-extrabold font-prompt text-amber-600 mt-1">
                                {stats.pending_count} <span className="text-sm font-normal text-slate-500">รายการ</span>
                            </div>
                            <p className="text-xs text-amber-700/90 mt-3 flex items-center space-x-1">
                                <Clock3 size={14} />
                                <span>อยู่ระหว่างรออาจารย์นิเทศก์ตรวจสอบ</span>
                            </p>
                        </div>
                    </div>

                    {/* Timeline & Filter Section */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
                            <div>
                                <h3 className="text-lg font-bold font-prompt text-slate-900 flex items-center space-x-2">
                                    <BookOpen size={20} className="text-blue-600" />
                                    <span>ประวัติการบันทึกย้อนหลัง (Timeline History)</span>
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    ดูประวัติการทำงาน ย้อนหลัง ทบทวนสิ่งที่เรียนรู้ และข้อเสนอแนะจากอาจารย์
                                </p>
                            </div>

                            {/* Filters */}
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="relative">
                                    <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="ค้นหางาน, Tech Stack..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sarabun"
                                    />
                                </div>

                                <div className="flex items-center space-x-1 bg-slate-50 border border-slate-200 rounded-xl p-1 text-xs">
                                    <button
                                        onClick={() => setFilterStatus('all')}
                                        className={`px-3 py-1 rounded-lg font-medium transition ${
                                            filterStatus === 'all' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        ทั้งหมด
                                    </button>
                                    <button
                                        onClick={() => setFilterStatus('verified')}
                                        className={`px-3 py-1 rounded-lg font-medium transition ${
                                            filterStatus === 'verified' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-emerald-600'
                                        }`}
                                    >
                                        ตรวจแล้ว
                                    </button>
                                    <button
                                        onClick={() => setFilterStatus('pending')}
                                        className={`px-3 py-1 rounded-lg font-medium transition ${
                                            filterStatus === 'pending' ? 'bg-amber-500 text-white' : 'text-slate-600 hover:text-amber-600'
                                        }`}
                                    >
                                        รอตรวจ
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* List of Student's Daily Logs */}
                        {filteredLogs.length === 0 ? (
                            <div className="py-12 text-center text-slate-400">
                                <Calendar size={44} className="mx-auto mb-3 text-slate-300" />
                                <h4 className="font-prompt font-semibold text-slate-700 text-base">ยังไม่มีรายการบันทึกการปฏิบัติงาน</h4>
                                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                                    เริ่มต้นบันทึกการทำงานวันแรกของคุณเพื่อสะสมชั่วโมงและรับคำแนะนำจากอาจารย์นิเทศก์
                                </p>
                                <button
                                    onClick={handleOpenCreateModal}
                                    className="mt-4 inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
                                >
                                    <Plus size={16} />
                                    <span>+ เริ่มบันทึกงานวันนี้</span>
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredLogs.map((log) => (
                                    <DailyLogCard 
                                        key={log.id} 
                                        log={log} 
                                        isInstructorView={false} 
                                        onEdit={() => handleOpenEditModal(log)}
                                        onDelete={() => handleDeleteLog(log.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ================= MODAL: STUDENT CREATE/EDIT DAILY LOG ================= */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-scale-up max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center space-x-2 text-blue-600">
                                <Clock size={20} />
                                <h3 className="font-prompt font-bold text-slate-900 text-lg">
                                    {editingLog ? 'แก้ไขบันทึกการปฏิบัติงาน' : 'บันทึกการปฏิบัติงานประจำวัน'}
                                </h3>
                            </div>
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleLogSubmit} className="mt-4 space-y-4">
                            {/* Date and Time Fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                        วันที่ปฏิบัติงาน <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={logForm.data.log_date}
                                        onChange={(e) => logForm.setData('log_date', e.target.value)}
                                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {logForm.errors.log_date && (
                                        <p className="text-[11px] text-rose-500 mt-1">{logForm.errors.log_date}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                        เวลาเข้างาน
                                    </label>
                                    <input
                                        type="time"
                                        required
                                        value={logForm.data.check_in_time}
                                        onChange={(e) => logForm.setData('check_in_time', e.target.value)}
                                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                        เวลาเลิกงาน
                                    </label>
                                    <input
                                        type="time"
                                        required
                                        value={logForm.data.check_out_time}
                                        onChange={(e) => logForm.setData('check_out_time', e.target.value)}
                                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Hours and Tech Stack */}
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                        จำนวนชั่วโมง <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.5"
                                        min="0.5"
                                        max="24"
                                        required
                                        value={logForm.data.work_hours}
                                        onChange={(e) => logForm.setData('work_hours', e.target.value)}
                                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {logForm.errors.work_hours && (
                                        <p className="text-[11px] text-rose-500 mt-1">{logForm.errors.work_hours}</p>
                                    )}
                                </div>

                                <div className="sm:col-span-3">
                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                        เครื่องมือ / เทคโนโลยีที่ใช้ (Tech Stack Tags คั่นด้วยจุลภาค)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="เช่น Laravel 11, React, Tailwind CSS, Docker, Git"
                                        value={logForm.data.tech_stack}
                                        onChange={(e) => logForm.setData('tech_stack', e.target.value)}
                                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Task Title */}
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                    หัวข้องานที่ได้รับมอบหมาย <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="เช่น พัฒนาระบบยืนยันตัวตน (Authentication) และเชื่อมต่อ RESTful API"
                                    value={logForm.data.task_title}
                                    onChange={(e) => logForm.setData('task_title', e.target.value)}
                                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {logForm.errors.task_title && (
                                    <p className="text-[11px] text-rose-500 mt-1">{logForm.errors.task_title}</p>
                                )}
                            </div>

                            {/* Task Description */}
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                    รายละเอียดการปฏิบัติงานจริง <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    required
                                    rows="3"
                                    placeholder="อธิบายขั้นตอนการทำงาน วิธีการ ขั้นตอนที่ลงมือปฏิบัติ..."
                                    value={logForm.data.task_description}
                                    onChange={(e) => logForm.setData('task_description', e.target.value)}
                                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                ></textarea>
                                {logForm.errors.task_description && (
                                    <p className="text-[11px] text-rose-500 mt-1">{logForm.errors.task_description}</p>
                                )}
                            </div>

                            {/* Problems & Solutions (2 Columns) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                        ปัญหาและอุปสรรคที่พบ
                                    </label>
                                    <textarea
                                        rows="2"
                                        placeholder="เช่น เกิดข้อผิดพลาด CORS error เมื่อเชื่อมต่อ Frontend กับ Backend"
                                        value={logForm.data.problems_encountered}
                                        onChange={(e) => logForm.setData('problems_encountered', e.target.value)}
                                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                        วิธีการแก้ไขปัญหา
                                    </label>
                                    <textarea
                                        rows="2"
                                        placeholder="เช่น ปรับตั้งค่า config/cors.php และระบุ Allowed Origins ให้ถูกต้อง"
                                        value={logForm.data.solutions_applied}
                                        onChange={(e) => logForm.setData('solutions_applied', e.target.value)}
                                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    ></textarea>
                                </div>
                            </div>

                            {/* Learning Outcome */}
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                    สิ่งที่ได้เรียนรู้ใหม่ (Learning Outcome)
                                </label>
                                <textarea
                                    rows="2"
                                    placeholder="เช่น เข้าใจหลักการทำงานของ HTTP Headers และการจัดการ State ใน React ได้ดียิ่งขึ้น"
                                    value={logForm.data.learning_outcome}
                                    onChange={(e) => logForm.setData('learning_outcome', e.target.value)}
                                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                ></textarea>
                            </div>

                            {/* Modal Actions */}
                            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    disabled={logForm.processing}
                                    className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition disabled:opacity-50"
                                >
                                    {logForm.processing ? 'กำลังบันทึก...' : (editingLog ? 'บันทึกการแก้ไข' : 'บันทึกข้อมูล')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ================= MODAL: INSTRUCTOR VERIFY & FEEDBACK ================= */}
            {verifyingLog && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scale-up">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center space-x-2 text-emerald-600">
                                <UserCheck size={22} />
                                <h3 className="font-prompt font-bold text-slate-900 text-lg">
                                    ตรวจรับรองและให้คำแนะนำแก่นักศึกษา
                                </h3>
                            </div>
                            <button
                                onClick={() => setVerifyingLog(null)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="my-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                            <div className="font-semibold text-slate-800">{verifyingLog.task_title}</div>
                            <div className="text-slate-500 mt-0.5">
                                {verifyingLog.formatted_date} ({verifyingLog.work_hours} ชม.)
                            </div>
                        </div>

                        <form onSubmit={handleVerifySubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-2">
                                    สถานะการตรวจรับรอง
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => verifyForm.setData('is_verified', true)}
                                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition ${
                                            verifyForm.data.is_verified 
                                                ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20' 
                                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        <CheckCircle2 size={16} className="text-emerald-600" />
                                        <span>ตรวจรับรองแล้ว (Approve)</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => verifyForm.setData('is_verified', false)}
                                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition ${
                                            !verifyForm.data.is_verified 
                                                ? 'bg-amber-50 border-amber-500 text-amber-800 ring-2 ring-amber-500/20' 
                                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        <Clock3 size={16} className="text-amber-600" />
                                        <span>รอการปรับปรุง / ยังไม่รับรอง</span>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                    ข้อคิดเห็น / คำแนะนำทางวิชาการและการปฏิบัติงานของอาจารย์
                                </label>
                                <textarea
                                    rows="4"
                                    placeholder="ระบุคำแนะนำ ข้อเสนอแนะ หรือคำชมเชย เพื่อให้นักศึกษานำไปพัฒนาทักษะวิชาชีพคอมพิวเตอร์..."
                                    value={verifyForm.data.instructor_comment}
                                    onChange={(e) => verifyForm.setData('instructor_comment', e.target.value)}
                                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sarabun"
                                ></textarea>
                            </div>

                            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setVerifyingLog(null)}
                                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    disabled={verifyForm.processing}
                                    className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition disabled:opacity-50 flex items-center space-x-1.5"
                                >
                                    <Check size={16} />
                                    <span>{verifyForm.processing ? 'กำลังบันทึก...' : 'ยืนยันผลการตรวจรับรอง'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}

/**
 * Subcomponent: Individual Daily Log Card
 */
function DailyLogCard({ log, isInstructorView, onVerify, onEdit, onDelete }) {
    const isVerified = log.is_verified;

    return (
        <div className={`bg-white rounded-2xl border transition-all overflow-hidden ${
            isVerified ? 'border-slate-200 hover:border-slate-300' : 'border-amber-200 bg-amber-50/20'
        }`}>
            {/* Top Bar: Date, Times, Hours, Badge */}
            <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center space-x-2.5">
                    <div className="flex items-center space-x-1.5 font-bold font-prompt text-slate-800">
                        <Calendar size={15} className="text-blue-600" />
                        <span>{log.formatted_date || log.log_date}</span>
                    </div>

                    <div className="hidden sm:flex items-center space-x-1 text-slate-500">
                        <Clock size={14} />
                        <span>{log.check_in_time} - {log.check_out_time} น.</span>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                        {log.work_hours} ชั่วโมง
                    </span>
                </div>

                <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 rounded-full font-medium border text-xs flex items-center space-x-1 ${log.status_badge.color}`}>
                        {isVerified ? <CheckCircle2 size={13} /> : <Clock3 size={13} />}
                        <span>{log.status_badge.text}</span>
                    </span>

                    {/* Student Edit/Delete Controls */}
                    {!isInstructorView && !isVerified && (
                        <div className="flex items-center space-x-1 ml-2">
                            <button
                                onClick={onEdit}
                                title="แก้ไขบันทึก"
                                className="p-1 rounded-md text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                            >
                                <Edit3 size={15} />
                            </button>
                            <button
                                onClick={onDelete}
                                title="ลบบันทึก"
                                className="p-1 rounded-md text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                            >
                                <Trash2 size={15} />
                            </button>
                        </div>
                    )}

                    {/* Instructor Verify Action Button */}
                    {isInstructorView && (
                        <button
                            onClick={onVerify}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 transition ${
                                isVerified 
                                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' 
                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20'
                            }`}
                        >
                            <UserCheck size={14} />
                            <span>{isVerified ? 'แก้ไขผลการตรวจ' : 'ตรวจรับรอง & ให้คำแนะนำ'}</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Body Content */}
            <div className="p-5 space-y-3.5">
                <div>
                    <h4 className="text-base font-bold font-prompt text-slate-900 leading-snug">
                        {log.task_title}
                    </h4>
                    <p className="text-xs text-slate-700 mt-1 whitespace-pre-line leading-relaxed">
                        {log.task_description}
                    </p>
                </div>

                {/* Tech Stack Pills */}
                {log.tech_tags && log.tech_tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <Code size={14} className="text-slate-400 mr-1" />
                        {log.tech_tags.map((tech, idx) => (
                            <span 
                                key={idx} 
                                className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                )}

                {/* Problems & Solutions */}
                {(log.problems_encountered || log.solutions_applied) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                        {log.problems_encountered && (
                            <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100 text-rose-900">
                                <div className="font-semibold text-rose-700 flex items-center space-x-1.5 mb-1">
                                    <AlertCircle size={14} />
                                    <span>ปัญหาและอุปสรรค:</span>
                                </div>
                                <p className="leading-relaxed">{log.problems_encountered}</p>
                            </div>
                        )}

                        {log.solutions_applied && (
                            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-emerald-900">
                                <div className="font-semibold text-emerald-700 flex items-center space-x-1.5 mb-1">
                                    <Wrench size={14} />
                                    <span>วิธีการแก้ไข:</span>
                                </div>
                                <p className="leading-relaxed">{log.solutions_applied}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Learning Outcome */}
                {log.learning_outcome && (
                    <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-900">
                        <div className="font-semibold text-indigo-700 flex items-center space-x-1.5 mb-0.5">
                            <Sparkles size={14} />
                            <span>สิ่งที่ได้เรียนรู้ใหม่:</span>
                        </div>
                        <p className="leading-relaxed">{log.learning_outcome}</p>
                    </div>
                )}

                {/* Teacher Feedback / Verification Box */}
                {isVerified && (
                    <div className="mt-4 pt-3 border-t border-slate-100 bg-gradient-to-r from-emerald-50/60 to-teal-50/40 rounded-xl p-3.5 border border-emerald-100 text-xs">
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center space-x-2 text-emerald-800 font-semibold">
                                <UserCheck size={16} className="text-emerald-600" />
                                <span>ความคิดเห็นและคำแนะนำจากอาจารย์นิเทศก์</span>
                            </div>
                            <span className="text-[11px] text-emerald-600">
                                ตรวจเมื่อ: {log.verified_at ? new Date(log.verified_at).toLocaleDateString('th-TH') : 'รับรองแล้ว'}
                            </span>
                        </div>
                        <p className="text-slate-700 italic leading-relaxed pl-5 border-l-2 border-emerald-400 my-1">
                            "{log.instructor_comment || 'อาจารย์ได้ตรวจรับรองการปฏิบัติงานในวันนี้เรียบร้อยแล้ว การปฏิบัติงานเป็นไปตามเกณฑ์มาตรฐาน'}"
                        </p>
                        {log.verifier && (
                            <div className="text-right text-[11px] text-emerald-800 font-medium mt-1">
                                — {log.verifier.name}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
