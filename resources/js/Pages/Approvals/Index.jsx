import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { 
    CheckSquare, 
    FileText, 
    CheckCircle2, 
    XCircle, 
    RotateCcw, 
    Eye, 
    AlertCircle, 
    Building2, 
    Calendar, 
    User, 
    X,
    ExternalLink
} from 'lucide-react';

export default function ApprovalsIndex({ stage1Applications, stage2Applications, historyApplications, isInstructor, isChair }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [activeTab, setActiveTab] = useState(isInstructor && !isChair ? 'stage1' : isChair ? 'stage2' : 'stage1');
    const [selectedApp, setSelectedApp] = useState(null);
    const [reviewStage, setReviewStage] = useState(1); // 1 = Instructor, 2 = Chair

    const { data, setData, post, processing, reset, errors } = useForm({
        action: 'approved',
        remarks: '',
    });

    const openReviewModal = (app, stage) => {
        setSelectedApp(app);
        setReviewStage(stage);
        setData({
            action: 'approved',
            remarks: stage === 1 
                ? 'อาจารย์ผู้รับผิดชอบรายวิชาตรวจสอบเอกสารครบถ้วนแล้ว เห็นชอบส่งต่อประธานหลักสูตร'
                : 'ประธานหลักสูตรอนุมัติสถานที่ฝึกประสบการณ์วิชาชีพเรียบร้อยแล้ว',
        });
    };

    const closeReviewModal = () => {
        setSelectedApp(null);
        reset();
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        const endpoint = reviewStage === 1 
            ? `/approvals/${selectedApp.id}/stage1` 
            : `/approvals/${selectedApp.id}/stage2`;

        post(endpoint, {
            onSuccess: () => {
                closeReviewModal();
            },
        });
    };

    return (
        <AppLayout>
            <Head title="พิจารณาอนุมัติสถานที่ฝึกงาน (2 ขั้นตอน)" />

            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-prompt text-slate-900 flex items-center space-x-2">
                        <CheckSquare className="text-blue-600" size={26} />
                        <span>ระบบพิจารณาอนุมัติคำขอฝึกประสบการณ์วิชาชีพ (2 ลำดับขั้น)</span>
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        ลำดับขั้นที่ 1: อาจารย์ผู้รับผิดชอบรายวิชา &rarr; ลำดับขั้นที่ 2: ประธานหลักสูตร
                    </p>
                </div>
            </div>

            {/* Stage Tabs */}
            <div className="flex border-b border-slate-200 mb-6 bg-white p-1 rounded-2xl shadow-xs">
                <button
                    onClick={() => setActiveTab('stage1')}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold font-prompt transition flex items-center justify-center space-x-2 ${
                        activeTab === 'stage1' 
                            ? 'bg-amber-500 text-white shadow-sm' 
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                >
                    <span>1. รออาจารย์ตรวจ (ขั้นที่ 1)</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'stage1' ? 'bg-amber-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                        {stage1Applications.length}
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('stage2')}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold font-prompt transition flex items-center justify-center space-x-2 ${
                        activeTab === 'stage2' 
                            ? 'bg-blue-600 text-white shadow-sm' 
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                >
                    <span>2. รอประธานหลักสูตรตรวจ (ขั้นที่ 2)</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'stage2' ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
                        {stage2Applications.length}
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold font-prompt transition flex items-center justify-center space-x-2 ${
                        activeTab === 'history' 
                            ? 'bg-slate-800 text-white shadow-sm' 
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                >
                    <span>ประวัติที่พิจารณาแล้ว</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'history' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'}`}>
                        {historyApplications.length}
                    </span>
                </button>
            </div>

            {/* TAB 1: Stage 1 Applications */}
            {activeTab === 'stage1' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 bg-amber-50/50 border-b border-amber-100 text-xs text-amber-900 flex items-center space-x-2">
                        <AlertCircle size={16} className="text-amber-600 flex-shrink-0" />
                        <span>คำขอในขั้นตอนนี้ต้องได้รับการตรวจสอบคุณสมบัติและเอกสารโดย <strong>อาจารย์ผู้รับผิดชอบรายวิชา</strong> ก่อนส่งต่อให้ประธานหลักสูตร</span>
                    </div>

                    {stage1Applications.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                            {stage1Applications.map((app) => (
                                <div key={app.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition">
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-bold text-base text-slate-900 font-prompt">
                                                {app.user?.name}
                                            </span>
                                            <span className="text-xs text-slate-500 font-medium">
                                                รหัส {app.user?.student_id}
                                            </span>
                                            <span className="text-xs px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full font-medium">
                                                {app.user?.curriculum?.name}
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                            <span><strong>หน่วยงาน:</strong> {app.company?.name} ({app.company?.province})</span>
                                            <span><strong>ตำแหน่ง:</strong> {app.position_title}</span>
                                            <span><strong>ผู้ประสานงาน:</strong> {app.coordinator_name} ({app.coordinator_phone})</span>
                                        </div>
                                        <div className="text-xs text-slate-500 flex items-center space-x-3 mt-1">
                                            <span>วันที่ฝึก: {new Date(app.start_date).toLocaleDateString('th-TH')} - {new Date(app.end_date).toLocaleDateString('th-TH')}</span>
                                            <span>• แนบเอกสาร {app.documents?.length || 0} ฉบับ</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Link
                                            href={`/applications/${app.id}`}
                                            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition font-prompt"
                                        >
                                            ตรวจสอบเอกสาร
                                        </Link>
                                        <button
                                            onClick={() => openReviewModal(app, 1)}
                                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-xl transition font-prompt shadow-sm flex items-center space-x-1.5"
                                        >
                                            <CheckSquare size={16} />
                                            <span>พิจารณาขั้นที่ 1</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-slate-400 text-sm">
                            ไม่มีคำขอที่รอการตรวจสอบในลำดับขั้นที่ 1
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: Stage 2 Applications */}
            {activeTab === 'stage2' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 bg-blue-50/50 border-b border-blue-100 text-xs text-blue-900 flex items-center space-x-2">
                        <CheckCircle2 size={16} className="text-blue-600 flex-shrink-0" />
                        <span>คำขอในขั้นตอนนี้ผ่านการตรวจสอบขั้นที่ 1 แล้ว รอการพิจารณาอนุมัติขั้นสุดท้ายจาก <strong>ประธานหลักสูตร</strong></span>
                    </div>

                    {stage2Applications.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                            {stage2Applications.map((app) => (
                                <div key={app.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition">
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-bold text-base text-slate-900 font-prompt">
                                                {app.user?.name}
                                            </span>
                                            <span className="text-xs text-slate-500 font-medium">
                                                รหัส {app.user?.student_id}
                                            </span>
                                            <span className="text-xs px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-medium">
                                                ผ่านขั้นที่ 1 แล้ว
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                            <span><strong>หน่วยงาน:</strong> {app.company?.name}</span>
                                            <span><strong>ตำแหน่ง:</strong> {app.position_title}</span>
                                        </div>
                                        {app.latest_remarks && (
                                            <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-1">
                                                <strong>ความเห็นอาจารย์ขั้นที่ 1:</strong> {app.latest_remarks}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Link
                                            href={`/applications/${app.id}`}
                                            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition font-prompt"
                                        >
                                            ดูเอกสารทั้งหมด
                                        </Link>
                                        <button
                                            onClick={() => openReviewModal(app, 2)}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition font-prompt shadow-sm flex items-center space-x-1.5"
                                        >
                                            <CheckCircle2 size={16} />
                                            <span>พิจารณาอนุมัติขั้นสุดท้าย</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-slate-400 text-sm">
                            ไม่มีคำขอที่รอการพิจารณาในลำดับขั้นที่ 2
                        </div>
                    )}
                </div>
            )}

            {/* TAB 3: History */}
            {activeTab === 'history' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="divide-y divide-slate-100">
                        {historyApplications.map((app) => (
                            <div key={app.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-semibold text-sm text-slate-900 font-prompt">{app.user?.name}</span>
                                        <span className="text-xs text-slate-500">({app.company?.name})</span>
                                    </div>
                                    <div className="text-xs text-slate-500 mt-0.5">
                                        ตำแหน่ง: {app.position_title} • อัปเดตล่าสุด: {new Date(app.updated_at).toLocaleDateString('th-TH')}
                                    </div>
                                    {app.latest_remarks && (
                                        <div className="text-xs text-slate-600 italic mt-1">"{app.latest_remarks}"</div>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${app.status_badge_color}`}>
                                        {app.status_label}
                                    </span>
                                    <Link href={`/applications/${app.id}`} className="p-2 text-slate-400 hover:text-blue-600">
                                        <Eye size={18} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ACTION MODAL DIALOG */}
            {selectedApp && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative animate-scale-up">
                        <button
                            onClick={closeReviewModal}
                            className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-4">
                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-prompt">
                                {reviewStage === 1 ? 'การพิจารณาขั้นที่ 1 (อาจารย์)' : 'การพิจารณาขั้นที่ 2 (ประธานหลักสูตร)'}
                            </span>
                            <h3 className="text-lg font-bold text-slate-900 font-prompt mt-2">
                                พิจารณาคำขอของ: {selectedApp.user?.name}
                            </h3>
                            <p className="text-xs text-slate-500">
                                สถานประกอบการ: {selectedApp.company?.name} (ตำแหน่ง {selectedApp.position_title})
                            </p>
                        </div>

                        {/* Documents check snippet */}
                        <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                            <span className="font-semibold text-slate-700 font-prompt block mb-1.5">
                                รายการเอกสารที่แนบมา ({selectedApp.documents?.length || 0} ไฟล์):
                            </span>
                            <div className="space-y-1">
                                {selectedApp.documents?.map((doc) => (
                                    <div key={doc.id} className="flex items-center justify-between text-slate-600">
                                        <span>• {doc.title} ({doc.original_name})</span>
                                        <a
                                            href={`/storage/${doc.file_path}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-blue-600 hover:underline flex items-center space-x-1"
                                        >
                                            <span>เปิดดู</span>
                                            <ExternalLink size={12} />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 font-prompt mb-2">
                                    ผลการพิจารณา (Action):
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    <label className={`flex flex-col items-center justify-center p-3 border rounded-xl cursor-pointer text-xs transition text-center ${
                                        data.action === 'approved' 
                                            ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold shadow-2xs' 
                                            : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                                    }`}>
                                        <input
                                            type="radio"
                                            name="action"
                                            value="approved"
                                            checked={data.action === 'approved'}
                                            onChange={(e) => setData('action', e.target.value)}
                                            className="sr-only"
                                        />
                                        <CheckCircle2 size={20} className="mb-1 text-emerald-600" />
                                        <span>{reviewStage === 1 ? 'อนุมัติส่งต่อขั้น 2' : 'อนุมัติขั้นสุดท้าย'}</span>
                                    </label>

                                    <label className={`flex flex-col items-center justify-center p-3 border rounded-xl cursor-pointer text-xs transition text-center ${
                                        data.action === 'revision_requested' 
                                            ? 'border-amber-500 bg-amber-50 text-amber-800 font-bold shadow-2xs' 
                                            : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                                    }`}>
                                        <input
                                            type="radio"
                                            name="action"
                                            value="revision_requested"
                                            checked={data.action === 'revision_requested'}
                                            onChange={(e) => setData('action', e.target.value)}
                                            className="sr-only"
                                        />
                                        <RotateCcw size={20} className="mb-1 text-amber-600" />
                                        <span>ส่งกลับแก้ไข</span>
                                    </label>

                                    <label className={`flex flex-col items-center justify-center p-3 border rounded-xl cursor-pointer text-xs transition text-center ${
                                        data.action === 'rejected' 
                                            ? 'border-rose-500 bg-rose-50 text-rose-800 font-bold shadow-2xs' 
                                            : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                                    }`}>
                                        <input
                                            type="radio"
                                            name="action"
                                            value="rejected"
                                            checked={data.action === 'rejected'}
                                            onChange={(e) => setData('action', e.target.value)}
                                            className="sr-only"
                                        />
                                        <XCircle size={20} className="mb-1 text-rose-600" />
                                        <span>ไม่อนุมัติ</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 font-prompt mb-1">
                                    ข้อคิดเห็น / คำแนะนำถึงนักศึกษา (Remarks):
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.remarks}
                                    onChange={(e) => setData('remarks', e.target.value)}
                                    placeholder="ระบุข้อคิดเห็น เหตุผล หรือสิ่งที่ต้องการให้นักศึกษาแก้ไขเพิ่มเติม..."
                                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                                {errors.remarks && <p className="text-xs text-rose-600 mt-1">{errors.remarks}</p>}
                            </div>

                            <div className="flex justify-end space-x-2 pt-2">
                                <button
                                    type="button"
                                    onClick={closeReviewModal}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl font-prompt"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl font-prompt shadow-md transition disabled:opacity-50"
                                >
                                    บันทึกผลการพิจารณา
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
