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
                犬は概ね20kg以上、猫は概ね4kg以上。1歳〜8歳未満の健康な成犬・成猫であることを推奨しています。
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
