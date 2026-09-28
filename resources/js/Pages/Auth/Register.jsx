import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { GraduationCap, UserPlus, ArrowLeft, AlertCircle, Search, CheckCircle2, Sparkles, Network } from 'lucide-react';

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

    const [isFetchingApi, setIsFetchingApi] = useState(false);
    const [apiFeedback, setApiFeedback] = useState(null);

    const handleFetchFromSnruApi = async () => {
        if (!data.student_id || data.student_id.trim().length < 8) {
            setApiFeedback({ type: 'error', message: 'กรุณากรอกรหัสนักศึกษาอย่างน้อย 8-11 หลัก' });
            return;
        }

        setIsFetchingApi(true);
        setApiFeedback(null);

        try {
            const res = await fetch(`/api/snru/student/${data.student_id.trim()}`);
            const json = await res.json();

            if (json.success && json.data) {
                const stu = json.data;
                setData(prev => {
                    const matchedCurr = curriculums.find(c => 
                        c.name.toLowerCase().includes(stu.major.toLowerCase()) || 
                        stu.major.toLowerCase().includes(c.name.toLowerCase())
                    );

                    return {
                        ...prev,
                        name: stu.full_name || prev.name,
                        email: stu.email || prev.email || `${stu.student_id}@snru.ac.th`,
                        phone: stu.phone || prev.phone,
                        curriculum_id: matchedCurr ? matchedCurr.id : prev.curriculum_id,
                    };
                });
                setApiFeedback({
                    type: 'success',
                    message: `ดึงข้อมูลสำเร็จ: ${stu.full_name} (${stu.major})`,
                });
            } else {
                setApiFeedback({
                    type: 'not_found',
                    message: 'ไม่พบในฐานข้อมูลกลาง SNRU (สามารถกรอกข้อมูลด้วยตนเองได้)',
                });
            }
        } catch (err) {
            setApiFeedback({
                type: 'error',
                message: 'ไม่สามารถติดต่อ SNRU API ได้ชั่วคราว',
            });
        } finally {
            setIsFetchingApi(false);
        }
    };

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
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-xs font-semibold text-slate-700 font-prompt">
                                    รหัสนักศึกษา (11 หลัก)
                                </label>
                                <span className="text-[11px] text-blue-600 flex items-center space-x-1">
                                    <Sparkles size={12} />
                                    <span>เชื่อมต่อ SNRU Student API</span>
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="เช่น 67102122131"
                                    value={data.student_id}
                                    onChange={(e) => setData('student_id', e.target.value)}
                                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white font-mono"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={handleFetchFromSnruApi}
                                    disabled={isFetchingApi}
                                    className="px-3.5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-prompt font-semibold flex items-center space-x-1.5 transition disabled:opacity-50 whitespace-nowrap shadow-sm"
                                >
                                    <Network size={14} />
                                    <span>{isFetchingApi ? 'กำลังค้นหา...' : 'ดึงข้อมูลจาก API'}</span>
                                </button>
                            </div>
                            {errors.student_id && <p className="mt-1 text-xs text-rose-600">{errors.student_id}</p>}
                            
                            {/* API Feedback Alert */}
                            {apiFeedback && (
                                <div className={`mt-2 p-2.5 rounded-xl text-xs flex items-center space-x-2 ${
                                    apiFeedback.type === 'success' 
                                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                                        : apiFeedback.type === 'not_found'
                                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                                }`}>
                                    {apiFeedback.type === 'success' ? (
                                        <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" />
                                    ) : (
                                        <AlertCircle size={15} className="text-amber-600 flex-shrink-0" />
                                    )}
                                    <span>{apiFeedback.message}</span>
                                </div>
                            )}
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
