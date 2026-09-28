import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Download, FileText, CheckCircle2, FileCheck, ArrowDownToLine, ExternalLink, Globe } from 'lucide-react';

export default function Forms({ forms }) {
    return (
        <AppLayout>
            <Head title="เอกสารและแบบฟอร์มดาวน์โหลด" />

            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-prompt text-slate-900 flex items-center space-x-2">
                        <Download className="text-emerald-600" size={26} />
                        <span>เอกสารและแบบฟอร์มดาวน์โหลด (Download Center)</span>
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        รวบรวมไฟล์แบบฟอร์มทางการของสาขาวิชาคอมพิวเตอร์ มหาวิทยาลัยราชภัฏสกลนคร
                    </p>
                </div>

                <a
                    href="https://com.snru.ac.th/%e0%b8%94%e0%b8%b2%e0%b8%a7%e0%b8%99%e0%b9%8c%e0%b9%82%e0%b8%ab%e0%b8%a5%e0%b8%94/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold font-prompt border border-blue-200 transition"
                >
                    <Globe size={15} />
                    <span>ไปยังหน้าดาวน์โหลด com.snru.ac.th</span>
                    <ExternalLink size={13} />
                </a>
            </div>

            {/* Official Source Banner */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 border border-blue-100 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700 shadow-2xs">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                        SNRU
                    </div>
                    <div>
                        <div className="font-bold text-slate-900 font-prompt">
                            เอกสารอ้างอิงจากเว็บไซต์สาขาวิชาคอมพิวเตอร์ (com.snru.ac.th)
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                            สาขาวิชาคอมพิวเตอร์ คณะวิทยาศาสตร์และเทคโนโลยี มหาวิทยาลัยราชภัฏสกลนคร
                        </div>
                    </div>
                </div>
                <div className="text-[11px] text-slate-500">
                    อัปเดตสอดคล้องกับปีการศึกษา 2567 - 2569
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {forms.map((form) => (
                    <div key={form.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 font-prompt">
                                    <FileCheck size={13} />
                                    <span>แบบฟอร์มทางการ SNRU</span>
                                </span>
                                <span className="text-[11px] text-slate-400">
                                    {form.formatted_file_size}
                                </span>
                            </div>

                            <h3 className="font-prompt font-bold text-base text-slate-900 mb-2 leading-snug">
                                {form.title}
                            </h3>

                            <p className="text-xs text-slate-500 leading-relaxed mb-4">
                                {form.description}
                            </p>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[11px] text-slate-400">
                                ดาวน์โหลดแล้ว {form.download_count} ครั้ง
                            </span>
                            <a
                                href={`/forms/${form.id}/download`}
                                className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold font-prompt shadow-sm transition"
                            >
                                <ArrowDownToLine size={15} />
                                <span>ดาวน์โหลดไฟล์ ({form.file_extension.toUpperCase()})</span>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}
