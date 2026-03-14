"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function HospitalLogin() {
    const router = useRouter();
    const [tab, setTab] = useState<'login' | 'signup'>('signup'); // 新規登録をデフォルトに
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hospitalName, setHospitalName] = useState('');
    const [prefecture, setPrefecture] = useState('徳島県');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ── ログイン ──
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
            if (authError) throw authError;
            router.push('/hospital/dashboard');
        } catch {
            setError('メールアドレスまたはパスワードが正しくありません。');
        } finally {
            setLoading(false);
        }
    };

    // ── 新規登録 (審査なし・即時使用可) ──
    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!hospitalName.trim()) {
            setError('病院名を入力してください。');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            // 1. Auth アカウント作成
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
            });
            if (authError) throw authError;

            const userId = authData.user?.id;
            if (!userId) throw new Error('ユーザーIDの取得に失敗しました。');

            // 2. profiles テーブルに病院ロールで登録
            await supabase.from('profiles').upsert({
                id: userId,
                role: 'hospital',
                display_name: hospitalName,
            });

            // 3. hospitals テーブルに基本情報を即時登録（is_verified = false）
            await supabase.from('hospitals').upsert({
                id: userId,
                hospital_name: hospitalName,
                address_prefecture: prefecture,
                address_city: '',
                is_verified: false, // 後から運営が確認する（使用には影響しない）
            });

            // 4. ダッシュボードへ
            router.push('/hospital/dashboard');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : '不明なエラー';
            if (msg.includes('already registered') || msg.includes('already been registered')) {
                setError('このメールアドレスはすでに登録されています。ログインタブをご利用ください。');
            } else {
                setError('登録に失敗しました: ' + msg);
            }
        } finally {
            setLoading(false);
        }
    };

    const PREFECTURES = [
        '北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県',
        '茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県',
        '新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県',
        '静岡県','愛知県','三重県','滋賀県','京都府','大阪府','兵庫県',
        '奈良県','和歌山県','鳥取県','島根県','岡山県','広島県','山口県',
        '徳島県','香川県','愛媛県','高知県','福岡県','佐賀県','長崎県',
        '熊本県','大分県','宮崎県','鹿児島県','沖縄県',
    ];

    return (
        <div className="bg-gradient-to-b from-blue-50 to-gray-50 min-h-screen flex flex-col font-sans">
            <header className="bg-white/80 backdrop-blur-md shadow-sm py-4 h-20 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
                    <Link href="/" className="flex items-center group">
                        <Image
                            src="/assets/logo_v2.png"
                            alt="Logo"
                            width={50}
                            height={50}
                            className="h-12 w-auto object-contain transform group-hover:scale-105 transition duration-300"
                        />
                        <span className="ml-3 text-xl font-black tracking-tighter hidden sm:block leading-none">
                            <span className="text-life-green">Animal</span>
                            <span className="text-life-red">Blood</span>
                            <span className="text-trust-blue">Connect</span>
                        </span>
                    </Link>
                    <Link href="/hospital" className="text-xs font-black text-gray-400 hover:text-trust-blue transition uppercase tracking-widest">
                        ← 病院様向けページへ
                    </Link>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center px-4 py-12">
                <div className="max-w-md w-full">
                    {/* タイトル */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-trust-blue/10 text-trust-blue rounded-[30%] mb-4 shadow-inner">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-black text-deep-blue">動物病院 管理画面</h1>
                        <p className="text-gray-400 mt-2 font-bold text-sm">事前審査なし・すぐに使えます</p>
                    </div>

                    {/* タブ切り替え */}
                    <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
                        <button
                            onClick={() => { setTab('signup'); setError(null); }}
                            className={`flex-1 py-3 rounded-xl font-black text-sm transition-all duration-200 ${tab === 'signup' ? 'bg-white text-trust-blue shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            🏥 無料登録して始める
                        </button>
                        <button
                            onClick={() => { setTab('login'); setError(null); }}
                            className={`flex-1 py-3 rounded-xl font-black text-sm transition-all duration-200 ${tab === 'login' ? 'bg-white text-trust-blue shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            ログイン
                        </button>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">

                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm mb-6 flex items-start">
                                <span className="mr-2 flex-shrink-0">⚠️</span>
                                {error}
                            </div>
                        )}

                        {/* ── 新規登録フォーム ── */}
                        {tab === 'signup' && (
                            <>
                                <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-6">
                                    <p className="text-xs font-black text-life-green uppercase tracking-widest mb-1">✅ 審査不要・即時利用可能</p>
                                    <p className="text-xs text-gray-500 font-bold leading-relaxed">
                                        登録後すぐにドナー検索・供血要請が使えます。<br />
                                        病院詳細情報はダッシュボードの「設定」から後で入力できます。
                                    </p>
                                </div>

                                <form onSubmit={handleSignup} className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                                            病院名 <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={hospitalName}
                                            onChange={(e) => setHospitalName(e.target.value)}
                                            placeholder="〇〇動物病院"
                                            required
                                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-trust-blue outline-none transition text-gray-800 font-bold border border-gray-100"
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">都道府県</label>
                                        <select
                                            value={prefecture}
                                            onChange={(e) => setPrefecture(e.target.value)}
                                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-trust-blue outline-none transition text-gray-800 font-bold border border-gray-100 appearance-none"
                                            disabled={loading}
                                        >
                                            {PREFECTURES.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                                            メールアドレス <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="info@your-clinic.jp"
                                            required
                                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-trust-blue outline-none transition text-gray-800 font-bold border border-gray-100"
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                                            パスワード（8文字以上） <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            required
                                            minLength={8}
                                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-trust-blue outline-none transition text-gray-800 font-bold border border-gray-100"
                                            disabled={loading}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-trust-blue text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-600 active:scale-95 disabled:bg-gray-200 transition-all duration-200 text-base"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                登録中...
                                            </span>
                                        ) : '🏥 登録してダッシュボードへ'}
                                    </button>
                                </form>
                            </>
                        )}

                        {/* ── ログインフォーム ── */}
                        {tab === 'login' && (
                            <form onSubmit={handleLogin} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">メールアドレス</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="info@your-clinic.jp"
                                        required
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-trust-blue outline-none transition text-gray-800 font-bold border border-gray-100"
                                        disabled={loading}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">パスワード</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-trust-blue outline-none transition text-gray-800 font-bold border border-gray-100"
                                        disabled={loading}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-trust-blue text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-600 active:scale-95 disabled:bg-gray-200 transition-all duration-200"
                                    disabled={loading}
                                >
                                    {loading ? 'ログイン中...' : '管理画面へログイン'}
                                </button>
                                <p className="text-center text-xs text-gray-400 font-bold">
                                    アカウントをお持ちでない方は{' '}
                                    <button onClick={() => setTab('signup')} className="text-trust-blue font-black hover:underline">
                                        こちらから無料登録
                                    </button>
                                </p>
                            </form>
                        )}

                        {/* 共通フッター */}
                        <div className="mt-6 pt-6 border-t border-gray-50 text-center space-y-2">
                            <p className="text-gray-400 text-xs font-medium leading-relaxed">
                                Animal Blood Connect（ABC）<br />
                                運営: 動物保護団体ヨンナナ × JARA
                            </p>
                            <Link href="/hospital" className="text-trust-blue text-xs font-black hover:underline block">
                                病院様向けサービス紹介を見る →
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
