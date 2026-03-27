"use client";

import React from 'react';
import Link from 'next/link';

export default function ExplanationDocument() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-gray-100 min-h-screen text-gray-800 font-sans print:bg-white">
      {/* 画面用ヘッダー（印刷時は非表示） */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center print:hidden shadow-sm sticky top-0 z-10">
        <Link href="/documents" className="text-gray-500 hover:text-deep-blue font-bold flex items-center">
          <span className="mr-2">←</span> 戻る
        </Link>
        <button 
          onClick={handlePrint}
          className="bg-deep-blue text-white px-6 py-2 rounded-full font-bold hover:bg-trust-blue transition flex items-center shadow-md"
        >
          <span className="mr-2">🖨️</span> 印刷 / PDF保存
        </button>
      </div>

      {/* 書類本体（A4サイズ風） */}
      <div className="max-w-[210mm] mx-auto bg-white p-10 md:p-[20mm] my-8 shadow-lg print:shadow-none print:m-0 print:p-0">
        <div className="border-b-2 border-gray-800 pb-4 mb-8 text-center">
          <h1 className="text-2xl font-black mb-2 tracking-widest">供血（献血）のお願いとご説明</h1>
          <p className="text-sm text-gray-600">飼い主様向け事前確認書類</p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold border-l-4 border-gray-800 pl-3 mb-3">1. 供血の意義と目的</h2>
            <p>
              この度は、輸血を必要とする動物のために供血（献血）へのご協力を検討いただき、誠にありがとうございます。
              動物医療においては、人間の献血のような大規模な血液備蓄システムが存在せず、緊急時にはボランティアであるドナー動物の血液が唯一の頼りとなります。
              皆様の温かいご支援が、かけがえのない命を救う大きな力となります。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold border-l-4 border-gray-800 pl-3 mb-3">2. 供血の基本的な流れ</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li><strong>身体検査・血液検査：</strong> 供血が可能かどうか、ドナー動物の健康状態と血液型（または交差適合）を確認します。</li>
              <li><strong>鎮静処置（必要な場合）：</strong> 動物の安全とストレス軽減のため、必要に応じて軽い鎮静剤を使用することがあります。</li>
              <li><strong>採血（供血）：</strong> 首の静脈（頸静脈）などから、体重に応じた安全な量の血液を採取します。（通常15〜30分程度）</li>
              <li><strong>止血と経過観察：</strong> 採血後、止血処置を行い、院内で体調に異常がないか一定時間観察します。問題がなければご帰宅となります。</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-bold border-l-4 border-gray-800 pl-3 mb-3">3. 伴うリスク・合併症について</h2>
            <p className="mb-2">当院ではドナー動物の安全を第一に処置を行いますが、以下のようなリスクが生じる可能性があります。</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>採血部位の異常：</strong> 皮下出血、腫れ、軽度の痛みが生じることがありますが、通常は数日で自然に回復します。</li>
              <li><strong>一過性の体調不良：</strong> 採血による血圧低下、貧血、ふらつき、元気・食欲の低下が一時的に起こる場合があります。</li>
              <li><strong>鎮静・麻酔のリスク：</strong> 鎮静剤を使用した場合、ごく稀に特異体質などにより予期せぬアレルギー反応や呼吸循環器系の異常が起こるリスクがあります。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold border-l-4 border-gray-800 pl-3 mb-3">4. 費用負担・金銭の取り扱い</h2>
            <p>
              本供血は「完全なボランティア（無償の善意）」としてご協力いただくものです。
              <strong>ドナー飼い主様から輸血を受ける側への謝礼・交通費等の金銭の要求は固く禁じられております。</strong>
              なお、今回の適合検査および供血処置にかかる医療費につきましては、ドナー飼い主様にご負担いただくことはありません。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold border-l-4 border-gray-800 pl-3 mb-3">5. 帰宅後の過ごし方とご注意</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>当日は激しい運動やシャンプーを避け、安静に過ごさせてください。</li>
              <li>採血により水分が失われているため、新鮮な水をいつでも飲めるようにしてください。</li>
              <li>万一、帰宅後に「ひどいふらつき」「嘔吐」「ぐったりしている」などの異常が見られた場合は、速やかに当院までご連絡ください。</li>
            </ul>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-300">
          <div className="flex justify-end">
            <div className="w-1/2">
              <p className="mb-4 text-sm">【説明担当・動物病院】</p>
              <div className="mb-4">
                <span className="inline-block w-24 text-sm">動物病院名：</span>
                <span className="border-b border-gray-400 pb-1 px-4 inline-block w-64"></span>
              </div>
              <div>
                <span className="inline-block w-24 text-sm">担当獣医師：</span>
                <span className="border-b border-gray-400 pb-1 px-4 inline-block w-64"></span>
                <span className="text-sm ml-2">㊞</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
