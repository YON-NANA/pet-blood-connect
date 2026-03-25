"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { subscribeToNotifications } from '@/lib/push-notifications';

interface Profile {
    display_name: string | null;
    avatar_url: string | null;
}

interface Pet {
    id: string;
    pet_name: string;
    species: string;
    breed: string;
    weight_kg: number;
    blood_type: string | null;
    prefecture: string;
    city: string;
    contact_name: string;
    contact_phone: string;
    created_at: string;
}

interface Match {
    id: string;
    status: string;
    donor_id: string;
    hospital_id: string;
    donor_last_read_at: string;
    hasUnread?: boolean;
    hospitals: {
        hospital_name: string;
    };
    donors: {
        pet_name: string;
    };
}

interface BloodRequest {
    id: string;
    hospital_id: string;
    species: string;
    blood_type: string | null;
    urgency: string;
    message: string;
    created_at: string;
    hospitals: {
        hospital_name: string;
        address_city: string;
    };
}

export default function MyPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [pets, setPets] = useState<Pet[]>([]);
    const [matches, setMatches] = useState<Match[]>([]);
    const [activeRequests, setActiveRequests] = useState<BloodRequest[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);
    const [isSubscribed, setIsSubscribed] = useState(false);

    // 二段階承認のチェックリスト
    const [approvalChecks, setApprovalChecks] = useState({
        can_transport: false,
        health_status: false,
        rest_period: false,
        privacy_agree: false
    });
    const [selectedPetId, setSelectedPetId] = useState<string>('');

    // ペット登録フォーム用ステータス
    const [isRegistering, setIsRegistering] = useState(false);
    const [newDonor, setNewDonor] = useState({
        pet_name: '',
        species: 'dog',
        breed: '',
        weight_kg: '',
        blood_type: '',
        prefecture: '東京都',
        city: '',
        contact_name: '',
        contact_phone: ''
    });

    // ペット編集フォーム用ステータス
    const [editingPetId, setEditingPetId] = useState<string | null>(null);
    const [editDonor, setEditDonor] = useState({
        pet_name: '',
        species: 'dog',
        breed: '',
        weight_kg: '',
        blood_type: '',
        prefecture: '東京都',
        city: '',
        contact_name: '',
        contact_phone: ''
    });

    useEffect(() => {
        async function fetchUserData() {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    router.push('/login?redirect=/mypage');
                    return;
                }

                // Profiles
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('display_name, avatar_url')
                    .eq('id', user.id)
                    .single();
                if (profileData) setProfile(profileData);

                // Pets
                const { data: petsData } = await supabase
                    .from('donors')
                    .select('*')
                    .eq('owner_id', user.id)
                    .order('created_at', { ascending: false });
                if (petsData) {
                    setPets(petsData as Pet[]);
                    if (petsData.length > 0) {
                        setSelectedPetId(petsData[0].id);
                    }
                }

                // Active Blood Requests
                const { data: requestsData } = await supabase
                    .from('blood_requests')
                    .select(`
                        id, hospital_id, species, blood_type, urgency, message, created_at,
                        hospitals ( hospital_name, address_city )
                    `)
                    .eq('status', 'active')
                    .order('created_at', { ascending: false });
                if (requestsData) setActiveRequests(requestsData as unknown as BloodRequest[]);

                // 🔔 Push Subscription Check
                const { data: subData } = await supabase
                    .from('push_subscriptions')
                    .select('user_id')
                    .eq('user_id', user.id)
                    .single();
                if (subData) setIsSubscribed(true);

                // Matches - 自分のペット(ドナー)のIDリストで絞り込む
                // まずpetsDataからIDを取得
                const petIds = petsData ? petsData.map((p: { id: string }) => p.id) : [];

                if (petIds.length > 0) {
                    const { data: matchesData } = await supabase
                        .from('matches')
                        .select(`
                            id, status, donor_id, hospital_id, created_at, donor_last_read_at,
                            hospitals ( hospital_name ),
                            donors ( pet_name )
                        `)
                        .in('donor_id', petIds)
                        .order('created_at', { ascending: false });

                    if (matchesData) {
                        const baseMatches = matchesData as unknown as Match[];
                        // 重複を削除
                        const uniqueMatches = baseMatches.reduce((acc: Match[], current: Match) => {
                            if (!acc.find(item => item.hospital_id === current.hospital_id && item.donor_id === current.donor_id)) {
                                return acc.concat([current]);
                            }
                            return acc;
                        }, []);

                        // 各マッチの未読をチェック
                        const matchesWithUnread = await Promise.all(uniqueMatches.map(async (m) => {
                            const { data: latestMsg } = await supabase
                                .from('messages')
                                .select('created_at')
                                .eq('match_id', m.id)
                                .order('created_at', { ascending: false })
                                .limit(1)
                                .maybeSingle();

                            const hasUnread = latestMsg ? (new Date(latestMsg.created_at) > new Date(m.donor_last_read_at || 0)) : false;
                            return { ...m, hasUnread };
                        }));

                        setMatches(matchesWithUnread);
                    }
                }

            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchUserData();
    }, [router]);

    const handleApproveRequest = async () => {
        if (!approvalChecks.can_transport || !approvalChecks.health_status || !approvalChecks.rest_period || !approvalChecks.privacy_agree) {
            alert('すべての確認項目をチェックしてください。');
            return;
        }

        if (!selectedRequest) return;

        const targetPet = pets.find(p => p.id === selectedPetId);
        if (!targetPet) {
            alert("ドナーが選択されていません。");
            return;
        }

        try {
            // 既存のマッチングルームがあるかチェック
            const { data: existingMatch } = await supabase
                .from('matches')
                .select('id')
                .eq('hospital_id', selectedRequest.hospital_id)
                .eq('donor_id', targetPet.id)
                .single();

            let targetMatchId = existingMatch?.id;

            // なければ新規作成
            if (!targetMatchId) {
                const { data: newMatch, error: createError } = await supabase
                    .from('matches')
                    .insert([{
                        hospital_id: selectedRequest.hospital_id,
                        donor_id: targetPet.id,
                        status: 'pending'
                    }])
                    .select().single();

                if (createError) throw createError;
                targetMatchId = newMatch.id;
            }

            alert('承認を送信しました。病院側へ「候補者」として通知されます。');
            setSelectedRequest(null);
            setApprovalChecks({ can_transport: false, health_status: false, rest_period: false, privacy_agree: false });

            // 対象ルームへ遷移
            router.push(`/chat/${targetPet.id}?matchId=${targetMatchId}&view=donor`);

        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : '不明なエラー';
            alert(`承認処理に失敗しました: ${message}`);
        }
    };

    const handleDeletePet = async (petId: string, petName: string) => {
        if (!window.confirm(`${petName} の登録を削除してもよろしいですか？\n※紐付いたマッチング履歴もすべて削除されます。この操作は取り消せません。`)) {
            return;
        }

        try {
            // Step 1: このドナーに紐付くマッチングIDを取得
            const { data: relatedMatches } = await supabase
                .from('matches')
                .select('id')
                .eq('donor_id', petId);

            if (relatedMatches && relatedMatches.length > 0) {
                const matchIds = relatedMatches.map(m => m.id);

                // Step 2: マッチングに紐付くメッセージを先に削除
                await supabase
                    .from('messages')
                    .delete()
                    .in('match_id', matchIds);

                // Step 3: マッチング自体を削除
                await supabase
                    .from('matches')
                    .delete()
                    .in('id', matchIds);
            }

            // Step 4: ドナー（ペット）を削除
            const { error } = await supabase
                .from('donors')
                .delete()
                .eq('id', petId);

            if (error) throw error;
            setPets(pets.filter(p => p.id !== petId));
            alert(`${petName} の登録を削除しました。`);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            alert(`削除に失敗しました: ${msg}`);
            console.error(err);
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('donors')
                .insert([{
                    owner_id: user.id,
                    pet_name: newDonor.pet_name,
                    species: newDonor.species,
                    breed: newDonor.breed,
                    weight_kg: Number(newDonor.weight_kg),
                    blood_type: newDonor.blood_type || null,
                    prefecture: newDonor.prefecture,
                    city: newDonor.city,
                    contact_name: newDonor.contact_name,
                    contact_phone: newDonor.contact_phone
                }])
                .select();

            if (error) throw error;

            if (data && data.length > 0) {
                setPets([data[0] as unknown as Pet, ...pets]);
            }
            setIsRegistering(false);
            setNewDonor({ pet_name: '', species: 'dog', breed: '', weight_kg: '', blood_type: '', prefecture: '東京都', city: '', contact_name: '', contact_phone: '' });
            alert('ドナーペットの登録が完了しました。');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : '不明なエラー';
            alert('登録に失敗しました: ' + message);
        }
    };

    const handleEditStart = (pet: Pet) => {
        setEditingPetId(pet.id);
        setEditDonor({
            pet_name: pet.pet_name,
            species: pet.species,
            breed: pet.breed,
            weight_kg: String(pet.weight_kg),
            blood_type: pet.blood_type || '',
            prefecture: pet.prefecture || '東京都',
            city: pet.city || '',
            contact_name: pet.contact_name || '',
            contact_phone: pet.contact_phone || ''
        });
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!editingPetId) return;

            const { data, error } = await supabase
                .from('donors')
                .update({
                    pet_name: editDonor.pet_name,
                    species: editDonor.species,
                    breed: editDonor.breed,
                    weight_kg: Number(editDonor.weight_kg),
                    blood_type: editDonor.blood_type || null,
                    prefecture: editDonor.prefecture,
                    city: editDonor.city,
                    contact_name: editDonor.contact_name,
                    contact_phone: editDonor.contact_phone
                })
                .eq('id', editingPetId)
                .select();

            if (error) throw error;

            if (data && data.length > 0) {
                setPets(pets.map(p => p.id === editingPetId ? (data[0] as unknown as Pet) : p));
            }
            setEditingPetId(null);
            alert('登録情報を更新しました。');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : '不明なエラー';
            alert('更新に失敗しました: ' + message);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-life-red"></div>
            </div>
        );
    }

    return (
        <div className="bg-[#FAFAFA] min-h-screen font-sans text-gray-800 antialiased overflow-x-hidden">
            <header className="bg-[#0F172A] py-4 px-6 sticky top-0 z-50 shadow-xl">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center group">
                        <Image
                            src="/assets/logo_v2.png"
                            alt="Logo"
                            width={40}
                            height={40}
                            className="h-8 w-auto object-contain transition duration-300 contrast-125 brightness-200"
                        />
                        <span className="ml-3 text-lg font-black tracking-tighter leading-none text-white opacity-90">
                            AMAJ Public Net
                        </span>
                    </Link>
                    <button onClick={handleLogout} className="text-[10px] font-black tracking-widest text-white/40 hover:text-white transition uppercase">
                        Sign Out
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-10 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 text-left">

                    {/* Left Column: Profile & Stats */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white rounded-[40px] p-8 shadow-2xl shadow-gray-200/50 border border-gray-100 text-center relative overflow-hidden">
                            <div className="w-24 h-24 bg-gray-50 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl shadow-inner border-2 border-white relative z-10">
                                👤
                            </div>
                            <h1 className="text-xl font-black text-deep-blue mb-1 relative z-10">
                                {profile?.display_name || 'ユーザー'}様
                            </h1>
                            <div className="inline-block px-3 py-1 bg-green-50 text-life-green text-[10px] font-black rounded-full uppercase tracking-widest mb-6 relative z-10">
                                Reliability: 100%
                            </div>

                            <div className="pt-6 border-t border-gray-50 space-y-2 relative z-10">
                                <button className="w-full py-4 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-2xl text-[11px] font-black tracking-widest uppercase transition mb-2">
                                    Edit Profile
                                </button>
                                <button 
                                    onClick={async () => {
                                        await subscribeToNotifications();
                                        // 登録後に状態を再チェックするように促すか、簡易的にtrueにする
                                        setIsSubscribed(true);
                                    }}
                                    className={`w-full py-4 ${isSubscribed ? 'bg-green-500' : 'bg-trust-blue'} text-white rounded-2xl text-[11px] font-black tracking-widest uppercase transition shadow-lg shadow-blue-100`}
                                >
                                    {isSubscribed ? '✅ 通知は有効です' : '🔔 通知を有効にする'}
                                </button>
                                {isSubscribed && (
                                    <p className="text-[10px] text-green-600 font-bold mt-2">緊急要請をリアルタイムで受信できます</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-[#0F172A] rounded-[32px] p-8 text-white shadow-2xl shadow-blue-900/10">
                            <p className="text-[10px] font-black text-white/30 mb-4 uppercase tracking-[0.2em] leading-none">System Notice</p>
                            <p className="text-xs text-white/70 leading-relaxed font-medium">
                                あなたの100%の信頼スコアは、この社会インフラの安定を支えています。無断キャンセルはスコア低下の原因となります。
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Active Jobs & Pets */}
                    <div className="lg:col-span-3 space-y-12">

                        {/* 🚨 Emergency Requests Section */}
                        {activeRequests.length > 0 && (
                            <section className="animate-in slide-in-from-top duration-700">
                                <div className="flex items-center space-x-3 mb-6">
                                    <span className="flex h-3 w-3 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-life-red opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-life-red"></span>
                                    </span>
                                    <h2 className="text-2xl font-black text-deep-blue tracking-tight">緊急の供血要請（広域発令中）</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {activeRequests.map(req => {
                                        // この病院 かつ 「同じ動物種（犬・猫）」のペットですでにマッチング済みかどうかを確認
                                        const existingMatch = matches.find(m => 
                                            m.hospital_id === req.hospital_id && 
                                            pets.find(p => p.id === m.donor_id)?.species === req.species
                                        );
                                        const isAlreadyMatched = !!existingMatch;

                                        return (
                                            <div key={req.id} className={`bg-white p-8 rounded-[40px] border-2 ${isAlreadyMatched ? 'border-trust-blue/30 opacity-80' : 'border-life-red/20 hover:border-life-red'} shadow-xl shadow-red-900/5 transition duration-500 group relative overflow-hidden`}>
                                                <div className="absolute top-0 right-0 px-4 py-2 bg-life-red text-white text-[10px] font-black uppercase tracking-widest leading-none rounded-bl-2xl">
                                                    {req.urgency === 'emergency' ? '🚨 緊急' : '⚠️ 至急'}
                                                </div>
                                                <div className="flex items-center space-x-3 mb-4">
                                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1 border border-red-50">
                                                        <img 
                                                          src={req.species === 'dog' ? '/assets/icon_dog.png' : '/assets/icon_cat.png'} 
                                                          alt={req.species}
                                                          className="w-full h-full object-contain"
                                                        />
                                                    </div>
                                                    <span className="text-[10px] font-black text-gray-400 border border-gray-100 px-2 py-0.5 rounded leading-none">血液型: {req.blood_type || '不問'}</span>
                                                </div>
                                                <h3 className="font-black text-lg text-deep-blue mb-2 leading-tight">{req.hospitals?.hospital_name}</h3>
                                                <p className="text-xs text-gray-500 font-bold mb-6 line-clamp-2 leading-relaxed">
                                                    {req.message}
                                                </p>
                                                {isAlreadyMatched ? (
                                                    // すでに承認・マッチング済みの場合はチャットへ直接遷移
                                                    <Link href={`/chat/${existingMatch.donor_id}?matchId=${existingMatch.id}&view=donor`} className="relative block">
                                                        <span className="flex items-center justify-center w-full py-4 bg-trust-blue text-white rounded-2xl font-black text-xs tracking-widest uppercase shadow-lg shadow-blue-100 hover:bg-blue-600 transition">
                                                            {existingMatch.hasUnread && (
                                                                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
                                                                </span>
                                                            )}
                                                            <span className="mr-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                                            チャットを再開する
                                                        </span>
                                                    </Link>
                                                ) : (
                                                    // 未対応の場合は二段階承認へ
                                                    <button
                                                        onClick={() => {
                                                            setSelectedRequest(req);
                                                            // 要請と同じ種類のペットをデフォルトで選択
                                                            const firstMatchingPet = pets.find(p => p.species === req.species);
                                                            if (firstMatchingPet) {
                                                                setSelectedPetId(firstMatchingPet.id);
                                                            }
                                                        }}
                                                        className="w-full py-4 bg-life-red text-white rounded-2xl font-black text-xs tracking-widest uppercase shadow-lg shadow-red-100 hover:bg-black transition transform active:scale-95"
                                                    >
                                                        要請に応じる（二段階承認へ）
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* Registered Pets */}
                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-deep-blue tracking-tight flex items-center gap-2">
                                    <img src="/assets/icon_dog.png" alt="paw" className="w-6 h-6 object-contain" />
                                    登録中のドナー
                                </h2>
                                <button onClick={() => setIsRegistering(true)} className="text-[10px] font-black text-life-red bg-red-50 px-4 py-2 rounded-full tracking-widest uppercase hover:bg-red-100 transition">
                                    ＋ Add Donor
                                </button>
                            </div>

                            {pets.length === 0 ? (
                                <div className="bg-white border-2 border-dashed border-gray-100 rounded-[40px] p-20 text-center shadow-inner">
                                    <p className="text-gray-400 text-sm font-bold tracking-widest leading-none mb-4">NO DONORS REGISTERED</p>
                                    <button onClick={() => setIsRegistering(true)} className="text-life-red font-black text-xs hover:underline">
                                        ドナー登録を開始する
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {pets.map(pet => (
                                        <div key={pet.id} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 group relative transition duration-500 hover:shadow-2xl hover:shadow-gray-200/50">
                                            <div className="flex items-center space-x-5">
                                                <div className="w-16 h-16 bg-gray-50 flex items-center justify-center rounded-[24px] shadow-inner p-2">
                                                    <img 
                                                      src={pet.species === 'dog' ? '/assets/icon_dog.png' : '/assets/icon_cat.png'} 
                                                      alt={pet.species}
                                                      className="w-full h-full object-contain"
                                                    />
                                                </div>
                                                <div className="flex-grow">
                                                    <h3 className="font-black text-xl text-deep-blue leading-none mb-2">{pet.pet_name}</h3>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{pet.breed}</span>
                                                        <span className="text-gray-200">|</span>
                                                        <span className="text-[10px] font-black text-trust-blue tracking-widest leading-none">{pet.blood_type || '不明'}型</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="absolute top-8 right-8 flex space-x-2 opacity-0 group-hover:opacity-100 transition">
                                                <button onClick={() => handleEditStart(pet)} title="編集する" className="p-2 text-gray-300 hover:text-trust-blue transition">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                </button>
                                                <button onClick={() => handleDeletePet(pet.id, pet.pet_name)} title="削除する" className="p-2 text-gray-300 hover:text-red-500 transition">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Recent Matches */}
                        <section>
                            <h2 className="text-2xl font-black text-deep-blue mb-8 tracking-tight flex items-center gap-2">
                                <img src="/assets/icon_cat.png" alt="chat" className="w-6 h-6 object-contain" />
                                病院との個別チャット
                            </h2>
                            <div className="bg-white rounded-[40px] p-1 shadow-sm border border-gray-100 overflow-hidden">
                                {matches.length === 0 ? (
                                    <div className="p-20 text-center">
                                        <p className="text-gray-400 text-xs font-black tracking-widest leading-none">CHAT LOGS EMPTY</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col">
                                        {matches.map((match) => (
                                            <Link
                                                key={match.id}
                                                href={`/chat/${match.donor_id}?matchId=${match.id}&view=donor`}
                                                className="flex items-center justify-between p-8 hover:bg-gray-50 transition border-b border-gray-50 last:border-0"
                                            >
                                                <div className="flex items-center space-x-6">
                                                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner font-bold">🏥</div>
                                                    <div>
                                                        <h4 className="font-black text-deep-blue text-lg leading-tight mb-1">{match.hospitals?.hospital_name}</h4>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Target: {match.donors?.pet_name}</p>
                                                    </div>
                                                </div>
                                                <div className="px-6 py-3 bg-deep-blue text-white rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg shadow-blue-900/10">
                                                    Chat Now
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>

                    </div>
                </div>
            </main>

            {/* 🛡️ Two-step Approval Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#0F172A]/95 backdrop-blur-md" onClick={() => setSelectedRequest(null)}></div>
                    <div className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in duration-300">
                        <div className="p-10 md:p-14 text-left">
                            <h3 className="text-2xl font-black text-deep-blue tracking-tighter leading-tight mb-4">要請への応答（二段階承認）</h3>
                            <p className="text-xs text-gray-400 font-bold leading-relaxed mb-6">
                                この要請に応答すると、あなたの情報が{selectedRequest.hospitals?.hospital_name}へ「承認済み候補」として開示されます。
                            </p>

                            <div className="mb-6">
                                <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest leading-none">対象ドナー（ペット）を選択</label>
                                <select
                                    value={selectedPetId}
                                    onChange={(e) => setSelectedPetId(e.target.value)}
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-sm font-bold focus:border-life-red outline-none transition appearance-none"
                                >
                                    {pets.filter(p => p.species === selectedRequest.species).map(pet => (
                                        <option key={pet.id} value={pet.id}>
                                            {pet.pet_name} ({pet.species === 'dog' ? '犬' : '猫'} / {pet.blood_type || '血液型不明'})
                                        </option>
                                    ))}
                                    {pets.filter(p => p.species === selectedRequest.species).length === 0 && (
                                        <option value="">対象のペットが登録されていません</option>
                                    )}
                                </select>
                            </div>

                            <div className="space-y-6">
                                <label className="flex items-start space-x-4 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={approvalChecks.can_transport}
                                        onChange={() => setApprovalChecks({ ...approvalChecks, can_transport: !approvalChecks.can_transport })}
                                        className="mt-1 w-5 h-5 rounded-lg border-2 border-gray-200 text-life-red focus:ring-life-red cursor-pointer"
                                    />
                                    <span className="text-sm font-black text-deep-blue/80 leading-snug group-hover:text-life-red transition">24時間以内に病院へ向かうことが可能です。</span>
                                </label>

                                <label className="flex items-start space-x-4 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={approvalChecks.health_status}
                                        onChange={() => setApprovalChecks({ ...approvalChecks, health_status: !approvalChecks.health_status })}
                                        className="mt-1 w-5 h-5 rounded-lg border-2 border-gray-200 text-life-red focus:ring-life-red cursor-pointer"
                                    />
                                    <span className="text-sm font-black text-deep-blue/80 leading-snug group-hover:text-life-red transition">ドナーの体調は万全です。（元気・食欲良好）</span>
                                </label>

                                <label className="flex items-start space-x-4 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={approvalChecks.rest_period}
                                        onChange={() => setApprovalChecks({ ...approvalChecks, rest_period: !approvalChecks.rest_period })}
                                        className="mt-1 w-5 h-5 rounded-lg border-2 border-gray-200 text-life-red focus:ring-life-red cursor-pointer"
                                    />
                                    <span className="text-sm font-black text-deep-blue/80 leading-snug group-hover:text-life-red transition">最終供血（または採血）から1ヶ月以上経過しています。</span>
                                </label>

                                <label className="flex items-start space-x-4 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={approvalChecks.privacy_agree}
                                        onChange={() => setApprovalChecks({ ...approvalChecks, privacy_agree: !approvalChecks.privacy_agree })}
                                        className="mt-1 w-5 h-5 rounded-lg border-2 border-gray-200 text-life-red focus:ring-life-red cursor-pointer"
                                    />
                                    <span className="text-sm font-black text-deep-blue/80 leading-snug group-hover:text-life-red transition italic">開示情報・病名等の外部公開を禁止することに同意します。</span>
                                </label>
                            </div>

                            <div className="mt-12 space-y-4">
                                <button
                                    onClick={handleApproveRequest}
                                    className="w-full py-5 bg-[#0F172A] text-white rounded-[24px] font-black text-sm tracking-[0.2em] shadow-xl hover:bg-life-red transition transform active:scale-95 uppercase leading-none"
                                >
                                    Confirm & Approve
                                </button>
                                <p className="text-[10px] text-center text-gray-400 font-bold leading-relaxed px-4">
                                    ※承認後の自己都合によるキャンセルは、信頼スコア低下の対象となります。
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 🐕 新規ドナー登録モーダル */}
            {isRegistering && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-xl" onClick={() => setIsRegistering(false)}></div>
                    <div className="bg-white rounded-[40px] w-full max-w-lg p-8 md:p-12 relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-deep-blue tracking-tighter">ドナー登録</h3>
                                <p className="text-xs text-gray-500 font-bold mt-2">貴方の愛犬・愛猫が、命を救うヒーローになります。</p>
                            </div>
                            <button onClick={() => setIsRegistering(false)} className="text-gray-400 hover:text-gray-800 text-xl font-bold transition transform hover:scale-110">
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleRegisterSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Species</label>
                                    <select
                                        value={newDonor.species}
                                        onChange={e => setNewDonor({ ...newDonor, species: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-trust-blue/20"
                                        required
                                    >
                                        <option value="dog">犬 (Dog)</option>
                                        <option value="cat">猫 (Cat)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Pet Name</label>
                                    <input
                                        type="text"
                                        value={newDonor.pet_name}
                                        onChange={e => setNewDonor({ ...newDonor, pet_name: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-trust-blue/20"
                                        placeholder="ポチ"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Breed</label>
                                    <input
                                        type="text"
                                        value={newDonor.breed}
                                        onChange={e => setNewDonor({ ...newDonor, breed: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-trust-blue/20"
                                        placeholder="ゴールデンレトリバー"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Weight (kg)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={newDonor.weight_kg}
                                        onChange={e => setNewDonor({ ...newDonor, weight_kg: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-trust-blue/20"
                                        placeholder="20.5"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Blood Type</label>
                                    <select
                                        value={newDonor.blood_type}
                                        onChange={e => setNewDonor({ ...newDonor, blood_type: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-trust-blue/20"
                                    >
                                        <option value="">不明</option>
                                        {newDonor.species === 'dog' ? (
                                            <>
                                                <option value="DEA1.1+">DEA 1.1 +</option>
                                                <option value="DEA1.1-">DEA 1.1 -</option>
                                                <option value="DEA1.2">DEA 1.2</option>
                                                <option value="DEA3">DEA 3</option>
                                                <option value="DEA4">DEA 4</option>
                                                <option value="DEA5">DEA 5</option>
                                                <option value="DEA7">DEA 7</option>
                                            </>
                                        ) : (
                                            <>
                                                <option value="A">A型</option>
                                                <option value="B">B型</option>
                                                <option value="AB">AB型</option>
                                            </>
                                        )}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Prefecture</label>
                                    <input
                                        type="text"
                                        value={newDonor.prefecture}
                                        onChange={e => setNewDonor({ ...newDonor, prefecture: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-trust-blue/20"
                                        placeholder="東京都"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Owner Name</label>
                                    <input
                                        type="text"
                                        value={newDonor.contact_name}
                                        onChange={e => setNewDonor({ ...newDonor, contact_name: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-trust-blue/20"
                                        placeholder="山田 太郎"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={newDonor.contact_phone}
                                        onChange={e => setNewDonor({ ...newDonor, contact_phone: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-trust-blue/20"
                                        placeholder="090-1234-5678"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-trust-blue text-white rounded-2xl font-black text-sm tracking-widest uppercase shadow-lg shadow-blue-100 hover:bg-blue-600 transition"
                            >
                                供血ドナーを登録する
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {/* ✏️ ドナー情報編集モーダル */}
            {editingPetId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-xl" onClick={() => setEditingPetId(null)}></div>
                    <div className="bg-white rounded-[40px] w-full max-w-lg p-8 md:p-12 relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-deep-blue tracking-tighter">登録情報の編集</h3>
                                <p className="text-xs text-gray-500 font-bold mt-2">ペットの情報を最新のものに更新します。</p>
                            </div>
                            <button onClick={() => setEditingPetId(null)} className="text-gray-400 hover:text-gray-800 text-xl font-bold transition transform hover:scale-110">
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Species</label>
                                    <select
                                        value={editDonor.species}
                                        onChange={e => setEditDonor({ ...editDonor, species: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-trust-blue/20"
                                        required
                                    >
                                        <option value="dog">犬 (Dog)</option>
                                        <option value="cat">猫 (Cat)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Pet Name</label>
                                    <input
                                        type="text"
                                        value={editDonor.pet_name}
                                        onChange={e => setEditDonor({ ...editDonor, pet_name: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-trust-blue/20"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Breed</label>
                                    <input
                                        type="text"
                                        value={editDonor.breed}
                                        onChange={e => setEditDonor({ ...editDonor, breed: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-trust-blue/20"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Weight (kg)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={editDonor.weight_kg}
                                        onChange={e => setEditDonor({ ...editDonor, weight_kg: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-trust-blue/20"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Owner Name</label>
                                    <input
                                        type="text"
                                        value={editDonor.contact_name}
                                        onChange={e => setEditDonor({ ...editDonor, contact_name: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-trust-blue/20"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={editDonor.contact_phone}
                                        onChange={e => setEditDonor({ ...editDonor, contact_phone: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-trust-blue/20"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Blood Type</label>
                                    <select
                                        value={editDonor.blood_type}
                                        onChange={e => setEditDonor({ ...editDonor, blood_type: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-trust-blue/20"
                                    >
                                        <option value="">不明</option>
                                        {editDonor.species === 'dog' ? (
                                            <>
                                                <option value="DEA1.1+">DEA 1.1 +</option>
                                                <option value="DEA1.1-">DEA 1.1 -</option>
                                                <option value="DEA1.2">DEA 1.2</option>
                                                <option value="DEA3">DEA 3</option>
                                                <option value="DEA4">DEA 4</option>
                                                <option value="DEA5">DEA 5</option>
                                                <option value="DEA7">DEA 7</option>
                                            </>
                                        ) : (
                                            <>
                                                <option value="A">A型</option>
                                                <option value="B">B型</option>
                                                <option value="AB">AB型</option>
                                            </>
                                        )}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Prefecture</label>
                                    <input
                                        type="text"
                                        value={editDonor.prefecture}
                                        onChange={e => setEditDonor({ ...editDonor, prefecture: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-trust-blue/20"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-trust-blue text-white rounded-2xl font-black text-sm tracking-widest uppercase shadow-lg shadow-blue-100 hover:bg-blue-600 transition"
                            >
                                更新を保存する
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
