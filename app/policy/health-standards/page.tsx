import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: "供血ドナー健康基準 | AnimalBloodConnect",
};

export default function HealthStandards() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C3E50] font-sans leading-relaxed">
      <header className="bg-[#003366] py-5 px-8 flex items-center gap-4 border-b-4 border-life-red">
        <Link href="/" className="text-white font-bold text-lg tracking-widest hover:text-red-200 transition">
          🐾 AnimalBloodConnect
        </Link>
        <span className="text-[#A8C8E8] text-sm ml-auto font-medium">Animal Mutual Aid Japan (AMAJ)</span>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-black text-[#003366] mb-4">供血ドナー健康基準</h1>
          <p className="text-gray-500 font-bold">Health & Safety Standards for Blood Donors</p>
        </div>

        <div className="bg-white rounded-[32px] shadow-sm p-8 md:p-12 mb-10 border border-gray-100">
          <h2 className="text-xl font-black text-deep-blue mb-6 border-b border-gray-100 pb-4 flex items-center">
            <span className="text-2xl mr-3">📋</span>基本条件
          </h2>
          <ul className="space-y-4 text-gray-700 font-medium">
            <li className="flex items-start">
              <span className="text-life-green mr-3">✔</span>
              <div>
                <strong>体重・年齢:</strong><br/>
                <span className="block mt-1 mb-1">
                  <strong className="text-trust-blue">犬：</strong>体重 <strong>15kg以上</strong>、年齢 <strong>1歳〜8歳</strong>
                </span>
                <span className="block mb-1">
                  <strong className="text-trust-blue">猫：</strong>体重 <strong>4kg以上</strong>、年齢 <strong>1歳〜7歳</strong>
                </span>
                <span className="block text-sm text-gray-500 mt-2">
                  ※ 登録日の年齢から経過日数で計算し、犬は9歳、猫は8歳に達した時点で自動的にドナー終了となります。終了時に感謝メッセージが表示されます。
                </span>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-life-green mr-3">✔</span>
              <div>
                <strong>ワクチン接種:</strong><br/>
                過去1年以内に混合ワクチンの接種を済ませていること（あるいは適切な抗体価があること）。犬の場合は狂犬病予防接種を毎年受けていること。
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-life-green mr-3">✔</span>
              <div>
                <strong>フィラリア・ノミ・マダニ予防:</strong><br/>
                毎年適切に予防薬を投与されていること。
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-life-green mr-3">✔</span>
              <div>
                <strong>輸血歴がないこと:</strong><br/>
                過去に他の動物から輸血を受けたことがないこと。
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-[32px] shadow-sm p-8 md:p-12 mb-10 border border-gray-100">
          <h2 className="text-xl font-black text-life-red mb-6 border-b border-gray-100 pb-4 flex items-center">
            <span className="text-2xl mr-3">⚠️</span>地域別注意事項（感染症リスク）
          </h2>
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-2">🦠 バベシア症（Babesia）について</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              西日本を中心に発生がみられるマダニ媒介性の感染症です。流行地域でマダニに咬まれたことがある（またはマダニが多く見られる環境によく行く）場合は、供血前に必ず担当獣医師にお知らせください。
            </p>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-2">🦠 SFTS（重症熱性血小板減少症候群）について</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              西日本を中心に報告されているダニ媒介性のウイルス感染症です。SFTS流行地域にお住まい、または訪問歴があり、ダニ暴露歴や原因不明の体調不良（発熱、消化器症状など）があった場合は、感染リスクを考慮する必要があります。直近で体調不良があった場合は供血を控えてください。
            </p>
          </div>
        </div>

        {/* 猫の感染症ポリシー */}
        <div className="bg-white rounded-[32px] shadow-sm p-8 md:p-12 mb-10 border border-purple-100">
          <h2 className="text-xl font-black text-purple-800 mb-6 border-b border-purple-100 pb-4 flex items-center">
            <span className="text-2xl mr-3">🐱</span>猫の感染症ポリシー
          </h2>
          <p className="text-gray-500 text-sm font-medium mb-6 leading-relaxed">
            猫の輸血においては、以下の感染症リスクの管理が特に重要です。ドナー登録時に検査状況をご申告いただき、担当獣医師が安全性を確認します。
          </p>
          <div className="space-y-6">
            <div className="flex items-start">
              <span className="text-purple-400 mr-3 mt-0.5">🦠</span>
              <div>
                <strong className="text-gray-800">猫エイズ（FIV：猫免疫不全ウイルス）</strong>
                <p className="text-gray-600 text-sm leading-relaxed mt-1">
                  FIVは血液・唾液を介して感染する免疫抑制ウイルスです。ドナー登録時に「陰性 / 未検査 / 不明」からご選択ください。<br />
                  <span className="text-purple-700 font-bold">陰性（検査済み）のドナーが最も推奨されます。</span>未検査・不明の場合、供血前に担当病院での検査が必要になる場合があります。
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-purple-400 mr-3 mt-0.5">🦠</span>
              <div>
                <strong className="text-gray-800">猫白血病（FeLV：猫白血病ウイルス）</strong>
                <p className="text-gray-600 text-sm leading-relaxed mt-1">
                  FeLVは免疫抑制・白血病・貧血等を引き起こす感染症です。ドナー登録時に「陰性 / 未検査 / 不明」からご選択ください。<br />
                  <span className="text-purple-700 font-bold">陰性（検査済み）のドナーが最も推奨されます。</span>陽性ドナーからの供血は原則として行いません。
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-purple-400 mr-3 mt-0.5">🦠</span>
              <div>
                <strong className="text-gray-800">その他感染症（ヘモプラズマ・猫伝染性腹膜炎など）</strong>
                <p className="text-gray-600 text-sm leading-relaxed mt-1">
                  ヘモプラズマ（溶血性貧血の原因となるマイコプラズマ属菌）をはじめ、その他の感染症についても輸血時のリスク要因となります。ドナー登録時に「検査済み / 未検査」からご選択ください。<br />
                  <span className="text-purple-700 font-bold">未検査の場合は、供血前に担当病院でのスクリーニング検査が実施される場合があります。</span>
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 bg-purple-50 rounded-2xl p-4 text-xs text-purple-800 font-bold leading-relaxed">
            ※ 感染症検査の結果が不明・未検査であっても、直ちにドナー登録が却下されるわけではありません。担当獣医師が当日の状態と合わせて総合的に判断します。
          </div>
        </div>

        <div className="bg-red-50 border-l-4 border-life-red rounded-r-3xl p-8 mb-10">
          <h2 className="text-lg font-black text-red-800 mb-3 flex items-center">
            <span className="text-2xl mr-2">🚨</span>供血当日の体調不良について
          </h2>
          <p className="text-red-900 font-bold leading-relaxed">
            ドナー動物の安全が第一です。「いつもより元気がない」「食欲がない」「下痢・嘔吐がある」など、供血当日に少しでも体調不良が見られる場合は、決して無理をせず供血をお断り（またはキャンセル）してください。動物病院の獣医師の判断により、当日に供血を見合わせる場合もありますのであらかじめご了承ください。
          </p>
        </div>

        <div className="text-center mt-12">
          <Link href="/" className="inline-block bg-[#003366] text-white px-8 py-4 rounded-full font-bold hover:bg-blue-900 transition shadow-lg">
            トップページへ戻る
          </Link>
        </div>
      </main>

      <footer className="bg-[#E0D8CE] py-6 text-center text-[#888] text-sm font-bold">
        © 2026 Animal Mutual Aid Japan (AMAJ)
      </footer>
    </div>
  );
}
