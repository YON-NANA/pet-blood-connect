"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function HospitalLogin() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            // ログイン成功したらダッシュボードへ
            router.push('/hospital/dashboard');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : '不明なエラー';
            console.error('Login error:', message);
            setError('ログインに失敗しました。メールアドレスまたはパスワードが正しくありません。');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-warm-gray min-h-screen flex flex-col font-sans">
            <header className="bg-white shadow-sm py-4 h-20 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
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
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center px-4 py-12">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-gray-100">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 text-trust-blue rounded-[30%] mb-4 shadow-inner">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                        </div>
                        <h1 className="text-2xl font-black text-deep-blue">動物病院 ログイン</h1>
                        <p className="text-gray-400 mt-2 font-medium">日本動物救済機構（JARA）提携管理画面</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm mb-6 flex items-start">
                            <span className="mr-2">⚠️</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">メールアドレス</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="hospital@jara.or.jp" required
                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white focus:ring-2 focus:ring-trust-blue focus:border-transparent transition text-gray-800"
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">パスワード</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••" required
                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white focus:ring-2 focus:ring-trust-blue focus:border-transparent transition text-gray-800"
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
                    </form>

                    <div className="mt-8 pt-8 border-t border-gray-50 text-center">
                        <p className="text-gray-400 text-xs font-medium leading-relaxed">
                            Japan Animal Rescue Agency (JARA)<br />
                            新規提携をご希望の病院様は <Link href="/hospital/inquiry" className="text-trust-blue font-black hover:underline">お問合せフォーム</Link> へ
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
