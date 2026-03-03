"use client";

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/';

    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (isLogin) {
                const { error: authError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (authError) throw authError;
                router.push(redirectTo);
            } else {
                const { error: authError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                });
                if (authError) throw authError;
                setMessage('確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。');
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : '不明なエラー';
            console.error('Auth error:', message);
            setError(message === 'Invalid login credentials' ? 'メールアドレスまたはパスワードが正しくありません。' : message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-warm-gray min-h-screen flex flex-col font-sans">
            <header className="bg-white shadow-sm py-4 px-6 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center group">
                        <Image
                            src="/assets/logo_v2.png"
                            alt="Logo"
                            width={50}
                            height={50}
                            className="h-10 w-auto object-contain transform group-hover:scale-105 transition duration-300"
                        />
                        <span className="ml-3 text-xl font-black tracking-tighter leading-none">
                            <span className="text-life-green">Animal</span>
                            <span className="text-life-red">Blood</span>
                            <span className="text-trust-blue">Connect</span>
                        </span>
                    </Link>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center px-4 py-12">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-gray-100 overflow-hidden relative">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-black text-deep-blue mb-2">
                            {isLogin ? 'おかえりなさい' : 'アカウント作成'}
                        </h1>
                        <p className="text-gray-500">
                            {isLogin ? 'ログインして活動を再開しましょう' : 'ドナー登録にはアカウントが必要です'}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm mb-6 flex items-start">
                            <span className="mr-2">⚠️</span>
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="bg-green-50 border border-green-100 text-green-700 px-4 py-4 rounded-2xl text-sm mb-6 flex items-start">
                            <span className="mr-2">✅</span>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">メールアドレス</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@mail.com" required
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
                                placeholder="6文字以上のパスワード" required
                                minLength={6}
                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white focus:ring-2 focus:ring-trust-blue focus:border-transparent transition text-gray-800"
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-trust-blue text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-600 active:scale-95 disabled:bg-gray-300 transition-all duration-200 mt-4"
                            disabled={loading}
                        >
                            {loading ? '処理中...' : (isLogin ? 'ログイン' : '登録する')}
                        </button>
                    </form>

                    <div className="mt-8 text-center space-y-4">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-sm font-bold text-trust-blue hover:text-blue-700 transition"
                        >
                            {isLogin ? 'アカウントを新規作成する' : '既にアカウントをお持ちの方'}
                        </button>
                        <div className="pt-4 border-t border-gray-50">
                            <Link href="/hospital/login" className="text-xs text-gray-400 hover:text-gray-600 transition">
                                病院の方はこちら
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">読み込み中...</div>}>
            <LoginContent />
        </Suspense>
    );
}
