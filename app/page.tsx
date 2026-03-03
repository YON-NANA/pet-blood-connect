"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useEffect(() => {
    // 認証状態の監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen font-sans text-gray-800 antialiased overflow-x-hidden">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link href="/" className="flex items-center group">
                <Image
                  src="/assets/logo_v2.png"
                  alt="ABC Logo"
                  width={60}
                  height={60}
                  priority
                  className="h-12 w-auto object-contain transform group-hover:scale-110 transition duration-300"
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
      <section className="hero-bg pt-32 pb-24 md:pt-48 md:pb-40 px-4 overflow-hidden text-white">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-full text-xs font-black uppercase tracking-widest mb-8 border border-white/20">
            JARA: 日本動物救済機構
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-8 leading-[1.2] tracking-tight">
            命を、<span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-red-100 italic">静かにつなぐ</span>仕組み。
          </h1>

          <p className="text-base md:text-xl mb-12 text-white/90 max-w-3xl mx-auto leading-relaxed font-medium">
            動物医療には、人の医療のような血液バンクがありません。<br className="hidden md:block" />
            私たちは、必要な時に、静かに、確実につなぐための<br className="hidden md:block" />
            「社会インフラ」としての供血ネットワークを構築しました。
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-5 items-center">
            <Link
              href="/register"
              className="w-full sm:w-auto bg-life-red text-white text-lg font-black px-12 py-5 rounded-full shadow-2xl shadow-red-200 hover:bg-red-600 transform hover:scale-105 transition duration-300"
            >
              ドナー登録して備える
            </Link>
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
              日本動物救済機構（JARA）が提供する非営利プロジェクトです。
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
          <p>© 2026 Japan Animal Rescue Agency (JARA)</p>
        </div>
      </footer>
    </div>
  );
}
