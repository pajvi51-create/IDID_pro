import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function TimelinePage({ timelines }) {
    return (
        <AppLayout>
            <Head title="ปฏิทินและกำหนดการ" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold font-prompt text-slate-900 flex items-center space-x-2">
                    <Calendar className="text-blue-600" size={26} />
                    <span>ปฏิทินและกำหนดการเตรียมฝึกประสบการณ์วิชาชีพ</span>
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                    กำหนดการและวันสำคัญสำหรับการเตรียมความพร้อม ปีการศึกษา 1/2569
                </p>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-3xl mx-auto">
                <div className="relative border-l-2 border-blue-200 pl-6 space-y-8 ml-3">
                    {timelines.map((item, index) => (
                        <div key={item.id} className="relative group">
                            {/* Dot indicator */}
                            <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-xs"></div>

                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:border-blue-200 transition">
                                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800 font-prompt">
                                        {item.badge_type === 'deadline' ? 'วันกำหนดส่งเอกสาร' : item.badge_type === 'orientation' ? 'ปฐมนิเทศ' : 'กำหนดการสำคัญ'}
                                    </span>
                                    <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
                                        <Clock size={14} className="text-slate-400" />
                                        <span>
                                            {new Date(item.start_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            {item.end_date && item.end_date !== item.start_date ? ` - ${new Date(item.end_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}` : ''}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-base font-bold font-prompt text-slate-900 mb-1">
                                    {item.title}
                                </h3>

                                <p className="text-xs text-slate-600 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
