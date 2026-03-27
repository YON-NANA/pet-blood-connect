"use client";

import React from 'react';
import Link from 'next/link';

export default function ConsentDocument() {
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
        
        <div className="text-right mb-6 text-sm">
          <p>作成日：令和　　年　　月　　日</p>
        </div>

        <div className="border-b-2 border-gray-800 pb-4 mb-10 text-center">
          <h1 className="text-3xl font-black mb-2 tracking-widest">供血（献血）に関する同意書</h1>
        </div>

        <div className="space-y-6 text-base leading-loose mb-12">
          <p>
            　私は、担当獣医師から別紙「供血（献血）のお願いとご説明」の内容に基づき、私の飼育する動物の供血（献血）の意義、その際に実施される身体検査・血液検査、必要に応じた鎮静処置、採血（供血）の流れについて十分な説明を受けました。
          </p>
          <p>
            　また、供血に伴う手技、合併症や万が一のリスク（皮下出血や一時的な体調不良、鎮静・麻酔のリスク等）についても理解し、納得いたしました。
          </p>
          <p>
            　さらに、本供血が完全なボランティア（無償の善意）として実施されるものであり、輸血を受ける側への謝礼・交通費等の金銭の要求が禁じられていること、ならびに今回の適合検査および供血処置にかかる医療費を私は負担しないことについても承諾いたします。
          </p>
          <p>
            　以上の説明を受け、内容を十分に理解したうえで、私の飼育する動物を供血ドナーとして協力することに同意します。
          </p>
        </div>

        {/* 署名欄 */}
        <div className="mt-16 space-y-12">
          {/* 病院控え部分 */}
          <div>
            <div className="flex justify-between items-end mb-4">
              <span className="inline-block w-40 text-lg">【病院保管用】</span>
            </div>
            
            <table className="w-full border-collapse border border-gray-800">
              <tbody>
                <tr>
                  <td className="border border-gray-800 p-4 w-1/4 bg-gray-50 text-center font-bold">飼い主様 ご氏名</td>
                  <td className="border border-gray-800 p-4 w-1/4">
                    <div className="flex justify-end pr-2"><span className="text-sm">㊞</span></div>
                  </td>
                  <td className="border border-gray-800 p-4 w-1/4 bg-gray-50 text-center font-bold">ご住所</td>
                  <td className="border border-gray-800 p-4 w-1/4"></td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-4 bg-gray-50 text-center font-bold">動物のお名前（ペット名）</td>
                  <td className="border border-gray-800 p-4"></td>
                  <td className="border border-gray-800 p-4 bg-gray-50 text-center font-bold">動物の品種 / 年齢</td>
                  <td className="border border-gray-800 p-4"></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border-t-2 border-dashed border-gray-400 my-8"></div>

          {/* 飼い主控え部分 */}
          <div>
            <div className="flex justify-between items-end mb-4">
              <span className="inline-block w-40 text-lg">【飼い主様控え】</span>
            </div>
            <table className="w-full border-collapse border border-gray-800">
              <tbody>
                <tr>
                  <td className="border border-gray-800 p-4 w-1/4 bg-gray-50 text-center font-bold">動物病院名</td>
                  <td className="border border-gray-800 p-4 w-3/4" colSpan={3}></td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-4 bg-gray-50 text-center font-bold">担当獣医師</td>
                  <td className="border border-gray-800 p-4" colSpan={3}>
                    <div className="flex justify-end pr-2"><span className="text-sm">㊞</span></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
