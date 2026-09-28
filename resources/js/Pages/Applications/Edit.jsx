import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Send, Save, ArrowLeft, Building2, Briefcase, FileText } from 'lucide-react';

export default function ApplicationEdit({ application, companies }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        company_id: application.company_id,
        position_title: application.position_title,
        job_description: application.job_description || '',
        start_date: application.start_date,
        end_date: application.end_date,
        coordinator_name: application.coordinator_name,
        coordinator_position: application.coordinator_position || '',
        coordinator_phone: application.coordinator_phone,
        coordinator_email: application.coordinator_email || '',
        student_notes: application.student_notes || '',
        submit_now: true,
        resume_file: null,
        acceptance_file: null,
        consent_file: null,
    });

    const handleSubmit = (submitNow) => {
        data.submit_now = submitNow;
        post(`/applications/${application.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout>
            <Head title="แก้ไขคำขออนุมัติสถานที่ฝึกงาน" />

            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link
                        href={`/applications/${application.id}`}
                        className="inline-flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-800 font-prompt mb-2 transition"
                    >
                        <ArrowLeft size={16} />
                        <span>ย้อนกลับไปรายละเอียดคำขอ</span>
                    </Link>
                    <h1 className="text-2xl font-bold font-prompt text-slate-900">
                        แก้ไขคำขออนุมัติสถานที่ฝึกงาน
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        ปรับปรุงข้อมูลหรือแนบเอกสารเพิ่มเติมตามคำแนะนำของผู้ตรวจ
                    </p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(true); }} className="space-y-6">
                    {/* Workplace Info */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                        <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
                            <Building2 size={18} className="text-blue-600" />
                            <h3 className="font-prompt font-bold text-sm text-slate-800">ข้อมูลสถานประกอบการและตำแหน่งงาน</h3>
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
                                        {c.name} {c.province ? `(${c.province})` : ''}
                                    </option>
                                ))}
                            </select>
                            {errors.company_id && <p className="text-xs text-rose-600 mt-1">{errors.company_id}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 font-prompt mb-1">
                                    ตำแหน่งงานที่ขอฝึกงาน *
                                </label>
                                <input
                                    type="text"
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
                                ลักษณะงานหรือรายละเอียดงาน
                            </label>
                            <textarea
                                rows={3}
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
                            <h3 className="font-prompt font-bold text-sm text-slate-800">ผู้ประสานงานในสถานประกอบการ</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 font-prompt mb-1">
                                    ชื่อ-นามสกุล ผู้ประสานงาน *
                                </label>
                                <input
                                    type="text"
                                    value={data.coordinator_name}
                                    onChange={(e) => setData('coordinator_name', e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 font-prompt mb-1">
                                    ตำแหน่ง
                                </label>
                                <input
                                    type="text"
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
                                    value={data.coordinator_phone}
                                    onChange={(e) => setData('coordinator_phone', e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 font-prompt mb-1">
                                    อีเมล
                                </label>
                                <input
                                    type="email"
                                    value={data.coordinator_email}
                                    onChange={(e) => setData('coordinator_email', e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                />
                            </div>
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
                            <span>บันทึกการแก้ไข</span>
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            onClick={() => handleSubmit(true)}
                            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition shadow-md font-prompt disabled:opacity-50"
                        >
                            <Send size={16} />
                            <span>บันทึกและส่งคำขอเพื่อตรวจสอบใหม่</span>
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
