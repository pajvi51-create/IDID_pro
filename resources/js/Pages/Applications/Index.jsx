import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { FileText, Plus, Eye, CheckCircle2, Clock, RotateCcw, XCircle, ArrowRight } from 'lucide-react';

export default function ApplicationsIndex({ applications }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const role = user?.role?.name || 'student';

    return (
        <AppLayout>
            <Head title="รายการคำขออนุมัติสถานที่ฝึกงาน" />

            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold font-prompt text-slate-900 flex items-center space-x-2">
                        <FileText className="text-blue-600" size={26} />
                        <span>รายการคำขออนุมัติสถานที่เตรียมฝึกประสบการณ์วิชาชีพ</span>
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        ติดตามสถานะและประวัติการยื่นคำขอฝึกประสบการณ์วิชาชีพ
                    </p>
                </div>
                {role === 'student' && applications.data?.length === 0 && (
                    <Link
                        href="/applications/create"
                        className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition shadow-md font-prompt"
                    >
                        <Plus size={16} />
                        <span>ยื่นคำขอใหม่</span>
                    </Link>
                )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {applications.data?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                            <thead className="bg-slate-50 font-prompt text-slate-600 uppercase text-[11px]">
                                <tr>
                                    <th className="px-6 py-3.5 font-semibold">นักศึกษา</th>
                                    <th className="px-6 py-3.5 font-semibold">สถานประกอบการ</th>
                                    <th className="px-6 py-3.5 font-semibold">ตำแหน่งงาน</th>
                                    <th className="px-6 py-3.5 font-semibold">สถานะการอนุมัติ</th>
                                    <th className="px-6 py-3.5 font-semibold">ยื่นเมื่อ</th>
                                    <th className="px-6 py-3.5 font-semibold text-right">การจัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-sarabun">
                                {applications.data.map((app) => (
                                    <tr key={app.id} className="hover:bg-slate-50/70 transition">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-slate-900 font-prompt">{app.user?.name}</div>
                                            <div className="text-slate-500 text-[11px]">รหัส {app.user?.student_id || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-800">{app.company?.name}</div>
                                            <div className="text-slate-400 text-[11px]">{app.company?.province}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-700">
                                            {app.position_title}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block text-[11px] px-2.5 py-1 rounded-full font-semibold border ${app.status_badge_color}`}>
                                                {app.status_label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-[11px]">
                                            {app.submitted_at ? new Date(app.submitted_at).toLocaleDateString('th-TH') : 'ยังไม่ส่งคำขอ'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/applications/${app.id}`}
                                                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-lg text-xs font-semibold font-prompt transition"
                                            >
                                                <span>ดูข้อมูล</span>
                                                <Eye size={14} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center text-slate-400 text-sm">
                        <FileText size={40} className="mx-auto text-slate-300 mb-2" />
                        <p>ยังไม่มีรายการคำขอในระบบ</p>
                        {role === 'student' && (
                            <Link
                                href="/applications/create"
                                className="mt-3 inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl font-prompt transition"
                            >
                                <Plus size={15} />
                                <span>เริ่มสร้างคำขอแรกของคุณ</span>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
