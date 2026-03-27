import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: "必要書類一覧・規定 | AnimalBloodConnect",
};

export default function Documents() {
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

      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-black text-[#003366] mb-4 tracking-tight">必要書類一覧・規定</h1>
          <p className="text-gray-500 font-bold">Documents & Policies</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Card 1 */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 hover:shadow-xl transition flex flex-col justify-between">
            <div>
              <div className="text-4xl mb-4">📄</div>
              <h2 className="text-2xl font-black text-deep-blue mb-2">飼い主向け供血説明文</h2>
              <p className="text-sm text-gray-600 mb-6 font-medium leading-relaxed">
                供血の意義、流れ、そして伴うリスクや、当日の過ごし方について動物病院から飼い主様へご説明する際の標準的な内容をまとめています。
              </p>
            </div>
            <Link href="/documents/explanation" className="w-full bg-[#E0D8CE] text-[#003366] font-black py-4 rounded-full flex justify-center items-center hover:bg-[#d4c8ba] transition shadow-md">
              <span className="mr-2">📄</span>書面を表示 / 印刷する
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 hover:shadow-xl transition flex flex-col justify-between">
            <div>
              <div className="text-4xl mb-4">✍️</div>
              <h2 className="text-2xl font-black text-deep-blue mb-2">供血同意書フォーマット</h2>
              <p className="text-sm text-gray-600 mb-6 font-medium leading-relaxed">
                動物病院での供血処置前に、獣医師とドナー飼い主様の間で取り交わしていただく同意書のテンプレートです。
              </p>
            </div>
            <Link href="/documents/consent" className="w-full bg-[#E0D8CE] text-[#003366] font-black py-4 rounded-full flex justify-center items-center hover:bg-[#d4c8ba] transition shadow-md">
              <span className="mr-2">✍️</span>書面を表示 / 印刷する
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-[32px] shadow-sm p-8 md:p-12 mb-10 border border-gray-100">
          <h2 className="text-xl font-black text-life-red mb-6 border-b border-gray-100 pb-4 flex items-center">
            <span className="text-2xl mr-3">💰</span>費用負担・金銭授受の禁止規定
          </h2>
          <div className="text-gray-700 space-y-4 font-medium leading-relaxed">
            <p>
              本プラットフォーム（AnimalBloodConnect）を通じた供血は、<strong>完全なボランティアベース（無償の善意）</strong>で行われます。
            </p>
            <p className="font-bold text-[#003366]">
              【飼い主様間の金銭授受の禁止】
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>ドナー側からレシピエント（輸血を受ける側）への謝礼の要求は固く禁じております。</li>
              <li>交通費やその他名目での金銭のやり取りもできません。</li>
            </ul>
            <p className="font-bold text-[#003366] mt-6">
              【医療費の取り扱い】
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>ドナーの血液検査費用や処置費用は、基本的には<strong>要請を行った動物病院、またはレシピエント側</strong>で負担することが一般的です（詳細は各動物病院と事前に取り決めます）。</li>
              <li>ドナー飼い主様に、供血に対する医療費の負担が発生することはありません。</li>
            </ul>
          </div>
        </div>

        <div className="bg-red-50 border-l-4 border-life-red rounded-r-3xl p-8 mb-10">
          <h2 className="text-lg font-black text-red-800 mb-4 flex items-center">
            <span className="text-2xl mr-2">🚨</span>事故時対応フロー（万が一の場合）
          </h2>
          <p className="text-red-900 font-bold leading-relaxed mb-4">
            動物病院は細心の注意を払って供血処置を行いますが、動物の体調急変などの事故が発生した場合の責任分界や対応については以下の通りです。
          </p>
          <ul className="list-inside list-decimal text-red-800 space-y-3 font-medium text-sm">
            <li><strong>応急処置の義務:</strong> 当該動物病院はドナー動物に対して最善の救命・応急処置を無償にて行う義務を負います。</li>
            <li><strong>賠償責任の範囲:</strong> 獣医療上の過失が認められた場合は、動物病院が加入する獣医師賠償責任保険等の範囲で対応が行われます。</li>
            <li><strong>免責事項:</strong> 事前に予見不可能な特異体質や、事前の問診で申告されなかった既往症に起因する事故については、病院側の責任は制限される場合があります。</li>
          </ul>
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
