"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

interface ActiveRequest {
  id: string;
  species: string;
  urgency: string;
  hospitals: { hospital_name: string; address_city?: string };
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeRequests, setActiveRequests] = useState<ActiveRequest[]>([]);

  useEffect(() => {
    // 認証状態の監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // アクティブな緊急要請を取得
    supabase
      .from('blood_requests')
      .select('id, species, urgency, hospitals(hospital_name, address_city)')
      .eq('status', 'active')
      .in('urgency', ['urgent', 'emergency'])
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data) setActiveRequests(data as unknown as ActiveRequest[]);
      });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen font-sans text-gray-800 antialiased overflow-x-hidden">

      {/* 🚨 緊急要請バナー（アクティブな要請がある場合のみ表示） */}
      {activeRequests.length > 0 && (
        <div className="bg-life-red text-white py-2 px-4 z-[60] relative">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              <span className="flex h-2.5 w-2.5 relative flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
              </span>
              <p className="text-xs font-black tracking-widest uppercase whitespace-nowrap">
                🩸 緊急供血要請 {activeRequests.length}件 発令中
              </p>
              <div className="hidden sm:flex items-center space-x-3 overflow-hidden">
                {activeRequests.slice(0, 2).map(req => (
                  <span key={req.id} className="bg-white/20 rounded-full px-3 py-0.5 text-[10px] font-black whitespace-nowrap">
                    {req.species === 'dog' ? '🐶' : '🐱'} {req.hospitals?.hospital_name}
                  </span>
                ))}
              </div>
            </div>
            {user ? (
              <Link href="/mypage" className="text-white text-[10px] font-black border border-white/40 rounded-full px-3 py-1 hover:bg-white/20 transition whitespace-nowrap flex-shrink-0">
                要請を確認 →
              </Link>
            ) : (
              <Link href="/login?redirect=/mypage" className="text-white text-[10px] font-black border border-white/40 rounded-full px-3 py-1 hover:bg-white/20 transition whitespace-nowrap flex-shrink-0">
                ログインして確認 →
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link href="/" className="flex items-center group">
                <Image
                  src="/assets/logo_v2.png"
                  alt="ABC Logo"
                  width={80}
                  height={80}
                  priority
                  className="h-14 md:h-16 w-auto object-contain transform group-hover:scale-110 transition duration-300"
                />
                <span className="ml-3 text-2xl font-black tracking-tighter hidden sm:block leading-none">
                  <span className="text-life-green">Animal</span>
                  <span className="text-life-red">Blood</span>
                  <span className="text-trust-blue">Connect</span>
                </span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-10 text-sm font-bold">
              <a href="#about" className="text-gray-500 hover:text-life-red transition">仕組み</a>
              <a href="#story" className="text-gray-500 hover:text-life-red transition">ストーリー</a>
              <Link href="/hospital/login" className="text-trust-blue hover:text-blue-700 transition">動物病院の方へ</Link>

              <div className="h-6 w-px bg-gray-200"></div>

              {user ? (
                <div className="flex items-center space-x-6">
                  <Link href="/mypage" className="text-deep-blue hover:underline underline-offset-4">マイページ</Link>
                  <button onClick={handleLogout} className="text-gray-400 hover:text-gray-600 transition">ログアウト</button>
                </div>
              ) : (
                <Link href="/login" className="text-gray-600 hover:text-life-red transition">ログイン</Link>
              )}

              <Link
                href="/register"
                className="bg-life-red text-white px-8 py-3 rounded-full hover:bg-red-600 transition shadow-lg shadow-red-200 flex items-center transform hover:scale-105"
              >
                ドナー登録
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-life-red transition focus:outline-none"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 py-8 px-6 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col space-y-6 text-lg font-black text-deep-blue">
              <a href="#about" onClick={() => setIsMenuOpen(false)} className="hover:text-life-red transition">仕組み</a>
              <a href="#story" onClick={() => setIsMenuOpen(false)} className="hover:text-life-red transition">ストーリー</a>
              <Link href="/hospital/login" onClick={() => setIsMenuOpen(false)} className="hover:text-life-red transition">動物病院の方へ</Link>
              {user ? (
                <>
                  <Link href="/mypage" onClick={() => setIsMenuOpen(false)} className="hover:text-life-red transition">マイページ</Link>
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="text-left hover:text-life-red transition">ログアウト</button>
                </>
              ) : (
                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="hover:text-life-red transition">ログイン</Link>
              )}
            </div>
            <Link
              href="/register"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full bg-life-red text-white text-center py-5 rounded-2xl font-black shadow-xl shadow-red-100"
            >
              ドナー登録
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section 
        className="hero-bg pt-32 pb-24 md:pt-48 md:pb-40 px-4 overflow-hidden text-white relative"
        style={{ backgroundPosition: '60% center' }}
      >
        <div className="absolute inset-0 bg-deep-blue/40 md:bg-deep-blue/60 z-0"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest mb-8 border border-white/20">
            日本動物共助機構<br className="md:hidden" /><span className="md:ml-2 opacity-80">(AMAJ) Animal Mutual Aid Japan</span>
          </div>

          <div className="mb-12 space-y-8">
            <div className="space-y-3">
              <h1 className="text-3xl md:text-6xl font-black leading-tight tracking-tighter">
                動物の命をつなぐ<br className="md:hidden" />供血ネットワーク
              </h1>
              <p className="text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] text-white/80">
                Save lives through animal blood donation
              </p>
            </div>

            <div className="pt-4 space-y-3">
              <p className="text-xl md:text-3xl font-black text-white tracking-tight">
                あなたの愛犬・愛猫も命を救える
              </p>
              <p className="text-sm md:text-base font-bold text-white/90 leading-relaxed max-w-2xl mx-auto tracking-wide">
                登録は1分で完了します
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-4 items-center max-w-3xl mx-auto w-full px-4 mb-20">
            <Link
              href="/register"
              className="w-full md:w-auto flex flex-col items-center justify-center bg-life-red text-white px-10 py-5 rounded-full shadow-[0_0_30px_rgba(211,47,47,0.4)] hover:bg-red-600 transform hover:scale-105 transition duration-300"
            >
              <span className="text-lg md:text-xl font-black">供血ドナー登録はこちら</span>
              <span className="text-[10px] md:text-xs font-bold tracking-widest mt-1 opacity-90">Donor Registration</span>
            </Link>

            <Link
              href="/hospital"
              className="w-full md:w-auto flex flex-col items-center justify-center bg-white/20 backdrop-blur-md border border-white/40 text-white px-10 py-5 rounded-full shadow-2xl hover:bg-white/30 transform hover:scale-105 transition duration-300"
            >
              <span className="text-lg md:text-xl font-black">動物病院の方はこちら</span>
              <span className="text-[10px] md:text-xs font-bold tracking-widest mt-1 opacity-90">For Veterinary Hospitals</span>
            </Link>
          </div>

          {/* Taiyou Intro Block */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10 max-w-3xl mx-auto text-center space-y-8 shadow-2xl mb-12 relative overflow-hidden">
            {/* Subtle highlight effect */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            
            <div className="relative z-10">
              <p className="text-xl md:text-3xl font-black text-white leading-relaxed tracking-tight">
                このネットワークは、<br className="md:hidden" />1匹の野犬から始まりました
              </p>
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.1em] text-white/50 mt-3">
                This network began with one rescued stray dog.
              </p>
            </div>
            
            <div className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full overflow-hidden border-4 border-white/20 shadow-2xl relative z-10">
              <Image 
                src="/assets/taiyou_top.jpg" 
                alt="Taiyou Header" 
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-6 relative z-10">
              <p className="text-base md:text-xl font-bold text-white/90">
                助けられた命が、次の命を救いました。
              </p>
              <Link 
                href="#story" 
                className="inline-flex items-center justify-center group"
              >
                <span className="text-sm md:text-base font-black text-life-green bg-white rounded-full px-8 py-4 shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:bg-gray-100 group-hover:scale-105 transition-all duration-300">
                  太陽のストーリーを見る →
                </span>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 text-center bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div>
              <div className="text-3xl font-bold text-white">128</div>
              <div className="text-sm text-gray-300">現在の登録ドナー数</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">15</div>
              <div className="text-sm text-gray-300">今月救われた命</div>
            </div>
            <div className="col-span-2 md:col-span-1">
              <div className="text-3xl font-bold text-white">42</div>
              <div className="text-sm text-gray-300">提携動物病院</div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-white px-4">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8 text-gray-700 leading-[2] font-medium text-lg">
            <p>
              動物医療には、人の医療のような血液バンクがありません。<br />
              血液が必要になる時、それはいつも急を要する状況です。
            </p>
            <p>
              しかし現実には、患者のご家族がドナーを探さなければならない場面もあります。<br />
              私たちは、その負担を少しでも軽くするために、供血を必要とする医療機関と、協力の意思を持つドナー登録者を適切につなぐ仕組みを構築しました。
            </p>
            <p className="font-black text-deep-blue border-l-4 border-life-red pl-6 py-2">
              この仕組みは、感動や奇跡を生むためのものではありません。<br />
              ただ、必要な時に、静かに、確実につなぐためのものです。
            </p>
            <p>
              供血は善意によって支えられています。だからこそ、責任と秩序を大切にします。<br />
              命を救うのは医療です。私たちは、その手前を整えるだけです。
            </p>
            <p className="text-gray-400 text-sm">
              この仕組みは、多くの協力と信頼によって成り立っています。静かな社会インフラとして、必要な瞬間を支え続けます。
            </p>
          </div>
        </div>
      </section>

      {/* ☀️ Taiyou Story Section */}
      <section id="story" className="py-24 bg-deep-blue text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none"></div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter">The Story that Inspired this Network.</h2>
            <p className="text-life-green font-black tracking-[0.3em] uppercase text-xs">太陽がくれた、命のバトン</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-6 text-base md:text-lg font-medium leading-relaxed text-blue-50/90">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-grow">
                  <p>2年前の夜、一本の電話が鳴りました。<br />「近くの駐車場で、犬が血まみれで倒れている」</p>
                </div>
                {/* ☀️ Taiyou Top Image - Fixed size to fit content */}
                <div className="w-full md:w-48 flex-shrink-0 flex justify-center md:block">
                  <div className="rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl transform md:-rotate-2 inline-block">
                    <Image 
                      src="/assets/taiyou_top.jpg" 
                      alt="Taiyou Top" 
                      width={400} 
                      height={400} 
                      className="object-contain w-auto h-48 md:h-48 bg-deep-blue/10" 
                    />
                  </div>
                </div>
              </div>
              <p>すぐに向かうと、ライトに照らされた地面は真っ赤でした。国道で車に巻き込まれた野犬。包帯を巻く間も、命がこぼれていくような絶望的な状況でした。</p>
              <p>緊急手術で左前脚を断脚し、なんとか一命を取り留めたその子に、私たちは<span className="text-white font-black border-b-2 border-life-green">「太陽」</span>と名付けました。</p>
              
              <div className="py-4">
                <p className="text-2xl md:text-3xl font-black text-white italic leading-tight">太陽は、強い子でした。</p>
              </div>

              <p>三本脚になっても、1メートルの高さを軽々と跳び越え、誰より速く走る。そして、猫たちが自分から寄ってくるほど、穏やかな性格をしていました。散歩の帰り道、脚が疲れた太陽を何度も抱きかかえて帰ったのは、今では温かい思い出です。</p>
              
              <p>それから2年後。また一本の電話が鳴りました。それは、かつて太陽を救ってくれた動物病院の院長からでした。</p>
              <p className="bg-white/10 border-l-4 border-life-red p-4 font-bold text-white">
                「手術で、緊急に血液が必要になった。太陽の力を貸してほしい」
              </p>
              
              <p>かつて自分を救ってくれた場所へ。怖がりの太陽でしたが、私たちがそばにいると、静かに供血を受け入れてくれました。あの日、地面を赤く染めた太陽の血が、今度は別の命を救うために、誰かの体の中へと繋がったのです。</p>
              
              <div className="pt-8">
                <p className="text-xl font-black text-life-green mb-4">これが、私たちがABCを作った理由です。</p>
                <p className="text-sm border border-white/20 p-6 rounded-2xl bg-white/5">
                  ドナーが見つからずに救えない命がある。その現実を変えるために、徳島から始めます。太陽のように、助けられた命が、また誰かを助ける命になる。その連鎖を、当たり前の「仕組み」にしたい。
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="flex flex-wrap gap-4 justify-center lg:justify-end">
                {[
                  { src: "/assets/taiyou_1.jpg", alt: "Taiyou 1", rotate: "-rotate-3" },
                  { src: "/assets/taiyou_2.jpg", alt: "Taiyou 2", rotate: "rotate-2" },
                  { src: "/assets/taiyou_3.jpg", alt: "Taiyou 3", rotate: "-rotate-1" },
                  { src: "/assets/taiyou_4.jpg", alt: "Taiyou 4", rotate: "rotate-3" },
                  { src: "/assets/taiyou_5.jpg", alt: "Taiyou 5", rotate: "-rotate-2" },
                ].map((img, idx) => (
                  <div 
                    key={idx} 
                    className={`group relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-xl border-2 border-white/20 transform ${img.rotate} hover:rotate-0 hover:scale-[2] active:scale-[2] active:rotate-0 active:z-50 hover:z-50 transition-all duration-500 ease-out cursor-zoom-in`}
                    tabIndex={0}
                  >
                    <Image 
                      src={img.src} 
                      alt={img.alt} 
                      fill
                      className="object-cover pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent group-active:bg-transparent transition-colors duration-300 pointer-events-none"></div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-blue-300/60 mt-8 text-center lg:text-right font-bold italic">
                * 写真を長押し、またはマウスを合わせると大きく表示されます
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Flow Section */}
      <section id="about" className="py-24 bg-gray-50 rounded-t-[60px] relative z-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-deep-blue mb-4 tracking-tight">供血発令フロー</h2>
            <p className="text-gray-500 font-bold">責任分離された安全なマッチング構造</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { step: "01", title: "自己探索", desc: "飼い主が自力でドナーを探索" },
              { step: "02", title: "病院相談", desc: "見つからない場合、病院へ相談" },
              { step: "03", title: "要請発令", desc: "病院がシステムから要請を発信" },
              { step: "04", title: "ドナー通知", desc: "登録ドナーへ要請を通知" },
              { step: "05", title: "二段承認", desc: "ドナーが条件を確認し承認" },
              { step: "06", title: "最終選択", desc: "病院がドナーを最終判断" }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="text-life-red font-black text-xs mb-3">STEP {item.step}</div>
                <h3 className="font-black text-sm mb-2 text-deep-blue">{item.title}</h3>
                <p className="text-[10px] text-gray-500 leading-relaxed font-bold">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-gray-400 font-bold">
            ※本システム上でのマッチングは必ず医療機関（病院）の介入と判断を経て行われます。
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-deep-blue mb-4">選ばれる3つの理由</h2>
            <div className="w-20 h-1 bg-life-red mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl transition duration-300">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-trust-blue">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-black mb-3 text-deep-blue">完全匿名で安心</h3>
              <p className="text-gray-500 leading-relaxed font-bold text-sm">
                チャット機能でやり取りするため、病院に行くまで個人の連絡先を交換する必要はありません。
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl transition duration-300">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 text-life-red">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-black mb-3 text-deep-blue">金銭授受なし</h3>
              <p className="text-gray-500 leading-relaxed font-bold text-sm">
                善意のボランティアベースです。謝礼などの金銭トラブルを未然に防ぐルールを徹底しています。
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl transition duration-300">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6 text-life-green">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-black mb-3 text-deep-blue">病院認証制</h3>
              <p className="text-gray-500 leading-relaxed font-bold text-sm">
                登録・検索できるのは、事前に審査・承認された動物病院のみ。安心してご参加いただけます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-deep-blue mb-8">
            あなたの協力が必要です
          </h2>
          <p className="text-lg text-gray-500 font-bold mb-10 max-w-2xl mx-auto leading-relaxed">
            輸血さえあれば助かる命があります。<br />
            しかし、血液は長期保存ができず、常に不足しています。<br />
            あなたの愛犬・愛猫が、明日誰かのヒーローになるかもしれません。
          </p>
          <Link
            href="/register"
            className="inline-block bg-trust-blue text-white text-lg font-black px-12 py-5 rounded-full shadow-xl shadow-blue-200 hover:bg-blue-600 transition transform hover:scale-105"
          >
            ドナー登録を始める（無料）
          </Link>
          <p className="mt-4 text-sm text-gray-400 font-bold">所要時間：約3分</p>
        </div>
      </section>

      {/* Partner Shelters Section */}
      <section className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-black text-deep-blue mb-2">協力パートナー（動物保護団体）</h2>
          <p className="text-gray-400 font-bold mb-12 text-sm">全国の保護団体と連携し、支援の輪を広げています。</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-70 grayscale hover:grayscale-0 transition duration-500">
            <div className="flex items-center justify-center p-6 border-2 border-gray-100 rounded-[24px] shadow-sm">
              <span className="font-black text-gray-400">Region A Support</span>
            </div>
            <div className="flex items-center justify-center p-6 border-2 border-gray-100 rounded-[24px] shadow-sm">
              <span className="font-black text-gray-400">Partner A</span>
            </div>
            <div className="flex items-center justify-center p-6 border-2 border-gray-100 rounded-[24px] shadow-sm">
              <span className="font-black text-gray-400">Partner B</span>
            </div>
            <div className="flex items-center justify-center p-6 border-2 border-gray-100 rounded-[24px] shadow-sm">
              <span className="font-black text-gray-400">Partner C</span>
            </div>
          </div>

          <div className="mt-10">
            <Link href="/partner" className="text-life-red font-black hover:underline text-sm flex items-center justify-center">
              保護団体の皆様へ：パートナー登録について <span className="ml-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Liability Disclaimer Banner */}
      <div className="bg-deep-blue/5 border-y border-deep-blue/10 py-4 px-4">
        <p className="max-w-4xl mx-auto text-center text-[11px] md:text-xs text-deep-blue/60 font-black leading-relaxed">
          【免責事項】本システムはマッチング機能のみを提供します。医療判断・採血可否・適合判断は病院の責任です。ドナー提供は当事者間の合意に基づきます。
        </p>
      </div>

      {/* Footer */}
      <footer className="bg-deep-blue text-white py-16 px-4 overflow-hidden relative">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-12 md:space-y-0 relative z-10">
          <div className="text-center md:text-left">
            <div className="text-2xl font-black mb-6 tracking-tighter">
              <span className="text-life-green">Animal</span>
              <span className="text-life-red">Blood</span>
              <span className="text-white">Connect</span>
            </div>
            <p className="text-blue-300 max-w-sm text-xs font-medium leading-relaxed">
              すべては動物たちの明るい未来のために。<br />
              日本動物共助機構 (AMAJ) が提供する非営利プロジェクトです。
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 text-xs">
            <div className="flex flex-col space-y-4">
              <p className="font-black text-white/40 uppercase tracking-widest text-[10px]">Information</p>
              <Link href="/terms" className="font-bold hover:text-life-red transition text-white/60">利用規約（厳格版・草案）</Link>
              <a href="#" className="font-bold hover:text-life-red transition text-white/60">プライバシーポリシー</a>
            </div>
            <div className="flex flex-col space-y-4">
              <p className="font-black text-white/40 uppercase tracking-widest text-[10px]">Admin</p>
              <Link href="/hospital/login" className="font-bold hover:text-life-red transition text-white/60">動物病院の方へ</Link>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
          <p>© 2026 Animal Mutual Aid Japan (AMAJ)</p>
          <a href="mailto:animalbloodconnect@gmail.com" className="text-white/40 hover:text-white/60 transition normal-case tracking-normal">
            📧 animalbloodconnect@gmail.com
          </a>
        </div>
      </footer>
    </div>
  );
}
