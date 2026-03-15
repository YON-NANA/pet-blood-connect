"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function PartnerInquiry() {
    const [formData, setFormData] = useState({
        orgName: '',
        orgType: '動物保護団体',
        contactName: '',
        email: '',
        phone: '',
        prefecture: '徳島県',
        address: '',
        animalCount: '',
        dogCount: '',
        catCount: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const scriptURL = 'https://script.google.com/macros/s/AKfycbxdLZVk2S8JJFq6wiNa7O1mH9tyYG4SUeZoxp2VxevUKJv8D2m22auWOQf7FDK71Ybs/exec';

        try {
            await fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({
                    ...formData,
                    sheetName: 'partner_inquiry'
                })
            });
            setSubmitted(true);
        } catch (err) {
            console.error('Inquiry error:', err);
            setError('送信中にエラーが発生しました。時間をおいて再度お試しください。');
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

    if (submitted) {
        return (
            <div className="bg-[#FAFAFA] min-h-screen flex flex-col font-sans">
                <header className="bg-white shadow-sm py-4 h-20 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
                        <Link href="/" className="flex items-center group">
                            <Image src="/assets/logo_v2.png" alt="Logo" width={50} height={50}
                                className="h-12 w-auto object-contain" />
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
                            パートナー登録のお問い合わせありがとうございます。<br />
                            事務局にて内容を確認の上、折り返しご連絡いたします。
                        </p>
                        <Link href="/" className="block w-full bg-life-green text-white font-black py-4 rounded-2xl hover:bg-green-700 transition shadow-lg shadow-green-100">
                            トップページへ戻る
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="bg-[#FAFAFA] min-h-screen flex flex-col font-sans">
            <header className="bg-white shadow-sm py-4 h-20 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
                    <Link href="/" className="flex items-center group">
                        <Image src="/assets/logo_v2.png" alt="Logo" width={50} height={50}
                            className="h-12 w-auto object-contain" />
                        <span className="ml-3 text-xl font-black tracking-tighter hidden sm:block leading-none">
                            <span className="text-life-green">Animal</span>
                            <span className="text-life-red">Blood</span>
                            <span className="text-trust-blue">Connect</span>
                        </span>
                    </Link>
                    <Link href="/" className="text-xs font-black text-gray-400 hover:text-life-green transition uppercase tracking-widest">
                        ← トップへ
                    </Link>
                </div>
            </header>

            <main className="flex-grow py-12 px-4 md:py-20">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-block bg-green-100 text-life-green text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest mb-4">
                            🤝 パートナー募集
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-deep-blue mb-4">保護団体パートナー登録</h1>
                        <p className="text-gray-500 font-medium text-sm leading-relaxed">
                            動物保護団体・里親ネットワーク・シェルターの皆さまへ。<br />
                            ABCの供血ネットワークにパートナーとして参加しませんか？
                        </p>
                    </div>

                    {/* メリット説明 */}
                    <div className="bg-green-50 border border-green-100 rounded-3xl p-6 mb-8">
                        <h3 className="font-black text-life-green text-sm mb-4">パートナー登録のメリット</h3>
                        <ul className="space-y-2 text-sm text-gray-600 font-bold">
                            <li className="flex items-start"><span className="text-life-green mr-3">✓</span>保護犬猫が「命を救うヒーロー」として社会的価値が向上</li>
                            <li className="flex items-start"><span className="text-life-green mr-3">✓</span>団体名がABCサイトにパートナーとして掲載</li>
                            <li className="flex items-start"><span className="text-life-green mr-3">✓</span>保護動物の里親マッチングへの相乗効果</li>
                            <li className="flex items-start"><span className="text-life-green mr-3">✓</span>完全無料・金銭授受なし</li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-[40px] shadow-2xl p-8 md:p-12 border border-green-50">
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl text-sm mb-8 flex items-center">
                                <span className="mr-3 text-lg">⚠️</span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* 団体種別 */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">団体種別<span className="text-life-red ml-1">*</span></label>
                                <select name="orgType" value={formData.orgType} onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-life-green outline-none transition text-gray-800 font-bold appearance-none">
                                    <option value="動物保護団体">動物保護団体</option>
                                    <option value="里親ネットワーク">里親ネットワーク</option>
                                    <option value="アニマルシェルター">アニマルシェルター</option>
                                    <option value="ボランティア団体">ボランティア団体</option>
                                    <option value="その他">その他</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">団体・組織名<span className="text-life-red ml-1">*</span></label>
                                    <input type="text" name="orgName" required
                                        value={formData.orgName} onChange={handleChange}
                                        placeholder="動物保護団体ヨンナナ"
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-life-green outline-none transition text-gray-800 font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">担当者名<span className="text-life-red ml-1">*</span></label>
                                    <input type="text" name="contactName" required
                                        value={formData.contactName} onChange={handleChange}
                                        placeholder="担当者のお名前"
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-life-green outline-none transition text-gray-800 font-bold" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">メールアドレス<span className="text-life-red ml-1">*</span></label>
                                    <input type="email" name="email" required
                                        value={formData.email} onChange={handleChange}
                                        placeholder="info@example.com"
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-life-green outline-none transition text-gray-800 font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">電話番号</label>
                                    <input type="tel" name="phone"
                                        value={formData.phone} onChange={handleChange}
                                        placeholder="090-1234-5678"
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-life-green outline-none transition text-gray-800 font-bold" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">都道府県<span className="text-life-red ml-1">*</span></label>
                                    <select name="prefecture" value={formData.prefecture} onChange={handleChange}
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-life-green outline-none transition text-gray-800 font-bold appearance-none">
                                        {PREFECTURES.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">所在地（市区町村〜）</label>
                                    <input type="text" name="address"
                                        value={formData.address} onChange={handleChange}
                                        placeholder="徳島市..."
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-life-green outline-none transition text-gray-800 font-bold" />
                                </div>
                            </div>

                            {/* 保護頭数 */}
                            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">現在の保護頭数（おおよそ）</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 ml-1">🐶 犬</label>
                                        <input type="number" name="dogCount"
                                            value={formData.dogCount} onChange={handleChange}
                                            placeholder="0"
                                            className="w-full px-4 py-3 rounded-xl bg-white focus:ring-2 focus:ring-life-green outline-none transition text-gray-800 font-bold" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 ml-1">🐱 猫</label>
                                        <input type="number" name="catCount"
                                            value={formData.catCount} onChange={handleChange}
                                            placeholder="0"
                                            className="w-full px-4 py-3 rounded-xl bg-white focus:ring-2 focus:ring-life-green outline-none transition text-gray-800 font-bold" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">メッセージ・ご質問</label>
                                <textarea name="message"
                                    value={formData.message} onChange={handleChange}
                                    placeholder="パートナー登録を希望します。活動内容や供血への参加意向などをご記入ください。"
                                    rows={4}
                                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-life-green outline-none transition text-gray-800 font-bold"></textarea>
                            </div>

                            <div className="pt-4">
                                <button type="submit" disabled={loading}
                                    className="w-full bg-life-green text-white font-black py-5 rounded-2xl shadow-xl shadow-green-100 hover:bg-green-700 active:scale-95 disabled:bg-gray-200 transition-all duration-300 text-lg">
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            送信中...
                                        </span>
                                    ) : '🤝 パートナー登録を申請する'}
                                </button>
                                <p className="text-center text-[10px] text-gray-400 font-black uppercase tracking-widest mt-6">
                                    Animal Blood Connect — JARA
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
