"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function RescueGuidePage() {
  return (
    <div className="bg-[#FAFAFA] min-h-screen flex flex-col font-sans">
      <header className="bg-white shadow-sm py-4 h-20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <Image src="/assets/logo_v2.png" alt="Logo" width={50} height={50}
              className="h-12 w-auto object-contain transform group-hover:scale-105 transition duration-300" />
            <span className="ml-3 text-xl font-black tracking-tighter hidden sm:block leading-none">
              <span className="text-life-green">Animal</span>
              <span className="text-life-red">Blood</span>
              <span className="text-trust-blue">Connect</span>
            </span>
          </Link>
          <Link href="/" className="text-sm font-bold text-gray-500 hover:text-black transition">
            トップへ戻る
          </Link>
        </div>
      </header>

      <main className="flex-grow pt-10 pb-20 px-4">
        <div className="max-w-3xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 text-red-500 rounded-full text-4xl mb-2 animate-pulse">
              🚨
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-deep-blue tracking-tighter">
              道端で負傷動物を見つけたら
            </h1>
            <p className="text-gray-500 font-bold text-sm md:text-base leading-relaxed">
              落ち着いて、以下のステップに従って行動してください。<br className="hidden md:block"/>あなたの行動が、ひとつの命を救う最初の一歩になります。
            </p>
          </div>

          <div className="space-y-6">
            
            {/* Step 1 */}
            <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col md:flex-row gap-6 items-start relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -z-0"></div>
              <div className="w-16 h-16 bg-deep-blue text-white rounded-2xl flex items-center justify-center text-2xl font-black flex-shrink-0 z-10 shadow-lg">1</div>
              <div className="z-10">
                <h2 className="text-2xl font-black text-deep-blue mb-3">安全の確保と状況確認</h2>
                <div className="space-y-3 text-gray-600 font-medium leading-relaxed">
                  <p>まずは<strong className="text-life-red">あなた自身の安全</strong>を確保してください。道路上の場合は、車やバイクなど周囲の交通に十分注意してください。</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>後続車に合図を送り、二次的な交通事故を防ぎましょう。</li>
                    <li>動物がパニックになって噛み付くことがあります。不用意に触らず、タオルや布でそっと包むように保護できるか確認してください。</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col md:flex-row gap-6 items-start relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0"></div>
              <div className="w-16 h-16 bg-trust-blue text-white rounded-2xl flex items-center justify-center text-2xl font-black flex-shrink-0 z-10 shadow-lg">2</div>
              <div className="z-10 w-full">
                <h2 className="text-2xl font-black text-deep-blue mb-3">各機関への連絡</h2>
                <p className="text-gray-600 font-medium leading-relaxed mb-4">
                  負傷している動物（特に飼い主のわからない犬猫）を保護した場合、法律によって「遺失物」として扱われるため、適切な機関への連絡が必要です。
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100">
                    <h3 className="font-black text-deep-blue mb-2 text-lg">🚓 最寄りの警察署</h3>
                    <p className="text-xs text-gray-500 mb-3 leading-relaxed">道端での怪我は「遺失物（拾得物）」として届け出を行う必要があります。</p>
                    <a href="https://www.npa.go.jp/bureau/soumu/mado/index.html" target="_blank" rel="noopener noreferrer" className="inline-block text-trust-blue text-xs font-bold hover:underline">警察署を探す →</a>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100">
                    <h3 className="font-black text-deep-blue mb-2 text-lg">🏢 動物愛護センター</h3>
                    <p className="text-xs text-gray-500 mb-3 leading-relaxed">収容やその後の保護対応について、管轄の愛護センターに相談します。</p>
                    <a href="https://www.env.go.jp/nature/dobutsu/aigo/3_contact/index.html" target="_blank" rel="noopener noreferrer" className="inline-block text-trust-blue text-xs font-bold hover:underline">全国の愛護センター一覧 →</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col md:flex-row gap-6 items-start relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -z-0"></div>
              <div className="w-16 h-16 bg-life-green text-white rounded-2xl flex items-center justify-center text-2xl font-black flex-shrink-0 z-10 shadow-lg">3</div>
              <div className="z-10 w-full">
                <h2 className="text-2xl font-black text-deep-blue mb-3">動物病院への搬送</h2>
                <div className="space-y-4 text-gray-600 font-medium leading-relaxed">
                  <p>一刻を争う場合、または警察や愛護センターの指示を仰いだ後、最寄りの動物病院へ搬送してください。</p>
                  <p className="text-sm bg-yellow-50 text-yellow-800 p-4 rounded-2xl border border-yellow-200">
                    ※搬送前に病院へ電話を入れ、「負傷した野良犬（猫）を保護した」と伝えると、病院側が準備しやすくなります。搬送者の費用負担についても相談してください。
                  </p>
                  <a href="https://pet.caloo.jp/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-deep-blue font-bold px-6 py-3 rounded-2xl transition w-full md:w-auto text-sm justify-center mt-2">
                    <span>🏥 近くの動物病院を検索する</span>
                    <span className="text-[10px] text-gray-400">（外部サイトへ）</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-[#0F172A] p-8 md:p-10 rounded-[40px] shadow-2xl flex flex-col md:flex-row gap-6 items-start relative overflow-hidden border border-white/10 mt-12">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[100px] pointer-events-none"></div>
              <div className="w-16 h-16 bg-life-red text-white border-2 border-white/20 rounded-2xl flex items-center justify-center text-2xl font-black flex-shrink-0 z-10 shadow-lg shadow-red-500/30">4</div>
              <div className="z-10">
                <h2 className="text-2xl font-black text-white mb-3 tracking-tighter">一人で不安なときは</h2>
                <div className="space-y-4 text-gray-300 font-medium leading-relaxed">
                  <p>
                    「どうしていいかわからない」「治療費やその後の引き取り先が見つからない」など、お困りの場合は、本プラットフォームに登録して負傷動物のサポートに同意している<strong className="text-life-red">地域の保護団体・パートナー</strong>にご相談ください。
                  </p>
                  
                  {/* ABC Registered Partners */}
                  <div className="bg-deep-blue border border-white/20 p-6 rounded-3xl mt-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-trust-blue/10 rounded-full blur-3xl -z-0"></div>
                    <h3 className="font-black text-white text-lg mb-4 flex items-center">
                      <span className="text-trust-blue mr-2">🤝</span>最寄りの登録パートナー
                    </h3>
                    
                    {/* Placeholder for Dynamic Partner List */}
                    <div className="bg-black/40 rounded-2xl p-5 border border-white/5 space-y-3 relative z-10 text-center">
                      <p className="text-sm font-bold text-gray-300">
                        近隣の登録パートナーを表示（システム連携準備中）
                      </p>
                      <button disabled className="bg-trust-blue/50 text-white font-black px-6 py-3 rounded-xl cursor-not-allowed opacity-70 text-sm">
                        📍 現在地からパートナーを探す
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-5 rounded-3xl mt-4">
                    <h3 className="font-bold text-white text-sm mb-2 opacity-80">または一般検索から探す</h3>
                    <p className="text-xs text-gray-400 mb-4">
                      ※お近くに登録パートナーが見つからない場合は、お住まいの地域名と「動物保護団体」で検索し、連絡を取ってみてください。
                    </p>
                    <a href="https://www.google.com/search?q=%E5%8B%95%E7%89%A9%E4%BF%9D%E8%AD%B7%E5%9B%A3%E4%BD%93" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-xl transition text-sm shadow-sm">
                      <span>🔍 Googleで近くの保護団体を検索</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="text-center pt-8 border-t border-gray-100">
            <Link href="/" className="inline-flex items-center text-deep-blue font-black hover:text-life-red transition text-sm">
              ← トップページへ戻る
            </Link>
          </div>
          
        </div>
      </main>
    </div>
  );
}
