import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    FileText, 
    CheckSquare, 
    Building2, 
    Calendar, 
    Download, 
    BookOpen, 
    LogOut, 
    User, 
    ShieldCheck, 
    ChevronRight, 
    Menu, 
    X, 
    CheckCircle2, 
    AlertCircle,
    GraduationCap,
    ArrowRightLeft,
    ClipboardCheck
} from 'lucide-react';

export default function AppLayout({ children, title }) {
    const { auth, flash } = usePage().props;
    const user = auth?.user;
    const role = user?.role?.name || 'student';
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleRoleSwitch = (targetRole) => {
        router.post(`/switch-role/${targetRole}`);
    };

    const isCurrent = (path) => {
        return window.location.pathname.startsWith(path);
    };

    const navItems = [
        { name: 'แดชบอร์ดภาพรวม', href: '/dashboard', icon: LayoutDashboard, show: true },
        { 
            name: role === 'student' ? 'คำขออนุมัติฝึกงาน' : 'รายการคำขอทั้งหมด', 
            href: '/applications', 
            icon: FileText, 
            show: true 
        },
        { 
            name: 'พิจารณาอนุมัติ (2 ขั้นตอน)', 
            href: '/approvals', 
            icon: CheckSquare, 
            show: ['instructor', 'chair', 'admin'].includes(role) 
        },
        { 
            name: ['instructor', 'chair', 'admin'].includes(role) ? 'สมุดบันทึก & ตรวจนิเทศก์' : 'สมุดบันทึกงานประจำวัน', 
            href: '/logbook', 
            icon: ClipboardCheck, 
            show: true 
        },
        { name: 'ทำเนียบสถานประกอบการ', href: '/companies', icon: Building2, show: true },
        { name: 'เอกสารและแบบฟอร์ม', href: '/forms', icon: Download, show: true },
        { name: 'คำแนะนำ Resume/พอร์ต', href: '/guidelines', icon: BookOpen, show: true },
        { name: 'ปฏิทินกำหนดการ', href: '/timeline', icon: Calendar, show: true },
    ];

    const getRoleBadge = () => {
        switch (role) {
            case 'admin':
                return { label: 'ผู้ดูแลระบบ', color: 'bg-purple-100 text-purple-800 border-purple-300' };
            case 'chair':
                return { label: 'ประธานหลักสูตร (ขั้นที่ 2)', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' };
            case 'instructor':
                return { label: 'อาจารย์ผู้รับผิดชอบรายวิชา (ขั้นที่ 1)', color: 'bg-amber-100 text-amber-800 border-amber-300' };
            default:
                return { label: 'นักศึกษาชั้นปีที่ 3', color: 'bg-blue-100 text-blue-800 border-blue-300' };
        }
    };

    const roleBadge = getRoleBadge();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sarabun text-slate-800">
            {/* Top Demo Role Switcher Bar */}
            <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 flex flex-wrap items-center justify-between border-b border-slate-800">
                <div className="flex items-center space-x-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="font-prompt font-medium">สลับบทบาททดสอบระบบ (Demo Role Switcher):</span>
                </div>
                <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                    <button 
                        onClick={() => handleRoleSwitch('student')}
                        className={`px-2.5 py-0.5 rounded transition ${role === 'student' ? 'bg-blue-600 text-white font-semibold' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
                    >
                        นักศึกษา (ปาจรีย์)
                    </button>
                    <button 
                        onClick={() => handleRoleSwitch('instructor')}
                        className={`px-2.5 py-0.5 rounded transition ${role === 'instructor' ? 'bg-amber-600 text-white font-semibold' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
                    >
                        อาจารย์ผู้ตรวจ (ขั้น 1)
                    </button>
                    <button 
                        onClick={() => handleRoleSwitch('chair')}
                        className={`px-2.5 py-0.5 rounded transition ${role === 'chair' ? 'bg-indigo-600 text-white font-semibold' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
                    >
                        ประธานหลักสูตร (ขั้น 2)
                    </button>
                    <button 
                        onClick={() => handleRoleSwitch('admin')}
                        className={`px-2.5 py-0.5 rounded transition ${role === 'admin' ? 'bg-purple-600 text-white font-semibold' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
                    >
                        ผู้ดูแลระบบ (Admin)
                    </button>
                </div>
            </div>

            {/* Main Navigation Bar */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="lg:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 mr-2"
                            >
                                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                            <Link href="/dashboard" className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                                    <GraduationCap size={22} />
                                </div>
                                <div>
                                    <div className="font-prompt font-bold text-slate-900 text-base leading-tight">
                                        ระบบเตรียมฝึกประสบการณ์วิชาชีพ
                                    </div>
                                    <div className="text-xs text-slate-500 font-medium">
                                        สาขาวิชาคอมพิวเตอร์ มหาวิทยาลัยราชภัฏสกลนคร
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* User Profile & Actions */}
                        <div className="flex items-center space-x-3">
                            <div className="hidden sm:flex flex-col text-right">
                                <span className="text-sm font-semibold text-slate-800 leading-tight">
                                    {user?.name || 'ผู้ใช้งาน'}
                                </span>
                                <span className="text-xs text-slate-500">
                                    {user?.student_id ? `รหัส ${user.student_id}` : user?.curriculum?.name || user?.email}
                                </span>
                            </div>
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${roleBadge.color}`}>
                                {roleBadge.label}
                            </span>
                            <form method="POST" action="/logout">
                                <button
                                    type="submit"
                                    title="ออกจากระบบ"
                                    className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                                >
                                    <LogOut size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Sub Nav Links (Desktop) */}
                <div className="hidden lg:block border-t border-slate-100 bg-slate-50/70">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 py-1.5 overflow-x-auto">
                        {navItems.filter(item => item.show).map((item) => {
                            const Icon = item.icon;
                            const active = isCurrent(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium font-prompt transition whitespace-nowrap ${
                                        active 
                                            ? 'bg-blue-600 text-white shadow-sm' 
                                            : 'text-slate-600 hover:text-blue-600 hover:bg-slate-200/60'
                                    }`}
                                >
                                    <Icon size={15} />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden border-t border-slate-200 bg-white py-2 px-4 space-y-1">
                        {navItems.filter(item => item.show).map((item) => {
                            const Icon = item.icon;
                            const active = isCurrent(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium ${
                                        active ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                                    }`}
                                >
                                    <Icon size={18} />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </header>

            {/* Flash Messages */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-4">
                {flash?.success && (
                    <div className="flex items-center space-x-2 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm shadow-sm animate-fade-in mb-4">
                        <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="flex items-center space-x-2 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm shadow-sm animate-fade-in mb-4">
                        <AlertCircle size={18} className="text-rose-600 flex-shrink-0" />
                        <span>{flash.error}</span>
                    </div>
                )}
            </div>

            {/* Page Content */}
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 py-6 mt-auto text-xs text-slate-500 text-center">
                <div className="max-w-7xl mx-auto px-4">
                    <p className="font-prompt font-medium text-slate-700">
                        เว็บแอปพลิเคชันบริหารจัดการการเตรียมฝึกประสบการณ์วิชาชีพสำหรับนักศึกษาสาขาวิชาคอมพิวเตอร์
                    </p>
                    <p className="mt-1">
                        Development of a Web Application for Professional Experience Preparation Management | มหาวิทยาลัยราชภัฏสกลนคร
                    </p>
                    <p className="mt-1 text-slate-400">
                        สถาปัตยกรรมระบบ: Laravel 11 + Inertia.js (React) + Tailwind CSS + MySQL
                    </p>
                </div>
            </footer>
        </div>
    );
}
