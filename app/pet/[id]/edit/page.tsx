"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function PetEdit() {
    const router = useRouter();
    const params = useParams();
    const petId = params.id as string;
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        type: 'dog',
        pet_name: '',
        breed: '',
        weight: '',
        birth_date: '',
        blood_type: '',
        prefecture: '東京都',
        city: '',
        vaccination_status: false,
        heartworm_prevention: false,
        no_previous_transfusion: false,
    });

    useEffect(() => {
        async function fetchPet() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login?redirect=/pet/' + petId + '/edit');
                return;
            }
            setUserId(user.id);

            const { data, error } = await supabase
                .from('donors')
                .select('*')
                .eq('id', petId)
                .single();

            if (error) {
                alert('データの取得に失敗しました。');
                router.push('/mypage');
                return;
            }

            if (data.owner_id !== user.id) {
                alert('編集権限がありません。');
                router.push('/mypage');
                return;
            }

            setFormData({
                type: data.species,
                pet_name: data.pet_name,
                breed: data.breed,
                weight: data.weight_kg.toString(),
                birth_date: data.birth_date || '',
                blood_type: data.blood_type || '',
                prefecture: data.prefecture,
                city: data.city || '',
                vaccination_status: data.vaccination_status === '接種済み',
                heartworm_prevention: data.heartworm_prevention,
                no_previous_transfusion: data.no_previous_transfusion,
            });
            setLoading(false);
        }
        fetchPet();
    }, [petId, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;

        setSaving(true);

        try {
            const { error } = await supabase
                .from('donors')
                .update({
                    pet_name: formData.pet_name,
                    species: formData.type,
                    breed: formData.breed,
                    weight_kg: parseFloat(formData.weight) || 0,
                    blood_type: formData.blood_type || null,
                    prefecture: formData.prefecture,
                    city: formData.city,
                    vaccination_status: formData.vaccination_status ? '接種済み' : '未接種',
                    heartworm_prevention: formData.heartworm_prevention,
                    no_previous_transfusion: formData.no_previous_transfusion,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', petId);

            if (error) throw error;

            alert('情報を更新しました。');
            router.push('/mypage');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : '不明なエラー';
            alert('エラーが発生しました: ' + message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`${formData.pet_name} ちゃんの登録を削除してもよろしいですか？\n※この操作は取り消せません。`)) {
            return;
        }

        setSaving(true);
        try {
            const { error } = await supabase
                .from('donors')
                .delete()
                .eq('id', petId);

            if (error) throw error;

            alert('削除が完了しました。');
            router.push('/mypage');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : '不明なエラー';
            alert('削除に失敗しました: ' + message);
        } finally {
            setSaving(false);
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-life-red"></div>
            </div>
        );
    }

    return (
        <div className="bg-warm-gray min-h-screen text-gray-800 antialiased font-sans">
            <header className="bg-white shadow-sm py-4 px-6 fixed top-0 w-full z-50">
                <div className="max-w-3xl mx-auto flex justify-between items-center">
                    <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600">
                        キャンセル
                    </button>
                    <h1 className="font-black text-deep-blue">ドナー情報の編集</h1>
                    <div className="w-10"></div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-24">
                <div className="bg-white rounded-[40px] shadow-xl p-8 md:p-12 border border-white">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Animal Type */}
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4 px-1">種類</label>
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
                                    <div className="border-2 border-gray-100 rounded-3xl p-6 flex flex-col items-center justify-center hover:bg-gray-50 transition peer-checked:border-life-red peer-checked:bg-red-50/50 peer-checked:shadow-inner group">
                                        <img src="/assets/icon_dog.png" alt="dog" className="w-12 h-12 object-contain mb-2 group-hover:scale-110 transition" />
                                        <span className="font-black text-sm">犬</span>
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
                                    <div className="border-2 border-gray-100 rounded-3xl p-6 flex flex-col items-center justify-center hover:bg-gray-50 transition peer-checked:border-life-red peer-checked:bg-red-50/50 peer-checked:shadow-inner group">
                                        <img src="/assets/icon_cat.png" alt="cat" className="w-14 h-14 object-contain mb-2 group-hover:scale-110 transition" />
                                        <span className="font-black text-sm">猫</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">お名前</label>
                                <input
                                    type="text"
                                    name="pet_name"
                                    value={formData.pet_name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-life-red transition font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">品種</label>
                                <input
                                    type="text"
                                    name="breed"
                                    value={formData.breed}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-life-red transition font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">体重 (kg)</label>
                                <input
                                    type="number"
                                    name="weight"
                                    step="0.1"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-life-red transition font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">生年月日/年齢</label>
                                <input
                                    type="text"
                                    name="birth_date"
                                    value={formData.birth_date}
                                    onChange={handleChange}
                                    placeholder="2020年5月"
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-life-red transition font-bold"
                                />
                            </div>
                        </div>

                        {/* Medical Info */}
                        <div className="space-y-6 pt-6 border-t border-gray-100">
                            <h2 className="text-xl font-black text-deep-blue border-l-4 border-life-red pl-4">医療情報</h2>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">血液型</label>
                                <select
                                    name="blood_type"
                                    value={formData.blood_type}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-life-red transition font-bold"
                                >
                                    <option value="">不明 / 検査したことがない</option>
                                    <optgroup label="犬">
                                        <option value="dea1.1_pos">DEA 1.1 陽性 (+)</option>
                                        <option value="dea1.1_neg">DEA 1.1 陰性 (-) [希少]</option>
                                    </optgroup>
                                    <optgroup label="猫">
                                        <option value="a_type">A型</option>
                                        <option value="b_type">B型</option>
                                        <option value="ab_type">AB型</option>
                                    </optgroup>
                                </select>
                            </div>

                            <div className="space-y-4">
                                <label className="flex items-center p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition">
                                    <input
                                        type="checkbox"
                                        name="vaccination_status"
                                        checked={formData.vaccination_status}
                                        onChange={handleChange}
                                        className="w-6 h-6 text-life-red rounded-lg border-none focus:ring-life-red"
                                    />
                                    <span className="ml-4 font-bold text-gray-600">過去1年以内にワクチンを接種した</span>
                                </label>
                                <label className="flex items-center p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition">
                                    <input
                                        type="checkbox"
                                        name="heartworm_prevention"
                                        checked={formData.heartworm_prevention}
                                        onChange={handleChange}
                                        className="w-6 h-6 text-life-red rounded-lg border-none focus:ring-life-red"
                                    />
                                    <span className="ml-4 font-bold text-gray-600">フィラリア学防を毎年行っている</span>
                                </label>
                                <label className="flex items-center p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition">
                                    <input
                                        type="checkbox"
                                        name="no_previous_transfusion"
                                        checked={formData.no_previous_transfusion}
                                        onChange={handleChange}
                                        className="w-6 h-6 text-life-red rounded-lg border-none focus:ring-life-red"
                                    />
                                    <span className="ml-4 font-bold text-gray-600">これまでに輸血を受けたことがない</span>
                                </label>
                            </div>
                        </div>

                        <div className="pt-8 space-y-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-deep-blue text-white font-black py-6 rounded-[32px] shadow-2xl shadow-blue-900/20 hover:bg-trust-blue transform active:scale-95 transition duration-300 disabled:opacity-50"
                            >
                                {saving ? '保存中...' : '変更を保存する'}
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={saving}
                                className="w-full bg-white text-gray-400 font-bold py-4 rounded-[32px] hover:text-red-600 transition duration-300 disabled:opacity-50"
                            >
                                登録を削除する
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
