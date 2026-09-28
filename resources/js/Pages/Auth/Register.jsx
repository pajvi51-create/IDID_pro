import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import { GraduationCap, UserPlus } from 'lucide-react';

export default function Register({ curriculums }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        student_id: '',
        email: '',
        curriculum_id: curriculums[0]?.id || '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sarabun text-slate-100">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 shadow-xl shadow-blue-500/30 mb-3">
                    <GraduationCap size={30} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold font-prompt tracking-tight text-white">
                    ลงทะเบียนนักศึกษาใหม่
                </h2>
                <p className="mt-1 text-sm text-slate-300">
                    เตรียมฝึกประสบการณ์วิชาชีพ สาขาวิชาคอมพิวเตอร์
                </p>
            </div>

            <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg px-4">
                <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl sm:px-10 text-slate-800 border border-white/20">
                    <form className="space-y-4" onSubmit={submit}>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 font-prompt mb-1">
                                รหัสนักศึกษา (11 หลัก)
                            </label>
                            <input
                                type="text"
                                placeholder="เช่น 67102122131"
                                value={data.student_id}
                                onChange={(e) => setData('student_id', e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white font-mono"
                                required
                            />
                            {errors.student_id && <p className="mt-1 text-xs text-rose-600">{errors.student_id}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 font-prompt">
                                ชื่อ-นามสกุล นักศึกษา
                            </label>
                            <input
                                type="text"
                                placeholder="เช่น นางสาว ปาจรีย์ สุคนธชาติ"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                required
                            />
                            {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 font-prompt">
                                    เบอร์โทรศัพท์ติดต่อ
                                </label>
                                <input
                                    type="text"
                                    placeholder="เช่น 095-1234567"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="mt-1 block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                    required
                                />
                                {errors.phone && <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 font-prompt">
                                หลักสูตร/สาขาวิชาที่สังกัด
                            </label>
                            <select
                                value={data.curriculum_id}
                                onChange={(e) => setData('curriculum_id', e.target.value)}
                                className="mt-1 block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                required
                            >
                                {curriculums.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.code} - {c.name}
                                    </option>
                                ))}
                            </select>
                            {errors.curriculum_id && <p className="mt-1 text-xs text-rose-600">{errors.curriculum_id}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 font-prompt">
                                อีเมล (Email)
                            </label>
                            <input
                                type="email"
                                placeholder="student@snru.ac.th"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="mt-1 block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                required
                            />
                            {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 font-prompt">
                                    รหัสผ่าน (Password)
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="mt-1 block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                    required
                                />
                                {errors.password && <p className="mt-1 text-xs text-rose-600">{errors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 font-prompt">
                                    ยืนยันรหัสผ่าน
                                </label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="mt-1 block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full mt-4 flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition font-prompt disabled:opacity-50"
                        >
                            <UserPlus size={18} />
                            <span>ยืนยันการลงทะเบียน (Register)</span>
                        </button>
                    </form>

                    <div className="mt-6 text-center text-xs text-slate-600">
                        มีบัญชีในระบบอยู่แล้ว?{' '}
                        <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                            เข้าสู่ระบบทันที
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
