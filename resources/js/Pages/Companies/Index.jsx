import React, { useState } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { 
    Building2, 
    Search, 
    MapPin, 
    Users, 
    Coins, 
    Plus, 
    ExternalLink, 
    Phone, 
    Mail, 
    X,
    Filter
} from 'lucide-react';

export default function CompaniesIndex({ companies, provinces, filters }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const isAdmin = user?.role?.name === 'admin';

    const [search, setSearch] = useState(filters.search || '');
    const [province, setProvince] = useState(filters.province || '');
    const [hasAllowance, setHasAllowance] = useState(filters.has_allowance || false);
    const [showAddModal, setShowAddModal] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        business_type: '',
        description: '',
        contact_person: '',
        email: '',
        phone: '',
        website: '',
        address: '',
        province: 'สกลนคร',
        max_trainees: 2,
        has_allowance: false,
        allowance_amount: '',
        is_partner: true,
    });

    const handleFilter = (e) => {
        e.preventDefault();
        router.get('/companies', {
            search,
            province,
            has_allowance: hasAllowance ? 1 : 0,
        }, { preserveState: true });
    };

    const handleCreateCompany = (e) => {
        e.preventDefault();
        post('/companies', {
            onSuccess: () => {
                setShowAddModal(false);
                reset();
            }
        });
    };

    return (
        <AppLayout>
            <Head title="ทำเนียบสถานประกอบการ" />

            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold font-prompt text-slate-900 flex items-center space-x-2">
                        <Building2 className="text-blue-600" size={26} />
                        <span>ทำเนียบสถานประกอบการฝึกประสบการณ์วิชาชีพ</span>
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        ค้นหาและเลือกหน่วยงาน/บริษัทด้านคอมพิวเตอร์และดิจิทัลที่เปิดรับนักศึกษา
                    </p>
                </div>

                {isAdmin && (
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold font-prompt shadow-sm transition"
                    >
                        <Plus size={16} />
                        <span>เพิ่มสถานประกอบการใหม่</span>
                    </button>
                )}
            </div>

            {/* Search & Filter Bar */}
            <form onSubmit={handleFilter} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-[240px] relative">
                    <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
                    <input
                        type="text"
                        placeholder="ค้นหาชื่อบริษัท, ประเภทธุรกิจ เช่น Software, Network..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                </div>

                <div className="w-44">
                    <select
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">ทุกจังหวัด</option>
                        {provinces.map((p) => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                </div>

                <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer px-2">
                    <input
                        type="checkbox"
                        checked={hasAllowance}
                        onChange={(e) => setHasAllowance(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>เฉพาะที่มีเบี้ยเลี้ยง</span>
                </label>

                <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold font-prompt transition shadow-2xs"
                >
                    กรองข้อมูล
                </button>
            </form>

            {/* Companies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.data?.map((comp) => (
                    <div key={comp.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                        <div>
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-700 border border-blue-100 font-prompt">
                                    {comp.business_type || 'สายงานคอมพิวเตอร์'}
                                </span>
                                {comp.is_partner && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                                        MOU ความร่วมมือ
                                    </span>
                                )}
                            </div>

                            <h3 className="font-prompt font-bold text-base text-slate-900 leading-snug">
                                {comp.name}
                            </h3>

                            <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                                {comp.description || 'สถานประกอบการด้านการพัฒนาซอฟต์แวร์และเทคโนโลยีสารสนเทศ'}
                            </p>

                            <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                                <div className="flex items-center space-x-2">
                                    <MapPin size={14} className="text-slate-400 flex-shrink-0" />
                                    <span className="truncate">{comp.address || comp.province || 'สกลนคร'}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Users size={14} className="text-slate-400 flex-shrink-0" />
                                    <span>เปิดรับ: <strong>{comp.max_trainees}</strong> อัตรา</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Coins size={14} className="text-slate-400 flex-shrink-0" />
                                    <span>
                                        เบี้ยเลี้ยง: {comp.has_allowance ? <strong className="text-emerald-700">{comp.allowance_amount} บ./วัน</strong> : <span className="text-slate-400">ไม่มี</span>}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="text-slate-500">
                                ผู้ติดต่อ: {comp.contact_person || 'ฝ่ายบุคคล'}
                            </span>
                            {comp.website && (
                                <a
                                    href={comp.website}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600 hover:underline flex items-center space-x-1 font-semibold"
                                >
                                    <span>เว็บไซต์</span>
                                    <ExternalLink size={12} />
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Company Modal (Admin) */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
                        <button
                            onClick={() => setShowAddModal(false)}
                            className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
                        >
                            <X size={20} />
                        </button>

                        <h3 className="text-lg font-bold font-prompt text-slate-900 mb-4">
                            เพิ่มสถานประกอบการใหม่
                        </h3>

                        <form onSubmit={handleCreateCompany} className="space-y-3 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">ชื่อสถานประกอบการ *</label>
                                <input
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-xl"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">ประเภทธุรกิจ</label>
                                    <input
                                        type="text"
                                        placeholder="Software House, IT Support"
                                        value={data.business_type}
                                        onChange={(e) => setData('business_type', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-xl"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">จังหวัด</label>
                                    <input
                                        type="text"
                                        value={data.province}
                                        onChange={(e) => setData('province', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-xl"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">รายละเอียดงาน</label>
                                <textarea
                                    rows={2}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-xl"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">ผู้ประสานงาน</label>
                                    <input
                                        type="text"
                                        value={data.contact_person}
                                        onChange={(e) => setData('contact_person', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-xl"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">เบอร์โทรศัพท์</label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-xl"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">จำนวนรับ (คน)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={data.max_trainees}
                                        onChange={(e) => setData('max_trainees', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-xl"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">มีเบี้ยเลี้ยงหรือไม่</label>
                                    <select
                                        value={data.has_allowance ? '1' : '0'}
                                        onChange={(e) => setData('has_allowance', e.target.value === '1')}
                                        className="w-full px-3 py-2 border rounded-xl"
                                    >
                                        <option value="0">ไม่มี</option>
                                        <option value="1">มีเบี้ยเลี้ยง</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold font-prompt"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 bg-blue-600 text-white rounded-xl font-semibold font-prompt shadow-sm"
                                >
                                    บันทึกข้อมูล
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
