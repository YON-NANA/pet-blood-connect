"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface HospitalData {
    id: string;
    hospital_name: string;
    address_prefecture: string;
    address_city: string;
    address_detail: string;
    phone_number: string;
    website_url: string;
    description: string;
}

const PREFECTURES = [
    '北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県',
    '茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県',
    '新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県',
    '静岡県','愛知県','三重県','滋賀県','京都府','大阪府','兵庫県',
    '奈良県','和歌山県','鳥取県','島根県','岡山県','広島県','山口県',
    '徳島県','香川県','愛媛県','高知県','福岡県','佐賀県','長崎県',
    '熊本県','大分県','宮崎県','鹿児島県','沖縄県',
];

export default function HospitalSettings() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [formData, setFormData] = useState<HospitalData>({
        id: '',
        hospital_name: '',
        address_prefecture: '',
        address_city: '',
        address_detail: '',
        phone_number: '',
        website_url: '',
        description: ''
    });

    useEffect(() => {
        const fetchHospital = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/hospital/login');
                return;
            }
            setUserId(user.id);

            const { data } = await supabase
                .from('hospitals')
                .select('*')
                .eq('id', user.id)
                .single();

            if (data) {
                setFormData(data);
            }
            setLoading(false);
        };
        fetchHospital();
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;

        setSaving(true);
        try {
            const { error } = await supabase
                .from('hospitals')
                .update({
                    hospital_name: formData.hospital_name,
                    address_prefecture: formData.address_prefecture,
                    address_city: formData.address_city,
                    address_detail: formData.address_detail,
                    phone_number: formData.phone_number,
                    website_url: formData.website_url,
                    description: formData.description
                })
                .eq('id', userId);

            if (error) throw error;

            // Profileの表示名も同期（簡易版）
            await supabase
                .from('profiles')
                .update({ display_name: formData.hospital_name })
                .eq('id', userId);

            alert('設定を保存しました。');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : '不明なエラー';
            alert('保存に失敗しました: ' + message);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("退会してアカウントに関連する情報を削除してもよろしいですか？\n※この操作は取り消せません。")) {
            return;
        }

        try {
            if (!userId) return;

            const { error: deleteError } = await supabase
                .from('hospitals')
                .delete()
                .eq('id', userId);
            
            if (deleteError) throw deleteError;

            alert('退会処理が完了しました。ご利用ありがとうございました。');
            await supabase.auth.signOut();
            router.push('/');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : '不明なエラー';
            alert('退会処理に失敗しました: ' + message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-trust-blue"></div>
            </div>
        );
    }

    return (
        <div className="bg-[#F3F4F6] min-h-screen font-sans flex text-gray-900">
            {/* Sidebar (Shared) */}
            <aside className="fixed inset-y-0 left-0 w-72 bg-deep-blue text-white shadow-2xl z-50 hidden md:flex flex-col">
                <div className="p-10">
                    <Link href="/" className="group flex items-center space-x-2">
                        <div className="w-10 h-10 bg-life-green rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-lg">A</div>
                        <div>
                            <span className="text-2xl font-black tracking-tighter">Blood Link</span>
                            <div className="text-[9px] font-black text-blue-300 uppercase tracking-[0.4em] leading-none mt-1">Hospital Admin</div>
                        </div>
                    </Link>
                </div>

                <nav className="flex-grow px-6 space-y-2 mt-4">
                    <Link href="/hospital/dashboard" className="flex items-center space-x-3 text-blue-200 hover:bg-white/10 p-4 rounded-2xl font-bold transition">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        <span>ドナーを探す</span>
                    </Link>
                    <Link href="/hospital/settings" className="flex items-center space-x-3 bg-white text-deep-blue p-4 rounded-2xl shadow-xl font-black transition">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span>設定・プロフィール</span>
                    </Link>
                </nav>

                <div className="p-8 border-t border-white/5">
                    <button onClick={async () => { await supabase.auth.signOut(); router.push('/'); }} className="w-full bg-red-400/10 text-red-400 py-4 rounded-2xl font-black hover:bg-red-400/20 transition text-xs">
                        ログアウト
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow md:ml-72 p-6 md:p-12 lg:p-16">
                <header className="mb-12">
                    <h1 className="text-4xl font-black text-deep-blue tracking-tighter">
                        病院設定
                    </h1>
                    <p className="text-gray-400 font-bold mt-2">病院の公開情報や連絡先を管理します。</p>
                </header>

                <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
                    <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl shadow-gray-200/50 border border-white space-y-8">
                        {/* Basic Info Section */}
                        <section className="space-y-6">
                            <h2 className="text-xl font-black text-deep-blue flex items-center border-l-4 border-life-green pl-4">
                                基本情報
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">病院名</label>
                                    <input
                                        type="text"
                                        name="hospital_name"
                                        value={formData.hospital_name}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-trust-blue transition font-bold"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">電話番号</label>
                                    <input
                                        type="tel"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-trust-blue transition font-bold"
                                        placeholder="03-xxxx-xxxx"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Address Section */}
                        <section className="space-y-6 pt-4">
                            <h2 className="text-xl font-black text-deep-blue flex items-center border-l-4 border-life-green pl-4">
                                所在地
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">都道府県</label>
                                    <select
                                        name="address_prefecture"
                                        value={formData.address_prefecture}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-trust-blue transition font-bold"
                                        required
                                    >
                                        <option value="">選択してください</option>
                                        {PREFECTURES.map(pref => (
                                            <option key={pref} value={pref}>{pref}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-1 md:col-span-2 space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">市区町村</label>
                                    <input
                                        type="text"
                                        name="address_city"
                                        value={formData.address_city}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-trust-blue transition font-bold"
                                        placeholder="渋谷区"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Description Section */}
                        <section className="space-y-6 pt-4">
                            <h2 className="text-xl font-black text-deep-blue flex items-center border-l-4 border-life-green pl-4">
                                病院紹介・メッセージ
                            </h2>
                            <div className="space-y-2">
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={5}
                                    className="w-full bg-gray-50 border-none rounded-[32px] p-6 focus:ring-2 focus:ring-trust-blue transition font-bold text-sm"
                                    placeholder="地域密着型の動物病院です。24時間体制で救急にも対応しています..."
                                />
                            </div>
                        </section>

                        <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
                            <button
                                type="button"
                                onClick={handleDeleteAccount}
                                className="text-xs md:text-sm font-bold text-red-400 hover:text-red-600 underline transition"
                            >
                                病院アカウントを削除して退会する
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full md:w-auto bg-trust-blue text-white font-black px-12 py-5 rounded-[24px] shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition disabled:opacity-50"
                            >
                                {saving ? '保存中...' : '設定を保存する'}
                            </button>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}
