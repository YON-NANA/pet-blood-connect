"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HospitalInquiry() {
    const [formData, setFormData] = useState({
        hospitalName: '',
        contactName: '',
        email: '',
        phone: '',
        address: '',
        licenseNumber: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Google Apps Script URL (taken from foster_inquiry.html)
        const scriptURL = 'https://script.google.com/macros/s/AKfycbxdLZVk2S8JJFq6wiNa7O1mH9tyYG4SUeZoxp2VxevUKJv8D2m22auWOQf7FDK71Ybs/exec';

        try {
            await fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({
                    ...formData,
                    sheetName: 'hospital_inquiry' // Using a specific sheet name for hospital inquiries
                })
            });

            // mode: 'no-cors' doesn't allow reading the response, but we assume success if no exception
            setSubmitted(true);
        } catch (err) {
            console.error('Inquiry error:', err);
            setError('送信中にエラーが発生しました。時間をおいて再度お試しください。');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="bg-[#FAFAFA] min-h-screen flex flex-col font-sans">
                <header className="bg-white shadow-sm py-4 h-20 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
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
                    <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-10 text-center border border-gray-100">
                        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h1 className="text-2xl font-black text-deep-blue mb-4">お問い合わせ完了</h1>
                        <p className="text-gray-500 leading-relaxed mb-8">
                            提携申請・お問い合わせありがとうございます。<br />
                            事務局にて内容を確認の上、担当者より折り返しご連絡させていただきます。
                        </p>
                        <Link href="/hospital" className="block w-full bg-trust-blue text-white font-black py-4 rounded-2xl hover:bg-blue-600 transition shadow-lg shadow-blue-100">
                            病院トップへ戻る
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="bg-[#FAFAFA] min-h-screen flex flex-col font-sans">
            <header className="bg-white shadow-sm py-4 h-20 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
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

            <main className="flex-grow py-12 px-4 md:py-20">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl md:text-4xl font-black text-deep-blue mb-4">新規提携・お問い合わせ</h1>
                        <p className="text-gray-500 font-medium">日本動物共助機構（AMAJ）供血ネットワークへの参加申請</p>
                    </div>

                    <div className="bg-white rounded-[40px] shadow-2xl p-8 md:p-12 border border-blue-50">
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl text-sm mb-8 flex items-center">
                                <span className="mr-3 text-lg">⚠️</span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">病院名<span className="text-life-red ml-1">*</span></label>
                                    <input
                                        type="text" name="hospitalName" required
                                        value={formData.hospitalName} onChange={handleChange}
                                        placeholder="〇〇動物病院"
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-trust-blue transition text-gray-800"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">担当者名<span className="text-life-red ml-1">*</span></label>
                                    <input
                                        type="text" name="contactName" required
                                        value={formData.contactName} onChange={handleChange}
                                        placeholder="山田 太郎"
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-trust-blue transition text-gray-800"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">メールアドレス<span className="text-life-red ml-1">*</span></label>
                                    <input
                                        type="email" name="email" required
                                        value={formData.email} onChange={handleChange}
                                        placeholder="hospital@example.com"
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-trust-blue transition text-gray-800"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">電話番号<span className="text-life-red ml-1">*</span></label>
                                    <input
                                        type="tel" name="phone" required
                                        value={formData.phone} onChange={handleChange}
                                        placeholder="03-1234-5678"
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-trust-blue transition text-gray-800"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">病院所在地</label>
                                <input
                                    type="text" name="address"
                                    value={formData.address} onChange={handleChange}
                                    placeholder="東京都渋谷区..."
                                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-trust-blue transition text-gray-800"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">獣医療法に基づく届出番号（任意）</label>
                                <input
                                    type="text" name="licenseNumber"
                                    value={formData.licenseNumber} onChange={handleChange}
                                    placeholder="届出番号などの審査用情報"
                                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-trust-blue transition text-gray-800"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">お問い合わせ内容<span className="text-life-red ml-1">*</span></label>
                                <textarea
                                    name="message" required
                                    value={formData.message} onChange={handleChange}
                                    placeholder="提携を希望される旨や、ご質問などをご記入ください"
                                    rows={5}
                                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-trust-blue transition text-gray-800"
                                ></textarea>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-trust-blue text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-600 active:scale-95 disabled:bg-gray-200 transition-all duration-300 text-lg"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            送信中...
                                        </span>
                                    ) : 'この内容で送信する'}
                                </button>
                                <p className="text-center text-[10px] text-gray-400 font-black uppercase tracking-widest mt-6">
                                    Animal Mutual Aid Japan (AMAJ)
                                </p>
                                <p className="text-center text-[8px] text-gray-300 font-bold mt-4 max-w-sm mx-auto leading-relaxed">
                                    ※本システムはJSVTM（日本獣医輸血研究会）の指針を参考に設計されています。
                                </p>
                            </div>
                        </form>
                    </div>

                    <div className="mt-8 text-center">
                        <Link href="/hospital/login" className="text-trust-blue font-bold hover:underline transition">
                            すでにお持ちのアカウントでログイン
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
