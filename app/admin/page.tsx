"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Hospital {
    id: string;
    hospital_name: string;
    address_prefecture: string;
    address_city: string;
    phone_number: string;
    created_at: string;
    is_verified: boolean;
}

interface Donor {
    id: string;
    pet_name: string;
    species: string;
    breed: string;
    weight_kg: number;
    blood_type: string;
    prefecture: string;
    city: string;
    contact_name: string;
    contact_phone: string;
    created_at: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [activeTab, setActiveTab] = useState<'hospitals' | 'donors' | 'matches'>('hospitals');
    
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [donors, setDonors] = useState<Donor[]>([]);
    const [matches, setMatches] = useState<any[]>([]);

    useEffect(() => {
        async function checkAdminAndFetch() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push('/login?redirect=/admin');
                    return;
                }

                // 現時点では、特定のメールアドレスを持つユーザーを管理者として認める
                // ヨンナナ様のメールアドレスを管理権限とする
                const adminEmails = ['animalbloodconnect@gmail.com', 'yonnanahogo@gmail.com']; 
                if (!adminEmails.includes(user.email?.toLowerCase() || '')) {
                    alert('管理者権限がありません。');
                    router.push('/');
                    return;
                }

                setIsAdmin(true);

                // 全データの取得
                const [hospData, donorData, matchData] = await Promise.all([
                    supabase.from('hospitals').select('*').order('created_at', { ascending: false }),
                    supabase.from('donors').select('*').order('created_at', { ascending: false }),
                    supabase.from('matches').select('*, hospitals(hospital_name), donors(pet_name)').order('created_at', { ascending: false })
                ]);

                if (hospData.data) setHospitals(hospData.data);
                if (donorData.data) setDonors(donorData.data);
                if (matchData.data) setMatches(matchData.data);

            } catch (err) {
                console.error('Admin Fetch Error:', err);
            } finally {
                setLoading(false);
            }
        }
        checkAdminAndFetch();
    }, [router]);

    const handleDeleteUser = async (table: string, id: string, name: string) => {
        if (!confirm(`【警告】${name} をシステムから完全に削除しますか？\nこの操作は取り消せません。関連するすべてのデータが削除されます。`)) return;
        
        try {
            const { error } = await supabase.from(table).delete().eq('id', id);
            if (error) throw error;
            
            alert('削除が完了しました。');
            window.location.reload();
        } catch (err: any) {
            alert('削除に失敗しました: ' + err.message);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-life-red"></div>
        </div>
    );

    if (!isAdmin) return null;

    return (
        <div className="bg-[#0F172A] min-h-screen font-sans text-gray-100 antialiased selection:bg-life-red selection:text-white">
            {/* Header */}
            <header className="bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 py-4 px-8">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href="/" className="flex items-center">
                            <Image src="/assets/logo_v2.png" alt="Logo" width={40} height={40} className="h-8 w-auto brightness-200" />
                        </Link>
                        <div className="h-6 w-px bg-white/10 mx-4"></div>
                        <div>
                            <h1 className="text-lg font-black tracking-tighter uppercase">Admin Central Control</h1>
                            <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase mt-0.5 leading-none">Management System Alpha</p>
                        </div>
                    </div>
                    <Link href="/" className="text-xs font-black text-white/40 hover:text-white transition uppercase tracking-widest leading-none border border-white/10 px-4 py-2 rounded-full">
                        Back to Site
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-8 py-12">
                
                {/* Statistics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Registered Hospitals', value: hospitals.length, emoji: '🏥' },
                        { label: 'Registered Donors', value: donors.length, emoji: '🐾' },
                        { label: 'Active Matches', value: matches.filter(m => m.status !== 'completed' && m.status !== 'cancelled').length, emoji: '💬' },
                        { label: 'Completed Lives', value: matches.filter(m => m.status === 'completed').length, emoji: '❤️' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-4 opacity-20 transform group-hover:scale-110 transition duration-500">{stat.emoji}</div>
                           <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 leading-none">{stat.label}</p>
                           <p className="text-3xl font-black text-white tracking-tighter">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex space-x-2 mb-10 bg-white/5 p-1 rounded-2xl w-fit border border-white/5">
                    {[
                        { id: 'hospitals', label: '🏥 動物病院' },
                        { id: 'donors', label: '🐾 ドナー' },
                        { id: 'matches', label: '💬 マッチング履歴' },
                    ].map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id as any)}
                            className={`px-8 py-3 rounded-xl font-black text-xs tracking-widest uppercase transition-all duration-300 ${activeTab === t.id ? 'bg-life-red text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Hospital List */}
                {activeTab === 'hospitals' && (
                    <div className="bg-white/5 rounded-[40px] border border-white/10 overflow-hidden shadow-2xl animate-in fade-in duration-500">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] border-b border-white/10">
                                <tr>
                                    <th className="px-8 py-6">病院名 / 所在地</th>
                                    <th className="px-8 py-6">連絡先</th>
                                    <th className="px-8 py-6">登録日</th>
                                    <th className="px-8 py-6">状態</th>
                                    <th className="px-8 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-medium">
                                {hospitals.map(h => (
                                    <tr key={h.id} className="hover:bg-white/5 transition group">
                                        <td className="px-8 py-6">
                                            <div className="font-black text-white mb-1 group-hover:text-life-red transition">{h.hospital_name}</div>
                                            <div className="text-[11px] text-white/40">{h.address_prefecture} {h.address_city}</div>
                                        </td>
                                        <td className="px-8 py-6 text-white/60">{h.phone_number || '(未登録)'}</td>
                                        <td className="px-8 py-6 text-white/30 text-xs">{new Date(h.created_at).toLocaleDateString('ja-JP')}</td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${h.is_verified ? 'bg-life-green/10 text-life-green' : 'bg-orange-500/10 text-orange-400'}`}>
                                                {h.is_verified ? 'Verified' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button 
                                                onClick={() => handleDeleteUser('hospitals', h.id, h.hospital_name)}
                                                className="text-red-400/50 hover:text-red-500 font-black text-[10px] uppercase tracking-widest transition"
                                            >
                                                Ban Account
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Donor List */}
                {activeTab === 'donors' && (
                    <div className="bg-white/5 rounded-[40px] border border-white/10 overflow-hidden shadow-2xl animate-in fade-in duration-500">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] border-b border-white/10">
                                <tr>
                                    <th className="px-8 py-6">ペット / 品種</th>
                                    <th className="px-8 py-6">飼い主</th>
                                    <th className="px-8 py-6">所在地</th>
                                    <th className="px-8 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-medium">
                                {donors.map(d => (
                                    <tr key={d.id} className="hover:bg-white/5 transition group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-4">
                                                <span className="text-xl">{d.species === 'dog' ? '🐶' : '🐱'}</span>
                                                <div>
                                                    <div className="font-black text-white mb-1 group-hover:text-life-red transition">{d.pet_name}</div>
                                                    <div className="text-[11px] text-white/40">{d.breed} / {d.blood_type || '不明'}型</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-white/60 font-black text-xs">{d.contact_name}</div>
                                            <div className="text-[10px] text-white/30 mt-1 uppercase tracking-widest">{d.contact_phone}</div>
                                        </td>
                                        <td className="px-8 py-6 text-white/40 text-xs">{d.prefecture} {d.city}</td>
                                        <td className="px-8 py-6 text-right">
                                            <button 
                                                onClick={() => handleDeleteUser('donors', d.id, d.pet_name)}
                                                className="text-red-400/50 hover:text-red-500 font-black text-[10px] uppercase tracking-widest transition"
                                            >
                                                Hide Pet
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Match List */}
                {activeTab === 'matches' && (
                    <div className="bg-white/5 rounded-[40px] border border-white/10 overflow-hidden shadow-2xl animate-in fade-in duration-500">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] border-b border-white/10">
                                <tr>
                                    <th className="px-8 py-6">マッチング概要</th>
                                    <th className="px-8 py-6">ステータス</th>
                                    <th className="px-8 py-6">開始日</th>
                                    <th className="px-8 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-medium">
                                {matches.map(m => (
                                    <tr key={m.id} className="hover:bg-white/5 transition group">
                                        <td className="px-8 py-6 text-xs">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <span className="text-white/40 uppercase font-black text-[9px] tracking-widest">Hospital:</span>
                                                <span className="text-white font-black">{m.hospitals?.hospital_name}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-white/40 uppercase font-black text-[9px] tracking-widest">Donor:</span>
                                                <span className="text-life-green font-black">{m.donors?.pet_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                m.status === 'completed' ? 'border-life-green bg-life-green/10 text-life-green' :
                                                m.status === 'cancelled' || m.status === 'hospital_cancelled' ? 'border-red-500 bg-red-500/10 text-red-400' :
                                                'border-blue-400 bg-blue-400/10 text-blue-300'
                                            }`}>
                                                {m.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-white/30 text-xs">{new Date(m.created_at).toLocaleDateString('ja-JP')}</td>
                                        <td className="px-8 py-6 text-right">
                                            <button 
                                                className="text-white/20 hover:text-white transition font-black text-[10px] uppercase tracking-widest underline underline-offset-4"
                                                onClick={() => router.push(`/chat/${m.donor_id}?matchId=${m.id}&view=admin`)}
                                            >
                                                Chat Log
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}
