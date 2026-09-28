import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    Network,
    Search,
    Send,
    Code,
    CheckCircle2,
    Database,
    Layers,
    FileJson,
    Copy,
    Check,
    GraduationCap,
    ExternalLink,
    Terminal,
    Sparkles,
    UserCheck,
    BookOpen
} from 'lucide-react';

export default function SnruApi({ sampleStudents = [] }) {
    const [selectedEndpoint, setSelectedEndpoint] = useState('/api/snru/students');
    const [queryParam, setQueryParam] = useState('');
    const [facultyParam, setFacultyParam] = useState('');
    const [majorParam, setMajorParam] = useState('');
    const [studentIdParam, setStudentIdParam] = useState('67102122131');
    const [limitParam, setLimitParam] = useState(10);

    const [isLoading, setIsLoading] = useState(false);
    const [responseStatus, setResponseStatus] = useState(200);
    const [responseTime, setResponseTime] = useState(null);
    const [responseData, setResponseData] = useState(null);
    const [copied, setCopied] = useState(false);

    // Build the request URL
    const getFullUrl = () => {
        let baseUrl = window.location.origin;
        if (selectedEndpoint === '/api/snru/student/{id}') {
            return `${baseUrl}/api/snru/student/${studentIdParam.trim() || '67102122131'}`;
        }

        if (selectedEndpoint === '/api/snru/students') {
            const params = new URLSearchParams();
            if (queryParam) params.append('q', queryParam);
            if (facultyParam) params.append('faculty', facultyParam);
            if (majorParam) params.append('major', majorParam);
            if (limitParam) params.append('limit', limitParam);
            const qs = params.toString();
            return `${baseUrl}/api/snru/students${qs ? '?' + qs : ''}`;
        }

        if (selectedEndpoint === '/api/snru/majors' && facultyParam) {
            return `${baseUrl}/api/snru/majors?faculty=${encodeURIComponent(facultyParam)}`;
        }

        return `${baseUrl}${selectedEndpoint}`;
    };

    // Execute API fetch
    const handleExecuteApi = async () => {
        setIsLoading(true);
        const startTime = performance.now();
        const url = getFullUrl();

        try {
            const res = await fetch(url);
            const endTime = performance.now();
            setResponseTime(Math.round(endTime - startTime));
            setResponseStatus(res.status);
            const json = await res.json();
            setResponseData(json);
        } catch (error) {
            setResponseStatus(500);
            setResponseData({ success: false, message: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        handleExecuteApi();
    }, [selectedEndpoint]);

    const handleCopy = () => {
        if (!responseData) return;
        navigator.clipboard.writeText(JSON.stringify(responseData, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AppLayout title="SNRU Student REST API">
            <Head title="SNRU Student REST API Integration" />

            {/* Header Banner */}
            <div className="mb-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 p-6 rounded-2xl text-white shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div className="flex items-center space-x-2 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-1">
                            <Network size={16} />
                            <span>SNRU REST API Integration • PHP + MySQL + Laravel</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold font-prompt text-white tracking-tight">
                            SNRU Student API Sandbox & Integration
                        </h1>
                        <p className="mt-1 text-slate-300 text-sm max-w-2xl leading-relaxed">
                            ระบบทดสอบและจำลองการเชื่อมต่อฐานข้อมูลนักศึกษา มหาวิทยาลัยราชภัฏสกลนคร ผ่าน RESTful API 
                            ตามมาตรฐานของโมดูล <code className="bg-white/10 px-2 py-0.5 rounded text-blue-200">snru-student-api</code>
                        </p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold flex items-center space-x-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span>API Status: Operational</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Panel: Request Builder (5 cols) */}
                <div className="lg:col-span-5 space-y-5">
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                        <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
                            <Terminal size={18} className="text-blue-600" />
                            <h2 className="font-prompt font-bold text-slate-900 text-base">
                                เครื่องมือทดสอบ API (Request Builder)
                            </h2>
                        </div>

                        {/* Endpoint Selector */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 font-prompt mb-1.5">
                                เลือก Endpoint ที่ต้องการเรียก
                            </label>
                            <div className="space-y-1.5">
                                {[
                                    { path: '/api/snru/students', label: 'GET /api/snru/students (รายชื่อ/ค้นหา)' },
                                    { path: '/api/snru/student/{id}', label: 'GET /api/snru/student/{id} (รายบุคคล)' },
                                    { path: '/api/snru/faculties', label: 'GET /api/snru/faculties (รายชื่อคณะ)' },
                                    { path: '/api/snru/majors', label: 'GET /api/snru/majors (รายชื่อสาขาวิชา)' },
                                ].map((ep) => (
                                    <button
                                        key={ep.path}
                                        type="button"
                                        onClick={() => setSelectedEndpoint(ep.path)}
                                        className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs font-mono transition flex items-center justify-between ${
                                            selectedEndpoint === ep.path
                                                ? 'bg-blue-50 border-blue-500 text-blue-900 font-semibold ring-1 ring-blue-500/20'
                                                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                                        }`}
                                    >
                                        <span>{ep.label}</span>
                                        {selectedEndpoint === ep.path && <Check size={14} className="text-blue-600" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Dynamic Parameters */}
                        <div className="space-y-3 pt-2">
                            {selectedEndpoint === '/api/snru/student/{id}' ? (
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                        รหัสนักศึกษา (student_id)
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={studentIdParam}
                                            onChange={(e) => setStudentIdParam(e.target.value)}
                                            placeholder="เช่น 67102122131 หรือ 671000001"
                                            className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        <span className="text-[11px] text-slate-400">ตัวอย่าง:</span>
                                        {['67102122131', '67102122145', '671000001', '671000002'].map((id) => (
                                            <button
                                                key={id}
                                                type="button"
                                                onClick={() => setStudentIdParam(id)}
                                                className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono transition"
                                            >
                                                {id}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {selectedEndpoint === '/api/snru/students' && (
                                        <div>
                                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                                คำค้นหา (q: ชื่อ, รหัสนักศึกษา, สาขา)
                                            </label>
                                            <div className="relative">
                                                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                                                <input
                                                    type="text"
                                                    value={queryParam}
                                                    onChange={(e) => setQueryParam(e.target.value)}
                                                    placeholder="เช่น ปาจรีย์, คอมพิวเตอร์, 671..."
                                                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {(selectedEndpoint === '/api/snru/students' || selectedEndpoint === '/api/snru/majors') && (
                                        <div>
                                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                                กรองคณะ (faculty)
                                            </label>
                                            <select
                                                value={facultyParam}
                                                onChange={(e) => setFacultyParam(e.target.value)}
                                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                            >
                                                <option value="">-- ทั้งหมดทุกคณะ --</option>
                                                <option value="คณะวิทยาศาสตร์และเทคโนโลยี">คณะวิทยาศาสตร์และเทคโนโลยี</option>
                                                <option value="คณะมนุษยศาสตร์และสังคมศาสตร์">คณะมนุษยศาสตร์และสังคมศาสตร์</option>
                                                <option value="คณะวิทยาการจัดการ">คณะวิทยาการจัดการ</option>
                                            </select>
                                        </div>
                                    )}

                                    {selectedEndpoint === '/api/snru/students' && (
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                                    กรองสาขาวิชา (major)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={majorParam}
                                                    onChange={(e) => setMajorParam(e.target.value)}
                                                    placeholder="เช่น คอมพิวเตอร์"
                                                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                                    จำนวนผลลัพธ์ (limit)
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="50"
                                                    value={limitParam}
                                                    onChange={(e) => setLimitParam(e.target.value)}
                                                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* URL Preview */}
                        <div className="pt-2">
                            <div className="text-[11px] font-semibold text-slate-500 mb-1">Generated Request URL:</div>
                            <div className="p-2.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs break-all border border-slate-800 flex items-center justify-between">
                                <span className="text-emerald-400 mr-2 font-bold">GET</span>
                                <span className="flex-1 truncate">{getFullUrl()}</span>
                            </div>
                        </div>

                        {/* Execute Button */}
                        <button
                            type="button"
                            onClick={handleExecuteApi}
                            disabled={isLoading}
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-prompt font-semibold text-xs shadow-md shadow-blue-500/20 transition flex items-center justify-center space-x-2 disabled:opacity-50"
                        >
                            <Send size={15} />
                            <span>{isLoading ? 'กำลังส่งคำขอ...' : 'ส่งคำขอ (Send Request)'}</span>
                        </button>
                    </div>

                    {/* Architecture Info Card */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                        <h3 className="font-prompt font-bold text-slate-800 text-sm flex items-center space-x-2">
                            <Layers size={17} className="text-indigo-600" />
                            <span>สถาปัตยกรรม SNRU Student API</span>
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            ระบบจำลองการเชื่อมต่อฐานข้อมูลนักศึกษาส่วนกลางตามข้อกำหนดของโฟลเดอร์ <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">snru_student_api/</code>:
                        </p>
                        <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                            <li><strong>ตารางฐานข้อมูล:</strong> <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">snru_students</code> (ถอดแบบจาก database.sql)</li>
                            <li><strong>มาตรฐานการตอบกลับ:</strong> JSON Response พร้อม HTTP Status Codes และ Pagination metadata</li>
                            <li><strong>การนำไปใช้:</strong> ดึงข้อมูลนักศึกษาอัตโนมัติในหน้าลงทะเบียน (Auto-fill) และตรวจสอบสิทธิ์นักศึกษาเตรียมฝึกงาน</li>
                        </ul>
                    </div>
                </div>

                {/* Right Panel: Live Response & Data Preview (7 cols) */}
                <div className="lg:col-span-7 space-y-5">
                    {/* Response Header */}
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                            <div className="flex items-center space-x-3 text-xs">
                                <FileJson size={17} className="text-blue-400" />
                                <span className="font-mono font-semibold text-slate-200">Response Payload (JSON)</span>
                                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                    responseStatus === 200 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400'
                                }`}>
                                    {responseStatus} OK
                                </span>
                                {responseTime !== null && (
                                    <span className="text-[11px] text-slate-400 font-mono">
                                        ⏱ {responseTime} ms
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={handleCopy}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition flex items-center space-x-1"
                            >
                                {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                                <span>{copied ? 'คัดลอกแล้ว' : 'Copy'}</span>
                            </button>
                        </div>

                        {/* JSON Viewer */}
                        <div className="p-4 max-h-[420px] overflow-auto font-mono text-xs text-emerald-400 bg-slate-900/90 leading-relaxed">
                            {isLoading ? (
                                <div className="text-slate-400 py-8 text-center animate-pulse">
                                    กำลังเรียกข้อมูลจาก API...
                                </div>
                            ) : (
                                <pre className="whitespace-pre-wrap">
                                    {JSON.stringify(responseData, null, 2)}
                                </pre>
                            )}
                        </div>
                    </div>

                    {/* Visual Student Cards Preview */}
                    {responseData?.data && Array.isArray(responseData.data) && responseData.data.length > 0 && (
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                <h3 className="font-prompt font-bold text-slate-800 text-sm flex items-center space-x-2">
                                    <GraduationCap size={18} className="text-blue-600" />
                                    <span>ตัวอย่างการนำข้อมูลไปแสดงผล (Rendered Students: {responseData.data.length})</span>
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1">
                                {responseData.data.map((stu) => (
                                    <div 
                                        key={stu.id || stu.student_id} 
                                        className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-blue-300 transition text-xs space-y-1.5"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-prompt font-bold text-slate-900 text-sm">
                                                {stu.full_name}
                                            </span>
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800 font-mono">
                                                {stu.student_id}
                                            </span>
                                        </div>
                                        <div className="text-slate-600 text-[11px]">
                                            {stu.faculty}
                                        </div>
                                        <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px] text-slate-500">
                                            <span>สาขา: {stu.major}</span>
                                            <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-medium">
                                                ปี {stu.year_level || 3} ({stu.status})
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
