"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface Donor {
    id: string;
    pet_name: string;
    species: string;
    breed: string;
    owner_id: string;
    contact_name?: string;
    contact_phone?: string;
}

interface Hospital {
    hospital_name: string;
    phone_number?: string;
}

interface Message {
    id: string;
    sender_id: string;
    content: string;
    created_at: string;
    profiles?: {
        display_name: string;
        role: string;
    };
}

function ChatContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const donorId = params.id as string;
    const urlMatchId = searchParams.get('matchId');
    const scrollRef = useRef<HTMLDivElement>(null);

    const [donor, setDonor] = useState<Donor | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<{ display_name: string; role: string } | null>(null);
    const [matchId, setMatchId] = useState<string | null>(null);
    const [matchStatus, setMatchStatus] = useState<string>('pending');
    const [hospital, setHospital] = useState<Hospital | null>(null);

    useEffect(() => {
        async function initChat() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login?redirect=/chat/' + donorId);
                return;
            }
            setUser(user);

            // 自分のプロフィールも取得しておく
            const { data: myProfile } = await supabase
                .from('profiles')
                .select('display_name, role')
                .eq('id', user.id)
                .single();
            if (myProfile) setProfile(myProfile);

            try {

                // 2. ドナー情報取得
                const { data: donorData, error: donorError } = await supabase
                    .from('donors').select('*').eq('id', donorId).single();
                if (donorError) throw donorError;
                setDonor(donorData);

                // 3. 相談ルーム特定
                let currentMatchId = urlMatchId;

                if (urlMatchId) {
                    // URLにmatchIdがあっても、DBからステータスを必ず取得する
                    const { data: existingMatchData } = await supabase
                        .from('matches')
                        .select('id, status, hospital_id')
                        .eq('id', urlMatchId)
                        .single();

                    if (existingMatchData) {
                        setMatchStatus(existingMatchData.status);
                        const { data: hospData } = await supabase
                            .from('hospitals')
                            .select('*')
                            .eq('id', existingMatchData.hospital_id)
                            .single();
                        if (hospData) setHospital(hospData);
                    }
                } else {
                    // matchIdがURLに無い場合: acceptedを優先して最新のmatchを取得
                    const { data: matchData } = await supabase
                        .from('matches')
                        .select('id, status, hospital_id')
                        .eq('donor_id', donorId)
                        .eq('hospital_id', user.id)
                        .order('created_at', { ascending: false })
                        .limit(1);

                    if (matchData && matchData.length > 0) {
                        currentMatchId = matchData[0].id;
                        setMatchStatus(matchData[0].status);

                        // 病院情報の取得
                        const { data: hospData } = await supabase
                            .from('hospitals')
                            .select('*')
                            .eq('id', matchData[0].hospital_id)
                            .single();
                        if (hospData) setHospital(hospData);
                    } else {
                        // 新規作成
                        console.log('Creating specific room for this pair...');
                        const { data: newMatch, error: createError } = await supabase
                            .from('matches')
                            .insert([{ hospital_id: user.id, donor_id: donorId, status: 'pending' }])
                            .select().single();

                        if (createError) throw createError;
                        if (newMatch) currentMatchId = newMatch.id;
                    }
                }


                if (!currentMatchId) throw new Error('ルームが見つかりません');
                setMatchId(currentMatchId);

                // 4.既読処理の更新
                const view = searchParams.get('view');
                if (view === 'hospital' || view === 'donor') {
                    const updateField = view === 'hospital' ? 'hospital_last_read_at' : 'donor_last_read_at';
                    await supabase
                        .from('matches')
                        .update({ [updateField]: new Date().toISOString() })
                        .eq('id', currentMatchId);
                }

                // 5. メッセージ履歴の取得 (送信者のプロフィールも一緒に取る)
                const { data: msgData, error: msgError } = await supabase
                    .from('messages')
                    .select('*, profiles(display_name, role)')
                    .eq('match_id', currentMatchId)
                    .order('created_at', { ascending: true });

                if (msgError) throw msgError;
                if (msgData) setMessages(msgData as Message[]);

            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : '不明なエラー';
                console.error('Chat Init Error:', err);
                alert('初期化エラー: ' + message);
            } finally {
                setLoading(false);
            }
        }

        if (donorId) initChat();
    }, [donorId, urlMatchId, router]);

    // 2. リアルタイム購読
    useEffect(() => {
        if (!matchId || !user) return;

        const channel = supabase
            .channel(`realtime:messages:${matchId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `match_id=eq.${matchId}`
            }, async (payload) => {
                const newMsg = payload.new as Message;
                // 新着メッセージの送信者情報を取得
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('display_name, role')
                    .eq('id', newMsg.sender_id)
                    .single();

                const msgWithProfile = { ...newMsg, profiles: profile };

                setMessages(prev => {
                    // 重複チェック
                    if (prev.find(m => m.id === newMsg.id)) return prev;
                    return [...prev, msgWithProfile as Message];
                });
            })
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'matches',
                filter: `id=eq.${matchId}`
            }, (payload) => {
                const updatedMatch = payload.new as { status: string };
                if (updatedMatch.status) {
                    setMatchStatus(updatedMatch.status);
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [matchId, user]);

    // 3. スクロール制御
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async (content: string) => {
        if (!content.trim() || !matchId || !user || isSending) return;

        setIsSending(true);

        // 楽観的UI更新: DBの応答を待たずに画面に表示
        const tempId = `temp-${Date.now()}`;
        const optimisticMessage: Message = {
            id: tempId,
            sender_id: user.id,
            content: content,
            created_at: new Date().toISOString(),
            profiles: profile ? { display_name: profile.display_name, role: profile.role } : undefined,
        };
        setMessages(prev => [...prev, optimisticMessage]);

        try {
            const { data, error } = await supabase
                .from('messages')
                .insert([{
                    match_id: matchId,
                    sender_id: user.id,
                    content: content
                }])
                .select('id, created_at')
                .single();

            if (error) {
                // 失敗した場合は楽観的メッセージを削除
                setMessages(prev => prev.filter(m => m.id !== tempId));
                throw error;
            }

            // 成功した場合は仓メッセージのIDを正式なIDに入れ替え
            if (data) {
                setMessages(prev => prev.map(m =>
                    m.id === tempId ? { ...m, id: data.id, created_at: data.created_at } : m
                ));
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : '不明なエラー';
            alert('送信に失敗しました: ' + message);
        } finally {
            setIsSending(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const content = newMessage;
        setNewMessage(''); // 入力欄をクリア
        await sendMessage(content);
    };

    const handleAgreeMatch = async () => {
        if (!matchId || matchStatus === 'accepted') return;

        const confirmText = "マッチングに合意しますか？\n合意するとこの件の連絡先（病院名）が相手に開示されます。";
        if (!confirm(confirmText)) return;

        try {
            const { error } = await supabase
                .from('matches')
                .update({ status: 'accepted' })
                .eq('id', matchId);

            if (error) throw error;

            setMatchStatus('accepted');

            // 合意メッセージを自動送信
            await sendMessage("【システム】マッチングに合意しました。以降、具体的な日時の調整を行ってください。");

        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : '不明なエラー';
            alert('合意処理に失敗しました: ' + message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-trust-blue"></div>
            </div>
        );
    }

    const view = searchParams.get('view');

    return (
        <div className="bg-[#7494C0] h-screen flex flex-col font-sans overflow-hidden">
            {/* Contact Reveal Banner (Only when accepted) */}
            {matchStatus === 'accepted' && (
                <div className="bg-[#55C500] text-white px-6 py-2.5 flex items-center justify-between shadow-lg z-30 animate-in slide-in-from-top duration-500 border-b border-black/10">
                    <div className="flex items-center space-x-3">
                        <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-md">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                            </svg>
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80 leading-none mb-1">Direct Contact Opened</p>
                            <p className="text-sm font-black tracking-tight">
                                {view === 'hospital' ? (
                                    <>緊急連絡先 ({donor?.contact_name} 様): <span className="bg-white/20 px-2 py-0.5 rounded ml-1">{donor?.contact_phone}</span></>
                                ) : (
                                    <>担当病院 ({hospital?.hospital_name}): <span className="bg-white/20 px-2 py-0.5 rounded ml-1">{hospital?.phone_number || '番号未登録'}</span></>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="bg-white/95 backdrop-blur-md shadow-sm py-3 px-6 flex items-center justify-between z-20">
                <div className="flex items-center">
                    <button onClick={() => router.back()} className="mr-4 p-2 -ml-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all duration-200">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path>
                        </svg>
                    </button>
                    <div className="flex items-center">
                        <div className="w-11 h-11 bg-red-50 rounded-2xl flex items-center justify-center text-2xl mr-3 shadow-sm border border-red-100/50">
                            {donor?.species === 'dog' ? '🐶' : '🐱'}
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <h1 className="text-base font-black text-gray-900 tracking-tight leading-none">
                                    {donor?.pet_name}
                                </h1>
                                <span className="px-2 py-0.5 bg-gray-100 text-[10px] font-black text-gray-400 rounded-md uppercase tracking-wider">
                                    {donor?.breed}
                                </span>
                            </div>
                            <div className="flex items-center space-x-1.5 mt-1.5">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-life-green opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-life-green"></span>
                                </span>
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.1em]">Online / 相談受付中</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleAgreeMatch}
                        disabled={matchStatus === 'accepted'}
                        className={`${matchStatus === 'accepted' ? 'hidden' : 'bg-trust-blue text-white shadow-xl shadow-blue-100 hover:bg-blue-600 hover:scale-105'} px-5 py-2.5 rounded-xl text-[10px] font-black transition-all duration-300 tracking-[0.1em] uppercase active:scale-95`}
                    >
                        AGREE TO MATCH
                    </button>

                    <button
                        onClick={async () => {
                            const reason = window.prompt("辞退理由を入力してください（例：体調不良、スケジュールの都合など）\n※自己都合による直前の辞退は信頼スコア低下の対象となります。");
                            if (reason && matchId) {
                                try {
                                    const isHospital = view === 'hospital';
                                    const newStatus = isHospital ? 'hospital_cancelled' : 'cancelled';
                                    await supabase.from('matches').update({ status: newStatus }).eq('id', matchId);
                                    if (!isHospital && donor) {
                                        const { data: donorData } = await supabase.from('donors').select('trust_score, cancel_count').eq('id', donor.id).single();
                                        if (donorData) {
                                            const newCount = Number(donorData.cancel_count) + 1;
                                            await supabase.from('donors').update({
                                                trust_score: Math.max(0, Number(donorData.trust_score) - 15.0),
                                                cancel_count: newCount,
                                                account_status: newCount >= 3 ? 'suspended' : 'active'
                                            }).eq('id', donor.id);
                                        }
                                    }
                                    await sendMessage(`【システム】${isHospital ? '病院' : 'ドナー'}側から辞退の申し出がありました。理由: ${reason}`);
                                    alert("辞退申請を受理しました。システムにより信頼スコアの再計算が行われます。");
                                    router.push(isHospital ? '/hospital/dashboard' : '/mypage');
                                } catch (err) {
                                    console.error(err);
                                    alert("処理に失敗しました。");
                                }
                            }
                        }}
                        className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                        title="辞退する"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </button>
                </div>
            </header>

            {/* Chat Timeline */}
            <main
                ref={scrollRef}
                className="flex-grow p-4 md:px-8 space-y-6 overflow-y-auto scroll-smooth pb-8"
            >
                {/* Info Text */}
                <div className="flex justify-center">
                    <div className="max-w-md bg-black/10 backdrop-blur-sm px-6 py-2.5 rounded-2xl text-center border border-white/5">
                        <p className="text-[10px] text-white/70 font-bold leading-relaxed tracking-wider">
                            医療判断と処置はすべて病院の責任において行われます。<br />
                            個人情報の取り扱いにご注意ください。
                        </p>
                    </div>
                </div>

                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full space-y-4 py-20">
                        <div className="w-20 h-20 bg-white/10 rounded-[32px] flex items-center justify-center text-4xl animate-bounce">💬</div>
                        <p className="text-white font-black text-sm tracking-widest opacity-60">Say Hello!</p>
                    </div>
                )}

                {
                    messages.reduce((acc: React.ReactNode[], msg, idx) => {
                        const prevMsg = messages[idx - 1];
                        const currentDate = new Date(msg.created_at).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
                        const prevDate = prevMsg ? new Date(prevMsg.created_at).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' }) : null;

                        // 日付が変わったらセパレーターを挿入
                        if (currentDate !== prevDate) {
                            acc.push(
                                <div key={`date-${msg.id}`} className="flex justify-center my-8">
                                    <span className="bg-black/10 text-white/70 text-[10px] px-5 py-1.5 rounded-full font-black tracking-widest uppercase">
                                        {currentDate}
                                    </span>
                                </div>
                            );
                        }

                        const isOwnerSender = donor?.owner_id === msg.sender_id;
                        const senderRole = isOwnerSender ? 'donor' : 'hospital';
                        const isSystem = msg.content.startsWith('【システム】');

                        if (isSystem) {
                            acc.push(
                                <div key={msg.id} className="flex justify-center">
                                    <div className="bg-black/10 text-white/80 text-[10px] px-6 py-2 rounded-xl font-bold border border-white/5 tracking-tight max-w-[90%] text-center">
                                        {msg.content.replace('【システム】', '')}
                                    </div>
                                </div>
                            );
                            return acc;
                        }

                        const isMe = msg.sender_id === user?.id;
                        const alignRight = view ? (senderRole === view) : isMe;

                        // メッセージの連続判定（名前を省略するため）
                        const isContinuation = prevMsg && !prevMsg.content.startsWith('【システム】') && prevMsg.sender_id === msg.sender_id && (new Date(msg.created_at).getTime() - new Date(prevMsg.created_at).getTime() < 60000);

                        acc.push(
                            <div key={msg.id} className={`flex ${alignRight ? 'justify-end' : 'justify-start'} ${isContinuation ? 'mt-1' : 'mt-6 animate-in slide-in-from-bottom-2 duration-300'}`}>
                                <div className={`flex items-end space-x-2 max-w-[85%] ${alignRight ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                                    {/* Avatar Column */}
                                    {!alignRight && !isContinuation ? (
                                        <div className="w-9 h-9 flex-shrink-0 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm self-start mt-1">
                                            {isOwnerSender ? '👤' : '🏥'}
                                        </div>
                                    ) : (
                                        <div className="w-9 flex-shrink-0" />
                                    )}

                                    <div className={`flex flex-col ${alignRight ? 'items-end' : 'items-start'}`}>
                                        {/* Name Label */}
                                        {!isContinuation && (
                                            <span className={`text-[10px] font-black text-white/60 mb-1 px-1 tracking-tight flex items-center space-x-1`}>
                                                <span>{isOwnerSender ? 'ドナーの方' : '病院担当者'}</span>
                                                <span className="opacity-30">•</span>
                                                <span>{msg.profiles?.display_name || '管理者'}</span>
                                            </span>
                                        )}

                                        <div className="flex items-end space-x-1.5">
                                            <div className={`px-4 py-2.5 rounded-[22px] shadow-sm text-sm font-medium leading-[1.6] break-words whitespace-pre-wrap ${alignRight
                                                ? 'bg-[#85E249] text-gray-900 rounded-tr-[4px]'
                                                : 'bg-white text-gray-800 rounded-tl-[4px]'
                                                }`}>
                                                {msg.content}
                                            </div>
                                            <span className="text-[9px] font-bold text-white/50 mb-1 flex-shrink-0 tabular-nums">
                                                {new Date(msg.created_at).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );

                        return acc;
                    }, [])
                }
            </main>

            {/* Input Overlay */}
            <footer className="bg-white px-4 py-4 md:px-8 pb-10 md:pb-6 z-20">
                <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-end space-x-3">
                    <div className="flex-grow bg-gray-100 rounded-[28px] border border-gray-200 p-1.5 focus-within:ring-2 focus-within:ring-trust-blue/20 focus-within:bg-white focus-within:border-trust-blue transition-all duration-300">
                        <textarea
                            rows={1}
                            value={newMessage}
                            onChange={(e) => {
                                setNewMessage(e.target.value);
                                e.target.style.height = 'inherit';
                                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage(e);
                                    e.currentTarget.style.height = 'inherit';
                                }
                            }}
                            placeholder="メッセージを入力..."
                            className="w-full bg-transparent border-none focus:ring-0 text-sm py-2 px-4 resize-none outline-none font-medium leading-relaxed"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        disabled={isSending || !newMessage.trim()}
                        className="bg-[#24A1DE] text-white w-12 h-12 rounded-[22px] flex items-center justify-center shadow-lg shadow-blue-900/10 hover:bg-[#1C8CC4] active:scale-90 transition-all duration-200 disabled:bg-gray-200 disabled:shadow-none disabled:cursor-not-allowed flex-shrink-0"
                    >
                        {isSending ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <svg className="w-5 h-5 transform translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                            </svg>
                        )}
                    </button>
                </form>
            </footer>
        </div>
    );
}
export default function ChatPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">チャットを読み込み中...</div>}>
            <ChatContent />
        </Suspense>
    );
}
