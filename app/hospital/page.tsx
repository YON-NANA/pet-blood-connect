import Link from 'next/link';
import Image from 'next/image';

export default function HospitalLandingPage() {
    return (
        <div className="bg-white min-h-screen font-sans text-gray-800 antialiased">
            <header className="bg-white/80 backdrop-blur-md py-4 px-6 fixed w-full z-50 border-b border-gray-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center group">
                        <Image
                            src="/assets/logo_v2.png"
                            alt="Logo"
                            width={50}
                            height={50}
                            className="h-10 w-auto object-contain transition duration-300"
                        />
                        <span className="ml-3 text-lg font-black tracking-tighter leading-none">
                            <span className="text-life-green">Animal</span>
                            <span className="text-life-red">Blood</span>
                            <span className="text-trust-blue">Connect</span>
                        </span>
                    </Link>
                    <Link href="/hospital/login" className="bg-trust-blue text-white px-6 py-2 rounded-full text-sm font-black hover:bg-blue-600 transition">
                        ログイン
                    </Link>
                </div>
            </header>

            <main>
                {/* ① ファーストビュー */}
                <section className="pt-40 pb-24 bg-gradient-to-b from-blue-50 to-white px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-black text-deep-blue mb-6 leading-tight">
                            医療判断に集中できる<br />
                            供血マッチング
                        </h1>
                        <p className="text-xl md:text-2xl text-trust-blue font-black mb-12">
                            承認済みドナーのみを表示。<br />
                            貴院が最終判断を行います。
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="/hospital/login" className="bg-life-red text-white text-lg font-black px-12 py-5 rounded-full shadow-2xl shadow-red-200 hover:bg-red-600 transition inline-block">
                                管理画面へログイン
                            </Link>
                            <Link href="/hospital/inquiry" className="bg-white text-trust-blue border-2 border-trust-blue text-lg font-black px-12 py-5 rounded-full hover:bg-blue-50 transition inline-block">
                                新規提携のお問い合わせ
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ② 仕組み（簡潔図解） */}
                <section className="py-24 px-6 border-y border-gray-50">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-black text-deep-blue text-center mb-16">当院主導の要請フロー</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {[
                                { title: "患者の探索", desc: "まずは飼い主様が自力で探索" },
                                { title: "病院へ相談", desc: "見つからない場合、貴院へ相談" },
                                { title: "要請発令", desc: "貴院の判断で全ドナーへ通知" },
                                { title: "最終選択", desc: "承認済み候補から1名を選択" }
                            ].map((item, idx) => (
                                <div key={idx} className="relative flex flex-col items-center text-center">
                                    <div className="w-12 h-12 bg-white border-2 border-trust-blue text-trust-blue rounded-full flex items-center justify-center font-black mb-4 z-10 shadow-sm">
                                        {idx + 1}
                                    </div>
                                    <h3 className="font-black text-deep-blue mb-2">{item.title}</h3>
                                    <p className="text-sm text-gray-500 font-medium">{item.desc}</p>
                                    {idx < 3 && <div className="hidden md:block absolute top-6 left-[60%] w-full h-[2px] bg-blue-100 -z-0"></div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ③ 安心材料 */}
                <section className="py-24 bg-gray-50 px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-[40px] p-10 md:p-16 shadow-xl border border-gray-100">
                            <h2 className="text-3xl font-black text-deep-blue mb-10 text-center">病院様が安心して利用できる理由</h2>
                            <ul className="space-y-6">
                                {[
                                    "医療判断には一切関与しません",
                                    "優先順位は地理的距離のみ（公平性）",
                                    "協賛企業は非介入",
                                    "チャットログはすべて保存・記録",
                                    "個人情報はマッチングまで最小限表示"
                                ].map((text, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <span className="text-trust-blue mr-4 text-xl">✓</span>
                                        <span className="font-bold text-gray-700">{text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* ④ 実際の操作フロー */}
                <section className="py-24 px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-black text-deep-blue text-center mb-16">導入から運用まで</h2>
                        <div className="space-y-4">
                            {[
                                { step: "登録", desc: "専用フォームから病院情報を送信" },
                                { step: "承認", desc: "JARA事務局による管理承認" },
                                { step: "発令", desc: "管理画面の要請ボタンで全体へ通知" },
                                { step: "選択", desc: "候補者から1名を選択しチャット開始" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                    <div className="bg-trust-blue text-white font-black px-4 py-1 rounded-lg text-xs mr-6">
                                        {item.step}
                                    </div>
                                    <div className="font-bold text-gray-800">{item.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* 病院入口ページ下部固定文 */}
            <div className="bg-deep-blue text-white py-12 px-6">
                <div className="max-w-4xl mx-auto text-center border-t border-white/10 pt-8">
                    <p className="text-lg md:text-xl font-black leading-relaxed">
                        本サービスは医療判断を行いません。<br className="hidden md:block" />
                        供血可否の最終判断は貴院に帰属します。
                    </p>
                </div>
            </div>

            <footer className="bg-deep-blue/95 text-white/40 py-8 px-6 text-center text-[10px] font-black uppercase tracking-widest border-t border-white/5">
                © 2026 Japan Animal Rescue Agency (JARA)
            </footer>
        </div>
    );
}
