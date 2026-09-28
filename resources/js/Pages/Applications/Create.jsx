import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { 
    Send, 
    Save, 
    Upload, 
    Building2, 
    User, 
    Calendar, 
    Briefcase, 
    FileText, 
    ArrowLeft, 
    Info, 
    CheckCircle2 
} from 'lucide-react';

export default function ApplicationCreate({ companies, curriculums, user }) {
    const { data, setData, post, processing, errors } = useForm({
        company_id: companies[0]?.id || '',
        position_title: 'Full-Stack Developer Intern',
        job_description: 'พัฒนาและดูแลระบบเว็บแอปพลิเคชัน ออกแบบฐานข้อมูล และเชื่อมต่อ RESTful API',
        start_date: '2026-11-01',
        end_date: '2027-02-28',
        coordinator_name: 'คุณกิตติศักดิ์ พัฒนกิจ',
        coordinator_position: 'หัวหน้าฝ่ายพัฒนาซอฟต์แวร์ / HR',
        coordinator_phone: '081-999-8877',
        coordinator_email: 'contact@company.co.th',
        student_notes: 'ผ่านการสัมภาษณ์เบื้องต้นแล้ว มีความสนใจพัฒนาเว็บด้วย Laravel และ React',
        submit_now: true,
        resume_file: null,
        acceptance_file: null,
        consent_file: null,
    });

    const selectedCompany = companies.find(c => c.id === parseInt(data.company_id));

    const handleSubmit = (submitNow) => {
        data.submit_now = submitNow;
        post('/applications', {
            forceFormData: true,
        });
    };

    return (
        <AppLayout>
            <Head title="ยื่นคำขออนุมัติสถานที่ฝึกงาน" />

            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link
                        href="/applications"
                        className="inline-flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-800 font-prompt mb-2 transition"
                    >
                        <ArrowLeft size={16} />
                        <span>ย้อนกลับไปรายการคำขอ</span>
                    </Link>
                    <h1 className="text-2xl font-bold font-prompt text-slate-900">
                        ยื่นขออนุมัติสถานที่เตรียมฝึกประสบการณ์วิชาชีพ
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        กรอกข้อมูลสถานประกอบการ รายละเอียดงาน และแนบเอกสารเพื่อเสนอให้อาจารย์ผู้รับผิดชอบรายวิชาพิจารณา (ขั้นที่ 1)
                    </p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(true); }} className="space-y-6">
                    {/* Student Info Card (Readonly) */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                        <div className="flex items-center space-x-2 pb-3 mb-3 border-b border-slate-100">
                            <User size={18} className="text-blue-600" />
                            <h3 className="font-prompt font-bold text-sm text-slate-800">1. ข้อมูลนักศึกษาผู้ยื่นคำขอ</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                            <div>
                                <span className="text-slate-400 block">ชื่อ-นามสกุล:</span>
                                <span className="font-semibold text-slate-800 font-prompt text-sm">{user.name}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block">รหัสนักศึกษา:</span>
                                <span className="font-semibold text-slate-800 font-prompt text-sm">{user.student_id}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block">หลักสูตร:</span>
                                <span className="font-semibold text-slate-800">{user.curriculum?.name || 'สาขาวิชาคอมพิวเตอร์'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Workplace Info */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                        <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
                            <Building2 size={18} className="text-blue-600" />
                            <h3 className="font-prompt font-bold text-sm text-slate-800">2. ข้อมูลสถานประกอบการและตำแหน่งงาน</h3>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 font-prompt mb-1">
                                เลือกสถานประกอบการ/หน่วยงาน *
                            </label>
                            <select
                                value={data.company_id}
                                onChange={(e) => setData('company_id', e.target.value)}
                                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                required
                            >
                                {companies.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name} {c.province ? `(${c.province})` : ''} - รับ {c.max_trainees} คน {c.has_allowance ? `(มีเบี้ยเลี้ยง ${c.allowance_amount} บ.)` : ''}
                                    </option>
                                ))}
                            </select>
                            {errors.company_id && <p className="text-xs text-rose-600 mt-1">{errors.company_id}</p>}
                        </div>

                        {selectedCompany && (
                            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-slate-600">
                                <div><strong>ประเภทธุรกิจ:</strong> {selectedCompany.business_type}</div>
                                <div><strong>ที่อยู่:</strong> {selectedCompany.address || selectedCompany.province}</div>
                                {selectedCompany.website && (
                                    <div><strong>เว็บไซต์:</strong> <a href={selectedCompany.website} target="_blank" className="text-blue-600 underline" rel="noreferrer">{selectedCompany.website}</a></div>
                                )}
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 font-prompt mb-1">
                                    ตำแหน่งงานที่ขอฝึกงาน *
                                </label>
                                <input
                                    type="text"
                                    placeholder="เช่น Web Developer, Network Support, Data Analyst"
                                    value={data.position_title}
                                    onChange={(e) => setData('position_title', e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                    required
                                />
                                {errors.position_title && <p className="text-xs text-rose-600 mt-1">{errors.position_title}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 font-prompt mb-1">
                                        วันที่เริ่มฝึกงาน *
                                    </label>
                                    <input
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 font-prompt mb-1">
                                        วันที่สิ้นสุด *
                                    </label>
                                    <input
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 font-prompt mb-1">
                                ลักษณะงานหรือรายละเอียดงานที่ได้รับมอบหมาย
                            </label>
                            <textarea
                                rows={3}
                                placeholder="ระบุภาระงาน เช่น การพัฒนาโมดูลด้วยภาษา... การดูแลระบบเครือข่าย..."
                                value={data.job_description}
                                onChange={(e) => setData('job_description', e.target.value)}
                                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white"
                            />
                        </div>
                    </div>

                    {/* Workplace Coordinator */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                        <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
                            <Briefcase size={18} className="text-blue-600" />
                            <h3 className="font-prompt font-bold text-sm text-slate-800">3. ผู้ประสานงานในสถานประกอบการ</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 font-prompt mb-1">
                                    ชื่อ-นามสกุล ผู้ประสานงาน/พี่เลี้ยง *
                                </label>
                                <input
                                    type="text"
                                    placeholder="เช่น คุณกิตติศักดิ์ พัฒนกิจ"
                                    value={data.coordinator_name}
                                    onChange={(e) => setData('coordinator_name', e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                    required
                                />
                                {errors.coordinator_name && <p className="text-xs text-rose-600 mt-1">{errors.coordinator_name}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 font-prompt mb-1">
                                    ตำแหน่งในสถานประกอบการ
                                </label>
                                <input
                                    type="text"
                                    placeholder="เช่น ผู้จัดการฝ่ายบุคคล / Lead Engineer"
                                    value={data.coordinator_position}
                                    onChange={(e) => setData('coordinator_position', e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 font-prompt mb-1">
                                    เบอร์โทรศัพท์ติดต่อ *
                                </label>
                                <input
                                    type="text"
                                    placeholder="เช่น 02-1234567, 081-2345678"
                                    value={data.coordinator_phone}
                                    onChange={(e) => setData('coordinator_phone', e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                    required
                                />
                                {errors.coordinator_phone && <p className="text-xs text-rose-600 mt-1">{errors.coordinator_phone}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 font-prompt mb-1">
                                    อีเมลผู้ประสานงาน
                                </label>
                                <input
                                    type="email"
                                    placeholder="hr@company.com"
                                    value={data.coordinator_email}
                                    onChange={(e) => setData('coordinator_email', e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Document Uploads */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                        <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
                            <Upload size={18} className="text-blue-600" />
                            <h3 className="font-prompt font-bold text-sm text-slate-800">4. แนบเอกสารประกอบการพิจารณา</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* File 1: Resume */}
                            <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-center">
                                <FileText size={28} className="mx-auto text-blue-600 mb-2" />
                                <span className="block font-semibold text-xs font-prompt text-slate-800">
                                    เรซูเม่ (Resume) *
                                </span>
                                <span className="block text-[11px] text-slate-400 mb-3">เฉพาะไฟล์ PDF (ไม่เกิน 10MB)</span>
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => setData('resume_file', e.target.files[0])}
                                    className="block w-full text-[11px] text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                {errors.resume_file && <p className="text-xs text-rose-600 mt-1">{errors.resume_file}</p>}
                            </div>

                            {/* File 2: Acceptance Letter */}
                            <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-center">
                                <FileText size={28} className="mx-auto text-indigo-600 mb-2" />
                                <span className="block font-semibold text-xs font-prompt text-slate-800">
                                    หนังสือตอบรับจากบริษัท
                                </span>
                                <span className="block text-[11px] text-slate-400 mb-3">ไฟล์ PDF หรือรูปภาพ (ถ้ามี)</span>
                                <input
                                    type="file"
                                    accept=".pdf,image/*"
                                    onChange={(e) => setData('acceptance_file', e.target.files[0])}
                                    className="block w-full text-[11px] text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                            </div>

                            {/* File 3: Parent Consent */}
                            <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-center">
                                <FileText size={28} className="mx-auto text-emerald-600 mb-2" />
                                <span className="block font-semibold text-xs font-prompt text-slate-800">
                                    หนังสือยินยอมจากผู้ปกครอง
                                </span>
                                <span className="block text-[11px] text-slate-400 mb-3">ไฟล์ PDF หรือรูปภาพ</span>
                                <input
                                    type="file"
                                    accept=".pdf,image/*"
                                    onChange={(e) => setData('consent_file', e.target.files[0])}
                                    className="block w-full text-[11px] text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 font-prompt mb-1">
                                บันทึกหรือหมายเหตุเพิ่มเติมจากนักศึกษา
                            </label>
                            <textarea
                                rows={2}
                                placeholder="หมายเหตุหรือข้อมูลที่ต้องการแจ้งอาจารย์ผู้ตรวจ..."
                                value={data.student_notes}
                                onChange={(e) => setData('student_notes', e.target.value)}
                                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            disabled={processing}
                            onClick={() => handleSubmit(false)}
                            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition font-prompt"
                        >
                            <Save size={16} />
                            <span>บันทึกแบบร่าง (Draft)</span>
                        </button>

                        <button
                            type="button"
                            disabled={processing}
                            onClick={() => handleSubmit(true)}
                            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition shadow-md font-prompt disabled:opacity-50"
                        >
                            <Send size={16} />
                            <span>ยื่นขออนุมัติให้อาจารย์ตรวจสอบ (ส่งเข้าขั้นที่ 1)</span>
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
