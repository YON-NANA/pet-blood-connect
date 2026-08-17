"use client";

import React from 'react';
import Link from 'next/link';

export default function ConsentDocument() {
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

      {/* 書類本体（A4サイズ風・1枚完結設計） */}
      <div className="a4-container max-w-[210mm] mx-auto bg-white p-8 md:p-12 my-6 md:my-8 shadow-lg print:shadow-none print:m-0 print:p-0">
        
        <div className="text-right mb-4 print:mb-2 text-xs text-gray-600">
          <p>作成日：令和　　年　　月　　日</p>
        </div>

        <div className="border-b-2 border-gray-800 pb-2.5 mb-6 print:mb-4 text-center">
          <h1 className="text-xl md:text-2xl print:text-xl font-black mb-1 tracking-widest text-gray-900">
            供血（献血）に関する同意書
          </h1>
        </div>

        <div className="space-y-3.5 print:space-y-2 text-xs sm:text-sm print:text-[11.5px] leading-relaxed print:leading-snug text-gray-800 mb-8 print:mb-5">
          <p>
            　私は、担当獣医師から別紙「供血（献血）のお願いとご説明」の内容に基づき、私の飼育する動物の供血（献血）の意義、その際に実施される身体検査・血液検査、必要に応じた鎮静処置、採血（供血）の流れについて十分な説明を受けました。
          </p>
          <p>
            　また、供血に伴う手技、合併症や万が一のリスク（皮下出血や一時的な体調不良、鎮静・麻酔のリスク等）についても理解し、納得いたしました。
          </p>
          <p>
            　さらに、本供血が完全なボランティア（無償の善意）として実施されるものであり、輸血を受ける側への謝礼・交通費等の金銭の要求が禁じられていること、ならびに今回の適合検査および供血処置にかかる医療費を私は負担しないことについても承諾いたします。
          </p>
          <p className="font-bold text-gray-900">
            　以上の説明を受け、内容を十分に理解したうえで、私の飼育する動物を供血ドナーとして協力することに同意します。
          </p>
        </div>

        {/* 署名欄 */}
        <div className="space-y-6 print:space-y-4">
          {/* 病院保管用部分 */}
          <div className="break-inside-avoid">
            <div className="flex justify-between items-end mb-2">
              <span className="inline-block text-xs md:text-sm font-bold text-gray-800">【病院保管用 署名欄】</span>
            </div>
            
            <table className="w-full border-collapse border border-gray-800 text-xs print:text-[11px]">
              <tbody>
                <tr>
                  <td className="border border-gray-800 p-2.5 w-1/4 bg-gray-50 text-center font-bold">飼い主様 ご氏名</td>
                  <td className="border border-gray-800 p-2.5 w-1/4">
                    <div className="flex justify-end pr-2"><span className="text-xs">㊞</span></div>
                  </td>
                  <td className="border border-gray-800 p-2.5 w-1/4 bg-gray-50 text-center font-bold">ご住所</td>
                  <td className="border border-gray-800 p-2.5 w-1/4"></td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-2.5 bg-gray-50 text-center font-bold">ペットのお名前</td>
                  <td className="border border-gray-800 p-2.5"></td>
                  <td className="border border-gray-800 p-2.5 bg-gray-50 text-center font-bold">品種 / 年齢</td>
                  <td className="border border-gray-800 p-2.5"></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border-t-2 border-dashed border-gray-400 my-4 print:my-3"></div>

          {/* 飼い主控え部分 */}
          <div className="break-inside-avoid">
            <div className="flex justify-between items-end mb-2">
              <span className="inline-block text-xs md:text-sm font-bold text-gray-800">【飼い主様控え】</span>
            </div>
            <table className="w-full border-collapse border border-gray-800 text-xs print:text-[11px]">
              <tbody>
                <tr>
                  <td className="border border-gray-800 p-2.5 w-1/4 bg-gray-50 text-center font-bold">動物病院名</td>
                  <td className="border border-gray-800 p-2.5 w-3/4" colSpan={3}></td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-2.5 bg-gray-50 text-center font-bold">担当獣医師</td>
                  <td className="border border-gray-800 p-2.5" colSpan={3}>
                    <div className="flex justify-end pr-2"><span className="text-xs">㊞</span></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* フッター小文字 */}
        <div className="mt-8 print:mt-4 text-center text-[10px] text-gray-400">
          🐾 AnimalBloodConnect - Animal Mutual Aid Japan (AMAJ)
        </div>

      </div>
    </div>
  );
}
