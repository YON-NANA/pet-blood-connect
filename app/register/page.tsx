"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

// DOG_BLOOD_TYPES and CAT_BLOOD_TYPES handled inline via bloodTypes for responsiveness



const TRAVEL_DISTANCES = [
    { value: '5', label: '5km以内（地元のみ）' },
    { value: '10', label: '10km以内' },
    { value: '20', label: '20km以内' },
    { value: '50', label: '50km以内（県内全域）' },
    { value: '100', label: '100km以内' },
    { value: '999', label: '距離は問わない（全国対応）' },
];

const PREFECTURES = [
    '北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県',
    '茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県',
    '新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県',
    '静岡県','愛知県','三重県','滋賀県','京都府','大阪府','兵庫県',
    '奈良県','和歌山県','鳥取県','島根県','岡山県','広島県','山口県',
    '徳島県','香川県','愛媛県','高知県','福岡県','佐賀県','長崎県',
    '熊本県','大分県','宮崎県','鹿児島県','沖縄県',
];

export default function Register() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        async function checkUser() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
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
        birth_year: '',
        birth_month: '',
        blood_type: '',
        prefecture: '',
        city: '',
        travel_distance_km: '20',
        contact_name: '',
        contact_phone: '',
        vaccination_status: false,
        heartworm_prevention: false,
        no_previous_transfusion: false,
        rabies_vaccination: false, // 犬のみ
    });

    // 年・月 → ISO 日付文字列（YYYY-MM-DD）またはnull
    const getBirthDateISO = (): string | null => {
        if (!formData.birth_year) return null;
        const month = formData.birth_month ? formData.birth_month.padStart(2, '0') : '01';
        return `${formData.birth_year}-${month}-01`;
    };

    // 種別変更時に血液型をリセット
    const handleTypeChange = (newType: string) => {
        setFormData(prev => ({ ...prev, type: newType, blood_type: '' }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId) {
            alert('ログインが必要です。');
            router.push('/login?redirect=/register');
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase
                .from('donors')
                .insert([{
                    owner_id: userId,
                    pet_name: formData.pet_name,
                    species: formData.type,
                    breed: formData.breed,
                    weight_kg: parseFloat(formData.weight) || 0,
                    birth_date: getBirthDateISO(),
                    blood_type: formData.blood_type || null,
                    prefecture: formData.prefecture,
                    city: formData.city,
                    travel_distance_km: parseInt(formData.travel_distance_km),
                    contact_name: formData.contact_name,
                    contact_phone: formData.contact_phone,
                    vaccination_status: formData.vaccination_status ? '接種済み' : '未接種',
                    heartworm_prevention: formData.heartworm_prevention,
                    no_previous_transfusion: formData.no_previous_transfusion,
                    created_at: new Date().toISOString(),
                }]);

            if (error) {
                console.error('Supabase Error:', error);
                throw error;
            }

            setCompleted(true);
            window.scrollTo(0, 0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : '不明なエラー';
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

    const bloodTypes = formData.type === 'dog' ? [
        { value: '', label: '不明 / まだ検査していない' },
        { value: 'DEA1.1+', label: 'DEA 1.1 陽性 (+)' },
        { value: 'DEA1.1-', label: 'DEA 1.1 陰性 (-)' },
        { value: 'DEA1.2', label: 'DEA 1.2' },
        { value: 'DEA3', label: 'DEA 3' },
        { value: 'DEA4', label: 'DEA 4' },
        { value: 'DEA5', label: 'DEA 5' },
        { value: 'DEA7', label: 'DEA 7' },
    ] : [
        { value: '', label: '不明 / まだ検査していない' },
        { value: 'A', label: 'A型' },
        { value: 'B', label: 'B型' },
        { value: 'AB', label: 'AB型' },
    ];

    // ✅ 登録完了画面
    if (completed) {
        return (
            <div className="bg-warm-gray min-h-screen font-sans flex items-center justify-center px-4">
                <div className="max-w-lg w-full bg-white rounded-[40px] shadow-2xl p-10 md:p-16 text-center">
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 animate-bounce">
                        🎉
                    </div>
                    <div className="inline-block px-4 py-1.5 bg-green-100 text-life-green text-xs font-black rounded-full uppercase tracking-widest mb-6">
                        登録完了
                    </div>
                    <h1 className="text-3xl font-black text-deep-blue mb-4 tracking-tight">
                        ありがとうございます！
                    </h1>
                    <p className="text-gray-500 font-bold leading-relaxed mb-4">
                        <span className="text-deep-blue font-black">{formData.pet_name}</span> ちゃんのドナー登録が完了しました。
                    </p>
                    <p className="text-gray-400 text-sm font-medium leading-relaxed mb-10">
                        近隣の動物病院から供血要請が届いた際は、マイページに通知が届きます。<br />
                        いざという時まで、よろしくお願いします。🐾
                    </p>
                    <div className="bg-blue-50 rounded-2xl p-5 mb-8 text-left">
                        <p className="text-xs font-black text-trust-blue uppercase tracking-widest mb-2">次のステップ</p>
                        <ul className="text-sm text-gray-600 font-bold space-y-2">
                            <li>📱 マイページで登録内容を確認・修正できます</li>
                            <li>💬 要請が来たらシステムからお知らせします</li>
                            <li>🩸 供血後は「最終提供日」を更新してください</li>
                        </ul>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Link href="/mypage" className="block w-full bg-deep-blue text-white font-black py-4 rounded-[24px] shadow-xl hover:bg-trust-blue transition">
                            マイページを確認する
                        </Link>
                        <Link href="/" className="block w-full text-gray-400 font-bold py-3 hover:text-gray-600 transition text-sm">
                            トップページへ戻る
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-warm-gray min-h-screen text-gray-800 antialiased font-sans">
            {/* Header */}
            <header className="bg-white shadow-sm py-4 sticky top-0 z-50">
                <div className="max-w-3xl mx-auto px-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center">
                        <Image src="/assets/logo_v2.png" alt="AnimalBloodConnect" width={40} height={40} className="h-10 w-auto mr-2" />
                        <span className="font-black tracking-tight text-lg">
                            <span className="text-life-green">Animal</span>
                            <span className="text-life-red">Blood</span>
                            <span className="text-trust-blue">Connect</span>
                        </span>
                    </Link>
                    <span className="text-gray-400 text-xs font-black tracking-widest uppercase">Donor Registration</span>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-10 pb-20">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-deep-blue mb-2 tracking-tight">供血ドナー登録</h1>
                    <p className="text-gray-500 font-bold text-sm">
                        あなたの愛犬・愛猫が、誰かの大切な命を救うかもしれません。<br />
                        <span className="text-red-400 font-black">* は必須項目です</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* ① 種別 */}
                    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                            種別 <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { value: 'dog', label: '犬（イヌ）', image: '/assets/icon_dog.png' },
                                { value: 'cat', label: '猫（ネコ）', image: '/assets/icon_cat.png' },
                            ].map(opt => (
                                <label key={opt.value} className="cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        value={opt.value}
                                        className="hidden peer"
                                        checked={formData.type === opt.value}
                                        onChange={() => handleTypeChange(opt.value)}
                                    />
                                    <div className="border-2 border-gray-100 rounded-2xl p-5 flex flex-col items-center justify-center hover:bg-gray-50 transition peer-checked:border-life-red peer-checked:bg-red-50/50 peer-checked:shadow-inner">
                                        <img 
                                          src={opt.image} 
                                          alt={opt.label}
                                          className="w-16 h-16 object-contain mb-2"
                                        />
                                        <span className="font-black text-gray-700">{opt.label}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* ② 基本情報 */}
                    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">基本情報</h2>
                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">お名前 <span className="text-red-400">*</span></label>
                                <input type="text" name="pet_name" value={formData.pet_name} onChange={handleChange} placeholder="ポチ" required
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-800 placeholder-gray-300 focus:ring-2 focus:ring-life-red outline-none transition" />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">品種 <span className="text-red-400">*</span></label>
                                <input type="text" name="breed" value={formData.breed} onChange={handleChange}
                                    placeholder={formData.type === 'dog' ? 'ゴールデンレトリバー' : 'スコティッシュフォールド'} required
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-800 placeholder-gray-300 focus:ring-2 focus:ring-life-red outline-none transition" />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">
                                    体重 (kg) <span className="text-red-400">*</span>
                                </label>
                                <input type="number" name="weight" step="0.1" value={formData.weight} onChange={handleChange}
                                    placeholder={formData.type === 'dog' ? '25.0 (20kg以上推奨)' : '5.0 (4kg以上推奨)'} required
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-800 placeholder-gray-300 focus:ring-2 focus:ring-life-red outline-none transition" />
                                <p className="text-xs text-gray-400 font-bold mt-1.5 ml-1">
                                    {formData.type === 'dog' ? '犬は20kg以上が供血の目安です' : '猫は4kg以上が供血の目安です'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">生年月日（目安） <span className="text-red-400">*</span></label>
                                <div className="flex gap-2">
                                    <select
                                        name="birth_year"
                                        value={formData.birth_year}
                                        onChange={handleChange}
                                        required
                                        className="flex-1 bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-800 focus:ring-2 focus:ring-life-red outline-none transition appearance-none"
                                    >
                                        <option value="">年を選択</option>
                                        {Array.from({ length: 20 }, (_, i) => {
                                            const year = new Date().getFullYear() - i;
                                            return <option key={year} value={String(year)}>{year}年</option>;
                                        })}
                                    </select>
                                    <select
                                        name="birth_month"
                                        value={formData.birth_month}
                                        onChange={handleChange}
                                        className="flex-1 bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-800 focus:ring-2 focus:ring-life-red outline-none transition appearance-none"
                                    >
                                        <option value="">月（任意）</option>
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <option key={i + 1} value={String(i + 1)}>{i + 1}月</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ③ 所在地・移動可能距離 */}
                    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">📍 所在地・移動可能距離</h2>
                        <div className="grid md:grid-cols-3 gap-5">
                            <div>
                                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">都道府県 <span className="text-red-400">*</span></label>
                                <select name="prefecture" value={formData.prefecture} onChange={handleChange}
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-800 focus:ring-2 focus:ring-life-red outline-none transition appearance-none">
                                    {PREFECTURES.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">市区町村 <span className="text-red-400">*</span></label>
                                <input type="text" name="city" value={formData.city} onChange={handleChange}
                                    placeholder="徳島市" required
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-800 placeholder-gray-300 focus:ring-2 focus:ring-life-red outline-none transition" />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">移動可能距離 <span className="text-red-400">*</span></label>
                                <select name="travel_distance_km" value={formData.travel_distance_km} onChange={handleChange}
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-800 focus:ring-2 focus:ring-life-red outline-none transition appearance-none">
                                    {TRAVEL_DISTANCES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="mt-4 bg-blue-50 rounded-xl p-4 flex items-start space-x-3">
                            <span className="text-xl">ℹ️</span>
                            <p className="text-xs text-trust-blue font-bold leading-relaxed">
                                この情報は病院からの距離によるマッチングに使用されます。遠方への移動が困難な場合は正直にご登録ください。
                            </p>
                        </div>
                    </div>

                    {/* ④ 医療情報 */}
                    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">🩺 医療情報</h2>

                        {/* 血液型 ── 種別で動的切り替え */}
                        <div className="mb-6">
                            <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">
                                血液型
                                <span className="ml-2 text-gray-300 normal-case font-bold">{formData.type === 'dog' ? '（犬: DEA系）' : '（猫: A/B/AB型）'}</span>
                            </label>
                            <select name="blood_type" value={formData.blood_type} onChange={handleChange}
                                className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-800 focus:ring-2 focus:ring-trust-blue outline-none transition appearance-none">
                                {bloodTypes.map(bt => (
                                    <option key={bt.value} value={bt.value}>{bt.label}</option>
                                ))}
                            </select>
                            {formData.type === 'cat' && (
                                <p className="text-xs text-amber-600 font-bold mt-2 ml-1 bg-amber-50 rounded-xl p-3">
                                    ⚠️ 猫の血液型は輸血時に命に関わる重要情報です。不明な場合は事前に病院で検査することをお勧めします。
                                </p>
                            )}
                        </div>

                        {/* チェック項目 */}
                        <div className="space-y-3">
                            {[
                                { name: 'vaccination_status', label: '過去1年以内に混合ワクチンを接種しています' },
                                { name: 'heartworm_prevention', label: 'フィラリア予防を毎年行っています', dogOnly: true },
                                { name: 'rabies_vaccination', label: '狂犬病予防接種を毎年行っています（犬のみ）', dogOnly: true },
                                { name: 'no_previous_transfusion', label: 'これまでに輸血を受けたことはありません' },
                            ]
                            .filter(item => !item.dogOnly || formData.type === 'dog')
                            .map(item => (
                                <label key={item.name} className="flex items-center p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition">
                                    <input
                                        type="checkbox"
                                        name={item.name}
                                        checked={formData[item.name as keyof typeof formData] as boolean}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-life-red rounded-lg border-none focus:ring-life-red flex-shrink-0"
                                    />
                                    <span className="ml-4 font-bold text-gray-600 text-sm">{item.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* ⑤ 飼い主の連絡先 */}
                    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">📞 飼い主様の連絡先</h2>
                        <p className="text-xs text-gray-400 font-bold mb-6">マッチング成立後のみ、担当病院に開示されます。</p>
                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">お名前 <span className="text-red-400">*</span></label>
                                <input type="text" name="contact_name" value={formData.contact_name} onChange={handleChange}
                                    placeholder="山田 太郎" required
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-800 placeholder-gray-300 focus:ring-2 focus:ring-trust-blue outline-none transition" />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">電話番号 <span className="text-red-400">*</span></label>
                                <input type="tel" name="contact_phone" value={formData.contact_phone} onChange={handleChange}
                                    placeholder="09012345678" required
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-800 placeholder-gray-300 focus:ring-2 focus:ring-trust-blue outline-none transition" />
                            </div>
                        </div>
                    </div>

                    {/* ⑥ 利用規約 */}
                    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">利用規約への同意 <span className="text-red-400">*</span></h2>
                        <div className="h-36 overflow-y-scroll bg-gray-50 p-5 rounded-2xl text-xs text-gray-500 leading-relaxed mb-5 border border-gray-100">
                            <p className="font-black text-gray-600 mb-1">第1条（目的）</p>
                            <p className="mb-3">本サービスは、血液を必要とする動物と供血可能な動物の飼い主をつなぐボランティアプラットフォームです。</p>
                            <p className="font-black text-gray-600 mb-1">第2条（金銭授受の禁止）</p>
                            <p className="mb-3">ユーザー間での金銭のやり取り（謝礼、交通費請求等）は固く禁止します。</p>
                            <p className="font-black text-gray-600 mb-1">第3条（責任の所在）</p>
                            <p className="mb-3">供血の医療行為・適合試験・採血可否の判断はすべて担当獣医師の責任において行われます。</p>
                            <p className="font-black text-gray-600 mb-1">第4条（プライバシー）</p>
                            <p>登録された個人情報は、マッチング成立後、同意の範囲でのみ開示されます。</p>
                        </div>
                        <label className="flex items-center p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition border-2 border-transparent has-[:checked]:border-life-red has-[:checked]:bg-red-50/30">
                            <input type="checkbox" required className="w-6 h-6 text-life-red rounded-lg border-gray-300 focus:ring-life-red flex-shrink-0" />
                            <span className="ml-4 font-black text-gray-700 text-sm">規約に同意し、金銭のやり取りを行わないことを誓います</span>
                        </label>
                    </div>
                    {/* 🚨 供血適否の警告表示 */}
                    <div className="bg-amber-50 border-2 border-amber-200 rounded-[32px] p-8 mb-6 shadow-sm">
                        <div className="flex items-center space-x-3 mb-3">
                            <span className="text-2xl">⚠️</span>
                            <h3 className="text-lg font-black text-amber-900 tracking-tight">登録に関する重要事項</h3>
                        </div>
                        <p className="text-sm font-black text-amber-800 leading-relaxed">
                            登録できても、実際の供血適否は当日の診察と検査によって決まります。<br />
                            この登録は、あくまで「協力できる可能性がある」という意思表示であり、実際の供血を保証・強制するものではありません。
                        </p>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-life-red text-white font-black text-lg py-5 rounded-[28px] shadow-2xl shadow-red-200 hover:bg-red-600 transform hover:scale-[1.02] active:scale-95 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                登録中...
                            </span>
                        ) : '🐾 ドナー登録を完了する'}
                    </button>
                    <p className="text-center text-xs text-gray-400 font-bold -mt-2">この情報はSupabaseの暗号化されたデータベースに安全に保存されます</p>

                </form>
            </main>
        </div>
    );
}
