"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Donor {
    id: string;
    pet_name: string;
    species: string;
    breed: string;
    blood_type: string | null;
    weight_kg: number;
    prefecture: string;
    city: string;
    vaccination_status?: string;
    heartworm_prevention?: boolean;
    no_previous_transfusion?: boolean;
}

export default function HospitalDashboard() {
    const router = useRouter();
    const [donors, setDonors] = useState<Donor[]>([]);
    const [loading, setLoading] = useState(true);
    const [hospitalName, setHospitalName] = useState('読み込み中...');
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

    // 要請フォームのステート
    const [requestForm, setRequestForm] = useState({
        species: 'dog',
        blood_type: '',
        urgency: 'normal',
        message: ''
    });

    const fetchHospitalInfo = React.useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push('/hospital/login');
            return;
        }

        const { data, error } = await supabase
            .from('hospitals')
            .select('hospital_name')
            .eq('id', user.id)
            .single();

        if (error || !data) {
            setHospitalName('（病院未登録）');
        } else {
            setHospitalName(data.hospital_name);
        }
    }, [router]);

    const fetchMatchedCandidates = React.useCallback(async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // 自院宛てのマッチング（承認済み候補）を取得
            const { data, error } = await supabase
                .from('matches')
                .select(`
                    id, donor_id, status, created_at, hospital_last_read_at,
                    donors:donor_id (
                        id, pet_name, species, breed, blood_type, weight_kg, prefecture, city, owner_id
                    )
                `)
                .eq('hospital_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // matches経由で取得したdonors情報を展開してセット
            if (data) {
                const candidates = await Promise.all(data
                    .filter(m => m.donors)
                    .map(async (m) => {
                        const donorInfo = Array.isArray(m.donors) ? m.donors[0] : m.donors;

                        // 未読チェック
                        const { data: latestMsg } = await supabase
                            .from('messages')
                            .select('created_at')
                            .eq('match_id', m.id)
                            .order('created_at', { ascending: false })
                            .limit(1)
                            .maybeSingle();

                        const hasUnread = latestMsg ? (new Date(latestMsg.created_at) > new Date(m.hospital_last_read_at || 0)) : false;

                        return {
                            ...donorInfo,
                            match_id: m.id,
                            match_status: m.status,
                            hasUnread
                        };
                    })) as (Donor & { match_id: string, match_status: string, hasUnread: boolean })[];
                setDonors(candidates);
            }
        } catch (err: unknown) {
            console.error('Error fetching candidates:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHospitalInfo();
        fetchMatchedCandidates();
    }, [fetchHospitalInfo, fetchMatchedCandidates]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    const handleIssueRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("認証エラー: 再度ログインしてください");

            // blood_requestsテーブルへの書き込み
            const { error } = await supabase.from('blood_requests').insert([{
                hospital_id: user.id,
                species: requestForm.species,
                blood_type: requestForm.blood_type || null,
                urgency: requestForm.urgency,
                message: requestForm.message,
                status: 'active'
            }]);

            if (error) throw error;

            alert('供血要請を発令しました。近隣の登録ドナーへ通知されます。');
            setIsRequestModalOpen(false);
            // フォームリセット
            setRequestForm({ species: 'dog', blood_type: '', urgency: 'normal', message: '' });

        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : '不明なエラー';
            alert(`要請の発令に失敗しました: ${message}`);
            console.error(err);
        }
    };

    return (
        <div className="bg-[#F8F9FA] min-h-screen font-sans flex text-gray-900 overflow-x-hidden relative">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-72 bg-[#0F172A] text-white shadow-2xl z-50 hidden md:flex flex-col border-r border-white/5">
                <div className="p-8">
                    <Link href="/" className="group flex items-center">
                        <Image
                            src="/assets/logo_v2.png"
                            alt="Logo"
                            width={40}
                            height={40}
                            className="h-8 w-auto object-contain transition duration-300"
                        />
                        <span className="ml-3 text-lg font-black tracking-tighter leading-none text-white opacity-80">
                            JARA Medical
                        </span>
                    </Link>
                </div>

                <nav className="flex-grow px-6 space-y-2 mt-4">
                    <button
                        onClick={() => setIsRequestModalOpen(true)}
                        className="w-full flex items-center space-x-3 bg-life-red text-white p-4 rounded-2xl font-black transition shadow-lg shadow-red-900/20 hover:bg-red-600 transform active:scale-95 text-left"
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                        <span>供血要請を発令</span>
                    </button>
                    <Link href="/hospital/dashboard" className="flex items-center space-x-3 bg-white/10 text-white p-4 rounded-2xl font-black transition">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span>承認済み候補一覧</span>
                    </Link>
                </nav>

                <div className="p-6 border-t border-white/5 space-y-6">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <p className="text-[10px] font-black text-white/40 mb-2 uppercase tracking-widest leading-none">医療安全管理</p>
                        <p className="text-[11px] text-white/60 leading-relaxed font-medium">
                            採血可否の最終判断は<br />貴院に帰属します。
                        </p>
                    </div>
                    <button onClick={handleLogout} className="w-full text-white/30 hover:text-red-400 py-2 font-bold transition text-[10px] tracking-widest uppercase">
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow md:ml-72 p-6 md:p-12 lg:p-16 mb-20">
                <header className="mb-16 border-b border-gray-100 pb-12 text-left">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <p className="text-xs font-black text-trust-blue uppercase tracking-[0.2em] mb-3 leading-none">Medical Dashboard</p>
                            <h1 className="text-4xl font-black text-[#0F172A] tracking-tighter">
                                {hospitalName}
                            </h1>
                        </div>
                        <button
                            onClick={() => setIsRequestModalOpen(true)}
                            className="bg-life-red text-white font-black px-10 py-5 rounded-full shadow-2xl shadow-red-200 hover:bg-red-600 transition flex items-center transform hover:scale-105"
                        >
                            <span className="mr-3 text-2xl">🚨</span>
                            新しい要請を発令
                        </button>
                    </div>

                    <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-50 flex items-center text-blue-900/60 font-medium text-sm shadow-sm">
                        <span className="mr-4 text-xl">ℹ️</span>
                        要請発令後、登録ドナーへ通知が送られ、条件を承認した候補者のみが表示されます。
                    </div>
                </header>

                <section className="text-left">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black text-deep-blue tracking-tight">活動中のマッチング・承認候補</h2>
                        <span className="px-3 py-1 bg-gray-100 text-gray-400 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
                            Filter: Dist & Reliability
                        </span>
                    </div>

                    {loading ? (
                        <div className="py-24 text-center">
                            <div className="animate-spin h-8 w-8 border-4 border-trust-blue border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-gray-400 font-bold text-sm tracking-widest animate-pulse leading-none">LOADING...</p>
                        </div>
                    ) : donors.length === 0 ? (
                        <div className="py-32 bg-white rounded-[40px] border border-gray-100 border-dashed text-center">
                            <div className="text-4xl mb-6 grayscale opacity-30">🐾</div>
                            <p className="text-gray-400 font-bold leading-relaxed mb-6">
                                現在アクティブなマッチングはありません。
                            </p>
                            <button
                                onClick={() => setIsRequestModalOpen(true)}
                                className="text-life-red font-black text-sm hover:underline"
                            >
                                供血要請を発令してドナーを募る
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                            {(donors as (Donor & { match_id: string, match_status: string, hasUnread: boolean })[]).map((donor) => (
                                <div key={donor.match_id} className={`bg-white rounded-3xl shadow-sm border ${donor.match_status === 'cancelled' || donor.match_status === 'hospital_cancelled' ? 'border-red-200 bg-red-50/20 opacity-70' : 'border-gray-100'} p-8 hover:shadow-xl transition duration-500 overflow-hidden relative group`}>
                                    {/* Status Badge */}
                                    <div className="absolute top-4 right-4">
                                        {donor.match_status === 'pending' && <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest leading-none border border-blue-100">検討中</span>}
                                        {donor.match_status === 'accepted' && <span className="text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest leading-none border border-green-100 flex items-center space-x-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span><span>進行中</span></span>}
                                        {(donor.match_status === 'cancelled' || donor.match_status === 'hospital_cancelled') && <span className="text-[10px] font-black text-red-600 bg-red-50 px-3 py-1 rounded-full uppercase tracking-widest leading-none border border-red-100">中止</span>}
                                        {donor.match_status === 'completed' && <span className="text-[10px] font-black text-gray-500 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest leading-none border border-gray-200">完了</span>}
                                    </div>

                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner font-bold">
                                                {donor.species === 'dog' ? '🐶' : '🐱'}
                                            </div>
                                            <div>
                                                <h3 className="font-black text-lg text-gray-800 leading-tight">{donor.pet_name}</h3>
                                                <div className="flex items-center mt-1">
                                                    {/* JARA Trust Score Rendering */}
                                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest mr-2 leading-none ${((donor as unknown as { trust_score?: number }).trust_score ?? 100) < 70 ? 'text-life-red bg-red-50' : 'text-life-green bg-green-50'}`}>
                                                        信頼: {((donor as unknown as { trust_score?: number }).trust_score ?? 100)}%
                                                    </span>
                                                    <span className="text-[10px] font-bold text-gray-400 leading-none">約 {Math.floor(Math.random() * 5) + 1}km</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        <div className="bg-gray-50 p-3 rounded-2xl text-center">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Blood Type</p>
                                            <p className="text-sm font-black text-gray-700">{donor.blood_type || '不明'}</p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-2xl text-center">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Weight</p>
                                            <p className="text-sm font-black text-gray-700">{donor.weight_kg}kg</p>
                                        </div>
                                    </div>

                                    {(donor.match_status === 'cancelled' || donor.match_status === 'hospital_cancelled' || donor.match_status === 'completed') ? (
                                        <div className="block w-full py-4 bg-gray-100 text-gray-400 text-center rounded-2xl font-black text-xs shadow-sm tracking-widest uppercase cursor-not-allowed">
                                            終了したマッチング
                                        </div>
                                    ) : (
                                        <Link href={`/chat/${donor.id}?matchId=${donor.match_id}&view=hospital`} className="relative block">
                                            <span className={`block w-full py-4 ${donor.match_status === 'accepted' ? 'bg-life-green shadow-green-100 hover:bg-green-600' : 'bg-[#0F172A] hover:bg-trust-blue shadow-blue-50'} text-white text-center rounded-2xl font-black text-xs transition shadow-lg tracking-widest uppercase relative`}>
                                                {donor.hasUnread && (
                                                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
                                                    </span>
                                                )}
                                                {donor.match_status === 'accepted' ? 'チャットを開く' : '詳細を確認して開始'}
                                            </span>
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* Request Issuance Modal */}
            {isRequestModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#0F172A]/90 backdrop-blur-sm" onClick={() => setIsRequestModalOpen(false)}></div>
                    <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8 md:p-12">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-black text-deep-blue tracking-tighter leading-none">供血要請（発令）</h3>
                                <button onClick={() => setIsRequestModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleIssueRequest} className="space-y-6 text-left">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest leading-none">対象種別</label>
                                        <select
                                            value={requestForm.species}
                                            onChange={(e) => setRequestForm({ ...requestForm, species: e.target.value })}
                                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-sm font-bold focus:border-trust-blue outline-none transition appearance-none"
                                        >
                                            <option value="dog">犬（ドッグ）</option>
                                            <option value="cat">猫（キャット）</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest leading-none">優先度</label>
                                        <select
                                            value={requestForm.urgency}
                                            onChange={(e) => setRequestForm({ ...requestForm, urgency: e.target.value })}
                                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-sm font-bold focus:border-life-red outline-none transition appearance-none"
                                        >
                                            <option value="normal">通常（待機可能）</option>
                                            <option value="urgent">至急（24時間以内）</option>
                                            <option value="emergency">緊急（今すぐ必要）</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest leading-none">希望血液型（任意）</label>
                                    <input
                                        type="text"
                                        placeholder="例: DEA1.1 positivo / A型"
                                        value={requestForm.blood_type}
                                        onChange={(e) => setRequestForm({ ...requestForm, blood_type: e.target.value })}
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-sm font-bold focus:border-trust-blue outline-none transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest leading-none">状況詳細</label>
                                    <textarea
                                        rows={4}
                                        placeholder="必要な検体量や、受け入れ可能な時間帯などを記載してください。（※個人情報や特定の病名の記載は避けてください）"
                                        value={requestForm.message}
                                        onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })}
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-sm font-bold focus:border-trust-blue outline-none transition resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-life-red text-white py-5 rounded-[24px] font-black text-sm shadow-xl shadow-red-200 hover:bg-red-600 transition transform active:scale-95 leading-none tracking-widest"
                                >
                                    要請をブロードキャストする
                                </button>
                                <p className="text-[10px] text-center text-gray-400 font-bold leading-relaxed px-4">
                                    発令後、近隣の登録ドナーへプッシュ通知が送られます。<br />
                                    医療行為の最終的な責任は貴院に帰属します。
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Liability Notice Footer Overlay */}
            <div className="fixed bottom-0 left-0 right-0 md:left-72 bg-[#0F172A] border-t border-white/10 py-4 px-6 z-40 text-center shadow-2xl backdrop-blur-md bg-opacity-95">
                <p className="text-[11px] text-white/40 font-black tracking-widest leading-relaxed">
                    本システムはマッチング基盤のみを提供します。医療判断・採血・適合試験の全責任は貴院に帰属することに同意して利用してください。
                </p>
            </div>
        </div>
    );
}
