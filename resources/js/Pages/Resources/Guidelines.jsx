import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { BookOpen, FileText, Briefcase, CheckCircle, Lightbulb } from 'lucide-react';

export default function Guidelines({ guidelines }) {
    const [selectedCategory, setSelectedCategory] = useState('all');

    const filtered = selectedCategory === 'all' 
        ? guidelines 
        : guidelines.filter(g => g.category === selectedCategory);

    return (
        <AppLayout>
            <Head title="คำแนะนำการเตรียมตัวฝึกงาน" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold font-prompt text-slate-900 flex items-center space-x-2">
                    <BookOpen className="text-indigo-600" size={26} />
                    <span>คำแนะนำและแนวทางการเตรียมตัว (Preparation Guidelines)</span>
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                    เทคนิคการเขียน Resume การจัดทำ Portfolio และคุณสมบัติเกณฑ์การลงทะเบียนสำหรับนักศึกษาคอมพิวเตอร์
                </p>
            </div>

            {/* Category Filter */}
            <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
                <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold font-prompt transition ${
                        selectedCategory === 'all' 
                            ? 'bg-indigo-600 text-white shadow-sm' 
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                >
                    ทั้งหมด ({guidelines.length})
                </button>
                <button
                    onClick={() => setSelectedCategory('resume')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold font-prompt transition ${
                        selectedCategory === 'resume' 
                            ? 'bg-indigo-600 text-white shadow-sm' 
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                >
                    การทำ Resume
                </button>
                <button
                    onClick={() => setSelectedCategory('portfolio')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold font-prompt transition ${
                        selectedCategory === 'portfolio' 
                            ? 'bg-indigo-600 text-white shadow-sm' 
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                >
                    การจัดทำ Portfolio
                </button>
                <button
                    onClick={() => setSelectedCategory('qualification')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold font-prompt transition ${
                        selectedCategory === 'qualification' 
                            ? 'bg-indigo-600 text-white shadow-sm' 
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                >
                    เกณฑ์และคุณสมบัติ
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 font-prompt mb-2">
                                <Lightbulb size={16} />
                                <span className="uppercase">{item.category}</span>
                            </div>
                            <h2 className="text-lg font-bold font-prompt text-slate-900 mb-2">
                                {item.title}
                            </h2>
                            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                                {item.summary}
                            </p>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sarabun">
                                {item.content}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}
