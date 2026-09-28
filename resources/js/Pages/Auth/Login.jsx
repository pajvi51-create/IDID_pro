import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { GraduationCap, LogIn, ArrowRight, ShieldCheck, UserCheck, KeyRound, AlertCircle } from 'lucide-react';

export default function Login({ demoUsers, status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: 'student@snru.ac.th',
        password: 'password123',
        remember: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    const handleQuickLogin = (email) => {
        setData({
            email: email,
            password: 'password123',
            remember: true,
        });
        post('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sarabun text-slate-100">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 shadow-xl shadow-blue-500/30 mb-4">
                    <GraduationCap size={36} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold font-prompt tracking-tight text-white">
                    ระบบบริหารจัดการการเตรียมฝึกประสบการณ์วิชาชีพ
                </h2>
                <p className="mt-1 text-sm text-slate-300">
                    สาขาวิชาคอมพิวเตอร์ มหาวิทยาลัยราชภัฏสกลนคร
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
                <div className="bg-white/95 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-white/20 text-slate-800">
                    {/* Quick Demo User Persona Buttons */}
                    <div className="mb-6 p-3 bg-blue-50/80 rounded-xl border border-blue-200">
                        <div className="flex items-center space-x-1.5 text-xs font-semibold text-blue-900 font-prompt mb-2">
                            <UserCheck size={16} className="text-blue-600" />
                            <span>คลิกเดียวเข้าสู่ระบบเพื่อทดสอบ (Quick Demo Accounts):</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <button
                                type="button"
                                onClick={() => handleQuickLogin('student@snru.ac.th')}
                                className="p-2 text-left bg-white hover:bg-blue-600 hover:text-white border border-blue-200 rounded-lg transition shadow-2xs font-prompt"
                            >
                                <div className="font-semibold">1. นักศึกษา ปาจรีย์</div>
                                <div className="text-[10px] text-slate-500 group-hover:text-blue-100">ยื่นคำขอ/ติดตามสถานะ</div>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleQuickLogin('instructor@snru.ac.th')}
                                className="p-2 text-left bg-white hover:bg-amber-600 hover:text-white border border-amber-200 rounded-lg transition shadow-2xs font-prompt"
                            >
                                <div className="font-semibold text-amber-900 hover:text-white">2. อาจารย์ผู้รับผิดชอบ</div>
                                <div className="text-[10px] text-slate-500">ตรวจอนุมัติขั้นที่ 1</div>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleQuickLogin('chair@snru.ac.th')}
                                className="p-2 text-left bg-white hover:bg-indigo-600 hover:text-white border border-indigo-200 rounded-lg transition shadow-2xs font-prompt"
                            >
                                <div className="font-semibold text-indigo-900 hover:text-white">3. ประธานหลักสูตร</div>
                                <div className="text-[10px] text-slate-500">อนุมัติขั้นสุดท้าย (ขั้น 2)</div>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleQuickLogin('admin@snru.ac.th')}
                                className="p-2 text-left bg-white hover:bg-purple-600 hover:text-white border border-purple-200 rounded-lg transition shadow-2xs font-prompt"
                            >
                                <div className="font-semibold text-purple-900 hover:text-white">4. ผู้ดูแลระบบ</div>
                                <div className="text-[10px] text-slate-500">จัดการข้อมูลกลาง</div>
                            </button>
                        </div>
                    </div>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-slate-400 font-prompt">หรือเข้าสู่ระบบด้วยบัญชี</span>
                        </div>
                    </div>

                    <form className="space-y-4" onSubmit={submit}>
                        {errors.email && (
                            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center space-x-1.5">
                                <AlertCircle size={15} className="flex-shrink-0" />
                                <span>{errors.email}</span>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 font-prompt">
                                รหัสนักศึกษา หรือ อีเมล (Email / Student ID)
                            </label>
                            <input
                                type="text"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="mt-1 block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 font-prompt">
                                รหัสผ่าน (Password)
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="mt-1 block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between text-xs">
                            <label className="flex items-center space-x-2 text-slate-600 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span>จดจำการเข้าสู่ระบบ</span>
                            </label>
                            <span className="text-slate-400">รหัสผ่านเริ่มต้น: password123</span>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition font-prompt disabled:opacity-50"
                        >
                            <LogIn size={18} />
                            <span>เข้าสู่ระบบ (Sign In)</span>
                        </button>
                    </form>

                    <div className="mt-6 text-center text-xs text-slate-600">
                        ยังไม่มีบัญชีนักศึกษา?{' '}
                        <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                            ลงทะเบียนนักศึกษาใหม่
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
