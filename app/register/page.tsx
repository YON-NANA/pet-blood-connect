"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Register() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    // 1. ログインチェック
    useEffect(() => {
        async function checkUser() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                // ログインしていない場合はログイン画面へ
                router.push('/login?redirect=/register');
            } else {
                setUserId(user.id);
            }
        }
        checkUser();
    }, [router]);

    const [formData, setFormData] = useState({
        type: 'dog',
        pet_name: '',
        breed: '',
        weight: '',
        birth_date: '',
        blood_type: '',
        prefecture: '東京都',
        city: '',
        contact_name: '',
        contact_phone: '',
        vaccination_status: false,
        heartworm_prevention: false,
        no_previous_transfusion: false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId) {
            alert('ログインが必要です。ログイン画面に移動します。');
            router.push('/login?redirect=/register');
            return;
        }

        setLoading(true);

        try {
            // 2. Insert into donors table
            console.log('Sending real data to Supabase...', formData);
            const { data, error } = await supabase
                .from('donors')
                .insert([{
                    owner_id: userId, // 本物のユーザーIDを使用
                    pet_name: formData.pet_name,
                    species: formData.type,
                    breed: formData.breed,
                    weight_kg: parseFloat(formData.weight) || 0,
                    blood_type: formData.blood_type || null,
                    prefecture: formData.prefecture,
                    city: formData.city,
                    contact_name: formData.contact_name,
                    contact_phone: formData.contact_phone,
                    vaccination_status: formData.vaccination_status ? '接種済み' : '未接種',
                    heartworm_prevention: formData.heartworm_prevention,
                    no_previous_transfusion: formData.no_previous_transfusion,
                    created_at: new Date().toISOString(),
                }])
                .select();

            if (error) {
                console.error('Supabase Error Details:', error);
                throw error;
            }

            console.log('Success:', data);
            alert('ドナー登録が完了しました！ありがとうございます。');
            router.push('/'); // トップページへ
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : '不明なエラー';
            console.error('Final Error Catch:', err);
            alert('エラーが発生しました: ' + message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const target = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: target.checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    return (
        <div className="bg-warm-gray min-h-screen text-gray-800 antialiased font-sans">
            {/* Header */}
            <header className="bg-white shadow-sm py-4">
                <div className="max-w-3xl mx-auto px-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center text-life-red font-bold text-xl">
                        <img src="/assets/logo.png" alt="AnimalBloodConnect" className="h-10 w-auto mr-2" />
                        <span className="text-life-green">Animal</span>
                        <span className="text-life-red">Blood</span>
                        <span className="text-trust-blue">Connect</span>
                    </Link>
                    <span className="text-gray-400 text-sm">Step 1/2</span>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-12">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                    <h1 className="text-3xl font-bold text-deep-blue mb-2 text-center">ドナー登録</h1>
                    <p className="text-gray-500 text-center mb-10">
                        あなたの愛犬・愛猫の情報を登録してください。<br />
                        <span className="text-xs text-red-500">* は必須項目です</span>
                    </p>

                    <form onSubmit={handleSubmit}>
                        {/* Animal Type */}
                        <div className="mb-8">
                            <label className="block text-gray-700 font-bold mb-3">種類 <span className="text-red-500">*</span></label>
                            <div className="grid grid-cols-2 gap-4">
                                <label className="cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="dog"
                                        className="hidden peer"
                                        checked={formData.type === 'dog'}
                                        onChange={handleChange}
                                    />
                                    <div className="border-2 border-gray-200 rounded-xl p-4 text-center hover:border-gray-300 transition peer-checked:border-life-red peer-checked:bg-red-50 peer-checked:text-life-red">
                                        <span className="text-2xl block mb-1">🐶</span>
                                        <span className="font-bold">犬</span>
                                    </div>
                                </label>
                                <label className="cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="cat"
                                        className="hidden peer"
                                        checked={formData.type === 'cat'}
                                        onChange={handleChange}
                                    />
                                    <div className="border-2 border-gray-200 rounded-xl p-4 text-center hover:border-gray-300 transition peer-checked:border-life-red peer-checked:bg-red-50 peer-checked:text-life-red">
                                        <span className="text-2xl block mb-1">🐱</span>
                                        <span className="font-bold">猫</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">お名前 <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="pet_name"
                                    value={formData.pet_name}
                                    onChange={handleChange}
                                    placeholder="ポチ" required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-life-red focus:border-transparent transition"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">品種 <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="breed"
                                    value={formData.breed}
                                    onChange={handleChange}
                                    placeholder="ゴールデンレトリバー" required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-life-red focus:border-transparent transition"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">体重 (kg) <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    name="weight"
                                    step="0.1"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    placeholder="25.0" required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-life-red focus:border-transparent transition"
                                />
                                <p className="text-xs text-gray-500 mt-1">供血量の目安になります（犬:20kg以上推奨）</p>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">生年月日（または年齢） <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="birth_date"
                                    value={formData.birth_date}
                                    onChange={handleChange}
                                    placeholder="2020年5月 (5歳)" required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-life-red focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-8">
                            <h3 className="text-deep-blue font-bold mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                </svg>
                                飼い主様の連絡先 (マッチング成立時のみ病院に開示されます)
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2">飼い主様のお名前 <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="contact_name"
                                        value={formData.contact_name}
                                        onChange={handleChange}
                                        placeholder="山田 太郎" required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-life-red focus:border-transparent transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2">電話番号 (ハイフンなし) <span className="text-red-500">*</span></label>
                                    <input
                                        type="tel"
                                        name="contact_phone"
                                        value={formData.contact_phone}
                                        onChange={handleChange}
                                        placeholder="09012345678" required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-life-red focus:border-transparent transition"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Medical Info */}
                        <div className="mb-8 bg-blue-50 p-6 rounded-xl border border-blue-100">
                            <h3 className="text-trust-blue font-bold mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                医療情報
                            </h3>

                            <div className="mb-6">
                                <label className="block text-gray-700 font-bold mb-2">血液型</label>
                                <select
                                    name="blood_type"
                                    value={formData.blood_type}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-trust-blue focus:border-transparent bg-white"
                                >
                                    <option value="">不明 / 検査したことがない</option>
                                    <optgroup label="犬">
                                        <option value="dea1.1_pos">DEA 1.1 陽性 (+)</option>
                                        <option value="dea1.1_neg">DEA 1.1 陰性 (-) [希少]</option>
                                        <option value="other_dog">その他</option>
                                    </optgroup>
                                    <optgroup label="猫">
                                        <option value="a_type">A型</option>
                                        <option value="b_type">B型</option>
                                        <option value="ab_type">AB型 [希少]</option>
                                    </optgroup>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-start">
                                    <input
                                        type="checkbox"
                                        name="vaccination_status"
                                        checked={formData.vaccination_status}
                                        onChange={handleChange}
                                        className="mt-1 form-checkbox h-5 w-5 text-trust-blue rounded border-gray-300 focus:ring-trust-blue"
                                    />
                                    <span className="ml-3 text-gray-700">過去1年以内に混合ワクチンを接種しています</span>
                                </label>
                                <label className="flex items-start">
                                    <input
                                        type="checkbox"
                                        name="heartworm_prevention"
                                        checked={formData.heartworm_prevention}
                                        onChange={handleChange}
                                        className="mt-1 form-checkbox h-5 w-5 text-trust-blue rounded border-gray-300 focus:ring-trust-blue"
                                    />
                                    <span className="ml-3 text-gray-700">フィラリア予防を毎年行っています</span>
                                </label>
                                <label className="flex items-start">
                                    <input
                                        type="checkbox"
                                        name="no_previous_transfusion"
                                        checked={formData.no_previous_transfusion}
                                        onChange={handleChange}
                                        className="mt-1 form-checkbox h-5 w-5 text-trust-blue rounded border-gray-300 focus:ring-trust-blue"
                                    />
                                    <span className="ml-3 text-gray-700">これまでに輸血を受けたことはありません</span>
                                </label>
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="mb-8">
                            <label className="block text-gray-700 font-bold mb-3">利用規約への同意 <span className="text-red-500">*</span></label>
                            <div className="h-40 overflow-y-scroll bg-gray-50 p-4 border border-gray-200 rounded-lg text-sm text-gray-600 mb-4 leading-relaxed">
                                <p className="font-bold mb-2">第1条（目的）</p>
                                <p className="mb-2">本サービスは、血液を必要とする動物と、供血可能な動物の飼い主をつなぐためのボランティアプラットフォームです。</p>
                                <p className="font-bold mb-2">第2条（金銭授受の禁止）</p>
                                <p className="mb-2">ユーザー間での金銭のやり取り（謝礼、交通費の請求など）は固く禁止します。</p>
                                <p className="font-bold mb-2">第3条（責任の所在）</p>
                                <p className="mb-2">供血に関する医療行為、適合試験、採血の可否判断はすべて担当獣医師の責任において行われます。本サービス運営者は、医療事故やトラブルに関して一切の責任を負いません。</p>
                                <p className="font-bold mb-2">第4条（プライバシー）</p>
                                <p className="mb-2">登録された個人情報は、マッチング成立後、ユーザーの同意を得た範囲でのみ開示されます。</p>
                            </div>
                            <label className="flex items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-white transition cursor-pointer">
                                <input type="checkbox" required className="form-checkbox h-6 w-6 text-life-red rounded border-gray-300 focus:ring-life-red" />
                                <span className="ml-3 text-gray-800 font-bold">規約に同意し、金銭のやり取りを行わないことを誓います</span>
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-life-red text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-red-600 hover:shadow-xl transform hover:-translate-y-1 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? '登録中...' : '登録内容を送信する'}
                        </button>

                    </form>
                </div>
            </main >
        </div >
    );
}

