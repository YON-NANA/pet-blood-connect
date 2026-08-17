"use client";

import React, { useState } from 'react';
import Link from 'next/link';

type DocumentType = 'explanation' | 'consent' | null;

export default function Documents() {
  const [activePreview, setActivePreview] = useState<DocumentType>(null);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C3E50] font-sans leading-relaxed">
      <header className="bg-[#003366] py-5 px-8 flex items-center justify-between border-b-4 border-life-red">
        <Link href="/" className="text-white font-bold text-lg tracking-widest hover:text-red-200 transition">
          🐾 AnimalBloodConnect
        </Link>
        <div className="hidden md:flex text-[#A8C8E8] text-sm items-center gap-6 font-medium">
          <span>Animal Mutual Aid Japan (AMAJ)</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        <div className="text-center mb-12">
          <span className="inline-block bg-[#003366]/10 text-[#003366] text-xs md:text-sm font-black px-4 py-1.5 rounded-full mb-3 tracking-wider">
            OFFICIAL DOCUMENTS & POLICIES
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-[#003366] mb-3 tracking-tight">
            必要書類一覧・規定
          </h1>
          <p className="text-gray-600 text-sm md:text-base font-medium max-w-xl mx-auto">
            供血（献血）に関する説明書類および同意書のテンプレートです。スマートフォンからもプレビュー画像で内容をご確認いただけます。
          </p>
        </div>

        {/* Documents Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Card 1: 飼い主向け供血説明文 */}
          <div className="bg-white rounded-[28px] p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="bg-blue-50 text-[#003366] text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
                  事前確認用書類
                </span>
                <span className="text-xs text-gray-400 font-bold">A4サイズ 1枚</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#003366] mb-2 group-hover:text-blue-700 transition">
                飼い主向け供血説明文
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mb-6 font-medium leading-relaxed">
                供血の意義、検査・採血の流れ、伴うリスクや帰宅後の過ごし方について動物病院から飼い主様へご説明する標準的な内容です。
              </p>

              {/* 書類プレビュー（スマホ・PC両対応ミニチュア画像風UI） */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-500 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
                    書類プレビュー（スマホ対応）
                  </span>
                  <button
                    onClick={() => setActivePreview('explanation')}
                    className="text-xs text-[#003366] hover:text-red-600 font-black flex items-center transition"
                  >
                    🔍 タップで拡大
                  </button>
                </div>

                <div 
                  onClick={() => setActivePreview('explanation')}
                  className="cursor-pointer relative bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl p-3 border-2 border-dashed border-gray-200 hover:border-[#003366] transition group/preview overflow-hidden"
                >
                  {/* A4ペーパー風ミニチュア */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 aspect-[1/1.35] text-[7px] sm:text-[8px] text-gray-500 select-none overflow-hidden relative leading-tight">
                    {/* 透かしバッジ */}
                    <div className="absolute top-3 right-3 opacity-15">
                      <div className="w-8 h-8 rounded-full border-2 border-red-600 flex items-center justify-center text-[6px] font-black text-red-600 transform rotate-12">
                        院内用
                      </div>
                    </div>

                    <div className="text-center border-b border-gray-300 pb-1.5 mb-2">
                      <div className="font-black text-[9px] sm:text-[10px] text-gray-800 tracking-wider">
                        供血（献血）のお願いとご説明
                      </div>
                      <div className="text-[6px] text-gray-400">飼い主様向け事前確認書類</div>
                    </div>

                    <div className="space-y-1.5">
                      <div>
                        <div className="font-bold text-gray-700 text-[7.5px] border-l-2 border-[#003366] pl-1 mb-0.5">
                          1. 供血の意義と目的
                        </div>
                        <div className="text-gray-400 line-clamp-2">
                          この度は輸血を必要とする動物のために供血へのご協力を検討いただき誠にありがとうございます...
                        </div>
                      </div>

                      <div>
                        <div className="font-bold text-gray-700 text-[7.5px] border-l-2 border-[#003366] pl-1 mb-0.5">
                          2. 供血の基本的な流れ
                        </div>
                        <div className="space-y-0.5 text-gray-400">
                          <p>① 身体検査・血液検査</p>
                          <p>② 鎮静処置（必要な場合）</p>
                          <p>③ 採血（供血：15〜30分程度）</p>
                          <p>④ 止血と経過観察</p>
                        </div>
                      </div>

                      <div>
                        <div className="font-bold text-gray-700 text-[7.5px] border-l-2 border-[#003366] pl-1 mb-0.5">
                          3. 伴うリスク・合併症
                        </div>
                        <div className="text-gray-400 line-clamp-2">
                          採血部位の異常、一過性の体調不良、鎮静・麻酔のリスクについて...
                        </div>
                      </div>

                      <div className="pt-1 border-t border-gray-200 flex justify-between items-center text-[6px] text-gray-400">
                        <span>AnimalBloodConnect 標準書式</span>
                        <span className="text-red-500 font-bold">印鑑・署名欄あり</span>
                      </div>
                    </div>

                    {/* ホバー/タップ誘導オーバーレイ */}
                    <div className="absolute inset-0 bg-[#003366]/80 flex flex-col items-center justify-center text-white opacity-0 group-hover/preview:opacity-100 transition-opacity backdrop-blur-[1px] p-4 text-center">
                      <span className="text-2xl mb-1">🔍</span>
                      <span className="font-bold text-xs">スマホ用プレビューを拡大</span>
                      <span className="text-[10px] text-blue-200 mt-1">タップして全文を読む</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => setActivePreview('explanation')}
                className="w-full bg-blue-50 hover:bg-blue-100 text-[#003366] font-black py-3 rounded-2xl flex justify-center items-center transition text-sm border border-blue-200"
              >
                <span className="mr-2">📱</span>スマホでプレビューを見る
              </button>
              <Link
                href="/documents/explanation"
                className="w-full bg-[#003366] hover:bg-blue-900 text-white font-black py-3.5 rounded-2xl flex justify-center items-center transition shadow-md text-sm"
              >
                <span className="mr-2">🖨️</span>書面を表示 / 印刷する
              </Link>
            </div>
          </div>

          {/* Card 2: 供血同意書フォーマット */}
          <div className="bg-white rounded-[28px] p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-100">
                  署名・同意用書類
                </span>
                <span className="text-xs text-gray-400 font-bold">A4サイズ 1枚</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#003366] mb-2 group-hover:text-blue-700 transition">
                供血同意書フォーマット
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mb-6 font-medium leading-relaxed">
                動物病院での供血処置前に、獣医師とドナー飼い主様の間で取り交わしていただく同意書・署名捺印テンプレートです。
              </p>

              {/* 書類プレビュー（スマホ・PC両対応ミニチュア画像風UI） */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-500 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
                    書類プレビュー（スマホ対応）
                  </span>
                  <button
                    onClick={() => setActivePreview('consent')}
                    className="text-xs text-[#003366] hover:text-red-600 font-black flex items-center transition"
                  >
                    🔍 タップで拡大
                  </button>
                </div>

                <div 
                  onClick={() => setActivePreview('consent')}
                  className="cursor-pointer relative bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl p-3 border-2 border-dashed border-gray-200 hover:border-[#003366] transition group/preview overflow-hidden"
                >
                  {/* A4ペーパー風ミニチュア */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 aspect-[1/1.35] text-[7px] sm:text-[8px] text-gray-500 select-none overflow-hidden relative leading-tight">
                    <div className="text-right text-[6px] text-gray-400 mb-1">
                      作成日：令和　年　月　日
                    </div>

                    <div className="text-center border-b border-gray-300 pb-1.5 mb-2">
                      <div className="font-black text-[9px] sm:text-[10px] text-gray-800 tracking-wider">
                        供血（献血）に関する同意書
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-gray-400 line-clamp-3">
                        私は、担当獣医師から「供血のお願いとご説明」に基づき、十分な説明を受け、内容を理解した上で供血に同意します...
                      </p>

                      {/* 署名テーブル風デザイン */}
                      <div className="border border-gray-300 rounded p-1 bg-gray-50/50 mt-2">
                        <div className="font-bold text-gray-700 text-[6.5px] mb-1">【病院保管用 署名欄】</div>
                        <div className="grid grid-cols-2 gap-1 text-[6px]">
                          <div className="border-b border-gray-200 pb-0.5">飼い主様氏名：＿＿＿＿ ㊞</div>
                          <div className="border-b border-gray-200 pb-0.5">住所：＿＿＿＿＿＿＿＿</div>
                          <div>ペット名：＿＿＿＿</div>
                          <div>品種/年齢：＿＿＿＿</div>
                        </div>
                      </div>

                      <div className="border-t border-dashed border-gray-300 pt-1 mt-1.5">
                        <div className="font-bold text-gray-700 text-[6.5px] mb-0.5">【飼い主様控え】</div>
                        <div className="text-[6px] text-gray-400">
                          動物病院名 / 担当獣医師 ㊞
                        </div>
                      </div>
                    </div>

                    {/* ホバー/タップ誘導オーバーレイ */}
                    <div className="absolute inset-0 bg-[#003366]/80 flex flex-col items-center justify-center text-white opacity-0 group-hover/preview:opacity-100 transition-opacity backdrop-blur-[1px] p-4 text-center">
                      <span className="text-2xl mb-1">🔍</span>
                      <span className="font-bold text-xs">スマホ用プレビューを拡大</span>
                      <span className="text-[10px] text-blue-200 mt-1">タップして全文を読む</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => setActivePreview('consent')}
                className="w-full bg-blue-50 hover:bg-blue-100 text-[#003366] font-black py-3 rounded-2xl flex justify-center items-center transition text-sm border border-blue-200"
              >
                <span className="mr-2">📱</span>スマホでプレビューを見る
              </button>
              <Link
                href="/documents/consent"
                className="w-full bg-[#003366] hover:bg-blue-900 text-white font-black py-3.5 rounded-2xl flex justify-center items-center transition shadow-md text-sm"
              >
                <span className="mr-2">✍️</span>書面を表示 / 印刷する
              </Link>
            </div>
          </div>
        </div>

        {/* 費用負担・金銭授受規定 */}
        <div className="bg-white rounded-[32px] shadow-sm p-6 md:p-10 mb-8 border border-gray-100">
          <h2 className="text-xl font-black text-life-red mb-6 border-b border-gray-100 pb-4 flex items-center">
            <span className="text-2xl mr-3">💰</span>費用負担・金銭授受の禁止規定
          </h2>
          <div className="text-gray-700 space-y-4 font-medium leading-relaxed text-sm md:text-base">
            <p>
              本プラットフォーム（AnimalBloodConnect）を通じた供血は、<strong>完全なボランティアベース（無償の善意）</strong>で行われます。
            </p>
            <p className="font-bold text-[#003366]">
              【飼い主様間の金銭授受の禁止】
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2 text-sm">
              <li>ドナー側からレシピエント（輸血を受ける側）への謝礼の要求は固く禁じております。</li>
              <li>交通費やその他名目での金銭のやり取りもできません。</li>
            </ul>
            <p className="font-bold text-[#003366] mt-6">
              【医療費の取り扱い】
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2 text-sm">
              <li>ドナーの血液検査費用や処置費用は、基本的には<strong>要請を行った動物病院、またはレシピエント側</strong>で負担することが一般的です（詳細は各動物病院と事前に取り決めます）。</li>
              <li>ドナー飼い主様に、供血に対する医療費の負担が発生することはありません。</li>
            </ul>
          </div>
        </div>

        {/* 事故時対応フロー */}
        <div className="bg-red-50 border-l-4 border-life-red rounded-r-3xl p-6 md:p-8 mb-10">
          <h2 className="text-lg font-black text-red-800 mb-4 flex items-center">
            <span className="text-2xl mr-2">🚨</span>事故時対応フロー（万が一の場合）
          </h2>
          <p className="text-red-900 font-bold leading-relaxed mb-4 text-sm md:text-base">
            動物病院は細心の注意を払って供血処置を行いますが、動物の体調急変などの事故が発生した場合の責任分界や対応については以下の通りです。
          </p>
          <ul className="list-inside list-decimal text-red-800 space-y-3 font-medium text-xs sm:text-sm">
            <li><strong>応急処置の義務:</strong> 当該動物病院はドナー動物に対して最善の救命・応急処置を無償にて行う義務を負います。</li>
            <li><strong>賠償責任の範囲:</strong> 獣医療上の過失が認められた場合は、動物病院が加入する獣医師賠償責任保険等の範囲で対応が行われます。</li>
            <li><strong>免責事項:</strong> 事前に予見不可能な特異体質や、事前の問診で申告されなかった既往症に起因する事故については、病院側の責任は制限される場合があります。</li>
          </ul>
        </div>

        <div className="text-center mt-12">
          <Link href="/" className="inline-block bg-[#003366] text-white px-8 py-4 rounded-full font-bold hover:bg-blue-900 transition shadow-lg text-sm sm:text-base">
            トップページへ戻る
          </Link>
        </div>
      </main>

      {/* スマートフォン・PC対応 拡大プレビューモーダル */}
      {activePreview && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn"
          onClick={() => setActivePreview(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* モーダルヘッダー */}
            <div className="bg-[#003366] text-white px-5 py-4 flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-2">
                <span className="text-lg">📄</span>
                <h3 className="font-bold text-sm sm:text-base">
                  {activePreview === 'explanation' ? '飼い主向け供血説明文 プレビュー' : '供血同意書フォーマット プレビュー'}
                </h3>
              </div>
              <button 
                onClick={() => setActivePreview(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition font-bold"
                aria-label="閉じる"
              >
                ✕
              </button>
            </div>

            {/* モーダル本文（書類スクロールビュー） */}
            <div className="p-4 sm:p-8 overflow-y-auto bg-gray-50 flex-1">
              <div className="bg-white p-6 sm:p-10 rounded-2xl shadow border border-gray-200 text-gray-800 font-sans text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
                {activePreview === 'explanation' ? (
                  /* 供血説明文 プレビュー内容 */
                  <div className="space-y-6">
                    <div className="border-b-2 border-gray-800 pb-3 text-center">
                      <h4 className="text-lg sm:text-xl font-black tracking-widest text-gray-900 mb-1">
                        供血（献血）のお願いとご説明
                      </h4>
                      <p className="text-[11px] text-gray-500">飼い主様向け事前確認書類</p>
                    </div>

                    <div>
                      <h5 className="font-bold text-gray-900 border-l-4 border-gray-800 pl-2.5 mb-2 text-sm sm:text-base">
                        1. 供血の意義と目的
                      </h5>
                      <p className="text-gray-700">
                        この度は、輸血を必要とする動物のために供血（献血）へのご協力を検討いただき、誠にありがとうございます。動物医療においては、人間の献血のような大規模な血液備蓄システムが存在せず、緊急時にはボランティアであるドナー動物の血液が唯一の頼りとなります。
                      </p>
                    </div>

                    <div>
                      <h5 className="font-bold text-gray-900 border-l-4 border-gray-800 pl-2.5 mb-2 text-sm sm:text-base">
                        2. 供血の基本的な流れ
                      </h5>
                      <ol className="list-decimal pl-4 space-y-1.5 text-gray-700">
                        <li><strong>身体検査・血液検査：</strong> ドナーの健康状態と血液型（交差適合）を確認します。</li>
                        <li><strong>鎮静処置（必要な場合）：</strong> ストレス軽減のため、軽い鎮静剤を使用することがあります。</li>
                        <li><strong>採血（供血）：</strong> 首の静脈等から安全な量を採取します（15〜30分程度）。</li>
                        <li><strong>止血と経過観察：</strong> 処置後、院内で異常がないか一定時間観察します。</li>
                      </ol>
                    </div>

                    <div>
                      <h5 className="font-bold text-gray-900 border-l-4 border-gray-800 pl-2.5 mb-2 text-sm sm:text-base">
                        3. 伴うリスク・合併症について
                      </h5>
                      <ul className="list-disc pl-4 space-y-1 text-gray-700">
                        <li><strong>採血部位の異常：</strong> 皮下出血、腫れ（通常数日で回復）</li>
                        <li><strong>一過性の体調不良：</strong> 軽度のふらつき、元気・食欲の低下など</li>
                        <li><strong>鎮静・麻酔のリスク：</strong> 特異体質等による予期せぬ反応のリスク</li>
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-bold text-gray-900 border-l-4 border-gray-800 pl-2.5 mb-2 text-sm sm:text-base">
                        4. 費用負担・金銭の取り扱い
                      </h5>
                      <p className="text-gray-700">
                        本供血は完全なボランティアです。ドナー飼い主様から輸血を受ける側への謝礼・交通費等の金銭の要求は固く禁じられております。また検査・供血処置費用をドナー飼い主様が負担することはありません。
                      </p>
                    </div>

                    <div>
                      <h5 className="font-bold text-gray-900 border-l-4 border-gray-800 pl-2.5 mb-2 text-sm sm:text-base">
                        5. 帰宅後の過ごし方
                      </h5>
                      <p className="text-gray-700">
                        当日は安静に過ごさせ、新鮮な水を飲めるようにしてください。万一異常が見られた場合は速やかに動物病院へご連絡ください。
                      </p>
                    </div>

                    <div className="pt-6 border-t border-gray-300 text-right text-gray-600 text-xs">
                      <p>【説明担当・動物病院】</p>
                      <p className="mt-1">動物病院名：＿＿＿＿＿＿＿＿＿＿</p>
                      <p className="mt-1">担当獣医師：＿＿＿＿＿＿＿＿＿ ㊞</p>
                    </div>
                  </div>
                ) : (
                  /* 供血同意書 プレビュー内容 */
                  <div className="space-y-6">
                    <div className="text-right text-xs text-gray-500">
                      作成日：令和　　年　　月　　日
                    </div>

                    <div className="border-b-2 border-gray-800 pb-3 text-center">
                      <h4 className="text-lg sm:text-xl font-black tracking-widest text-gray-900 mb-1">
                        供血（献血）に関する同意書
                      </h4>
                    </div>

                    <div className="space-y-3 text-gray-700 leading-relaxed">
                      <p>
                        　私は、担当獣医師から別紙「供血（献血）のお願いとご説明」の内容に基づき、私の飼育する動物の供血（献血）の意義、身体検査・血液検査、必要に応じた鎮静処置、採血の流れについて十分な説明を受けました。
                      </p>
                      <p>
                        　また、供血に伴う手技、合併症や万が一のリスク（皮下出血や一時的な体調不良、鎮静・麻酔のリスク等）についても理解し、納得いたしました。
                      </p>
                      <p>
                        　さらに、本供血が完全なボランティア（無償の善意）として実施されるものであり、金銭の要求が禁じられていること、医療費を負担しないことについても承諾いたします。
                      </p>
                      <p className="font-bold text-gray-900">
                        　以上の説明を受け、内容を十分に理解したうえで、私の飼育する動物を供血ドナーとして協力することに同意します。
                      </p>
                    </div>

                    <div className="mt-6 border border-gray-800 rounded-lg overflow-hidden">
                      <div className="bg-gray-100 px-3 py-1.5 font-bold text-xs text-gray-800 border-b border-gray-800">
                        【病院保管用 署名欄】
                      </div>
                      <div className="p-3 space-y-2 text-xs">
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="font-bold text-gray-600">飼い主様 ご氏名:</span>
                          <span className="text-gray-400">＿＿＿＿＿＿＿＿＿＿ ㊞</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="font-bold text-gray-600">ご住所:</span>
                          <span className="text-gray-400">＿＿＿＿＿＿＿＿＿＿＿＿</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="font-bold text-gray-600">動物のお名前（ペット名）:</span>
                          <span className="text-gray-400">＿＿＿＿＿＿＿＿</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-bold text-gray-600">品種 / 年齢:</span>
                          <span className="text-gray-400">＿＿＿＿＿＿＿＿</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t-2 border-dashed border-gray-400 pt-4">
                      <div className="bg-gray-100 px-3 py-1.5 font-bold text-xs text-gray-800 border border-gray-800 rounded-t-lg">
                        【飼い主様控え】
                      </div>
                      <div className="border-x border-b border-gray-800 rounded-b-lg p-3 space-y-2 text-xs">
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="font-bold text-gray-600">動物病院名:</span>
                          <span className="text-gray-400">＿＿＿＿＿＿＿＿＿＿</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-bold text-gray-600">担当獣医師:</span>
                          <span className="text-gray-400">＿＿＿＿＿＿＿＿＿ ㊞</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* モーダルフッター */}
            <div className="bg-white border-t border-gray-200 px-5 py-4 flex flex-col sm:flex-row gap-3 justify-end items-center shrink-0">
              <button
                onClick={() => setActivePreview(null)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition text-sm order-2 sm:order-1"
              >
                閉じる
              </button>
              <Link
                href={activePreview === 'explanation' ? '/documents/explanation' : '/documents/consent'}
                className="w-full sm:w-auto bg-[#003366] text-white px-6 py-2.5 rounded-full font-bold hover:bg-blue-900 transition flex items-center justify-center text-sm shadow order-1 sm:order-2"
              >
                <span className="mr-1.5">🖨️</span>印刷 / PDF保存ページを開く
              </Link>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-[#E0D8CE] py-6 text-center text-[#888] text-sm font-bold">
        © 2026 <a href="https://amaj-official-portal.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:underline">Animal Mutual Aid Japan (AMAJ)</a>
      </footer>
    </div>
  );
}
