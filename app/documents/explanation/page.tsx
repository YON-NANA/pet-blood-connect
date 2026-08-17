"use client";

import React from 'react';
import Link from 'next/link';

export default function ExplanationDocument() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-gray-100 min-h-screen text-gray-800 font-sans print:bg-white print:min-h-0">
      {/* 画面用ヘッダー（印刷時は非表示） */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center print:hidden shadow-sm sticky top-0 z-10">
        <Link href="/documents" className="text-gray-500 hover:text-[#003366] font-bold flex items-center transition">
          <span className="mr-2">←</span> 書類一覧に戻る
        </Link>
        <button 
          onClick={handlePrint}
          className="bg-[#003366] text-white px-6 py-2 rounded-full font-bold hover:bg-blue-900 transition flex items-center shadow-md text-sm"
        >
          <span className="mr-2">🖨️</span> 印刷 / PDF保存
        </button>
      </div>

      {/* 印刷用CSS定義 */}
      <style jsx global>{`
        @page {
          size: A4 portrait;
          margin: 12mm 15mm;
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            background-color: white !important;
          }
          .a4-container {
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
          }
        }
      `}</style>

      {/* 書類本体（A4用紙1枚にぴったり収まる設計） */}
      <div className="a4-container max-w-[210mm] mx-auto bg-white p-8 md:p-12 my-6 md:my-8 shadow-lg print:shadow-none print:m-0 print:p-0">
        
        {/* ヘッダー */}
        <div className="border-b-2 border-gray-800 pb-2.5 mb-5 print:mb-3.5 text-center">
          <h1 className="text-xl md:text-2xl print:text-xl font-black mb-1 tracking-widest text-gray-900">
            供血（献血）のお願いとご説明
          </h1>
          <p className="text-xs text-gray-500 font-medium">飼い主様向け事前確認書類（標準書式）</p>
        </div>

        {/* 本文エリア */}
        <div className="space-y-4 print:space-y-2.5 text-xs sm:text-sm print:text-[11.5px] leading-relaxed print:leading-snug text-gray-800">
          
          <section className="break-inside-avoid">
            <h2 className="text-sm md:text-base print:text-[13px] font-bold border-l-4 border-[#003366] pl-2.5 mb-1.5 text-gray-900">
              1. 供血の意義と目的
            </h2>
            <p className="text-gray-700 pl-1">
              この度は、輸血を必要とする動物のために供血（献血）へのご協力を検討いただき、誠にありがとうございます。動物医療においては大規模な血液備蓄システムが存在せず、緊急時にはボランティアであるドナー動物の血液が唯一の頼りとなります。皆様の温かいご支援が、かけがえのない命を救う大きな力となります。
            </p>
          </section>

          <section className="break-inside-avoid">
            <h2 className="text-sm md:text-base print:text-[13px] font-bold border-l-4 border-[#003366] pl-2.5 mb-1.5 text-gray-900">
              2. 供血の基本的な流れ
            </h2>
            <ol className="list-decimal pl-5 space-y-0.5 text-gray-700">
              <li><strong>身体検査・血液検査：</strong> ドナー動物の健康状態と血液型（または交差適合）を確認します。</li>
              <li><strong>鎮静処置（必要な場合）：</strong> 動物の安全とストレス軽減のため、必要に応じて軽い鎮静剤を使用します。</li>
              <li><strong>採血（供血）：</strong> 首の静脈（頸静脈）等から、体重に応じた安全な量の血液を採取します（通常15〜30分）。</li>
              <li><strong>止血と経過観察：</strong> 採血後、止血処置を行い、院内で異常がないか一定時間観察した後にご帰宅となります。</li>
            </ol>
          </section>

          <section className="break-inside-avoid">
            <h2 className="text-sm md:text-base print:text-[13px] font-bold border-l-4 border-[#003366] pl-2.5 mb-1.5 text-gray-900">
              3. 伴うリスク・合併症について
            </h2>
            <p className="mb-1 text-gray-700 pl-1">当院ではドナーの安全を最優先に処置を行いますが、以下のリスクが生じる可能性があります。</p>
            <ul className="list-disc pl-5 space-y-0.5 text-gray-700">
              <li><strong>採血部位の異常：</strong> 皮下出血、腫れ、軽度の痛みが起こる場合がありますが、通常は数日で自然回復します。</li>
              <li><strong>一過性の体調不良：</strong> 採血による血圧低下、貧血、ふらつき、元気・食欲の低下が一時的に起こる場合があります。</li>
              <li><strong>鎮静・麻酔のリスク：</strong> 鎮静剤を使用した場合、ごく稀に特異体質等による予期せぬアレルギー反応のリスクがあります。</li>
            </ul>
          </section>

          <section className="break-inside-avoid">
            <h2 className="text-sm md:text-base print:text-[13px] font-bold border-l-4 border-[#003366] pl-2.5 mb-1.5 text-gray-900">
              4. 費用負担・金銭の取り扱い
            </h2>
            <p className="text-gray-700 pl-1">
              本供血は「完全なボランティア（無償の善意）」です。<strong>ドナー飼い主様から輸血を受ける側への謝礼・交通費等の金銭要求は固く禁じられています。</strong>なお、今回の適合検査および供血処置にかかる医療費はドナー飼い主様のご負担にはなりません。
            </p>
          </section>

          <section className="break-inside-avoid">
            <h2 className="text-sm md:text-base print:text-[13px] font-bold border-l-4 border-[#003366] pl-2.5 mb-1.5 text-gray-900">
              5. 帰宅後の過ごし方とご注意
            </h2>
            <ul className="list-disc pl-5 space-y-0.5 text-gray-700">
              <li>当日は激しい運動やシャンプーを避け、安静に過ごさせてください。</li>
              <li>採血により水分が失われているため、新鮮な水をいつでも十分に飲めるようにしてください。</li>
              <li>万一、帰宅後に「ひどいふらつき」「嘔吐」「ぐったりしている」等の異常が見られた場合は速やかに当院へご連絡ください。</li>
            </ul>
          </section>
        </div>

        {/* 署名欄（1ページ目の下部にすっきり配置） */}
        <div className="mt-6 print:mt-4 pt-3.5 print:pt-2.5 border-t border-gray-300 break-inside-avoid">
          <div className="flex justify-between items-end">
            <div className="text-[10px] text-gray-400">
              🐾 AnimalBloodConnect - Animal Mutual Aid Japan (AMAJ)
            </div>
            <div className="w-64 sm:w-72">
              <p className="mb-2 text-xs font-bold text-gray-700">【説明担当・動物病院】</p>
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-gray-600">動物病院名：</span>
                <span className="border-b border-gray-400 pb-0.5 inline-block w-44"></span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">担当獣医師：</span>
                <div className="flex items-center">
                  <span className="border-b border-gray-400 pb-0.5 inline-block w-36"></span>
                  <span className="text-xs ml-1 text-gray-500">㊞</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
