import Link from 'next/link';
import Image from 'next/image';

export default function TermsPage() {
    return (
        <div className="bg-[#FAFAFA] min-h-screen font-sans text-gray-800 antialiased">
            <header className="bg-white border-b border-gray-100 py-4 px-6 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
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
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-20">
                <div className="bg-white rounded-[40px] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-16">
                    <h1 className="text-3xl font-black text-deep-blue mb-4 tracking-tight text-center">供血ネット利用規約（厳格版・草案）</h1>
                    <p className="text-gray-400 text-sm text-center mb-12 font-bold">最終更新日: 2026年2月22日</p>

                    <div className="space-y-12 text-[15px] leading-relaxed text-gray-700">
                        <section>
                            <h2 className="text-xl font-black text-deep-blue mb-4 border-l-4 border-life-red pl-4">第1条（目的）</h2>
                            <p>
                                本規約は、供血マッチングシステム（以下「本サービス」）の利用条件を定め、動物医療における供血の円滑かつ安全な実施を目的とするものです。<br />
                                本サービスは、供血を必要とする医療機関とドナー登録者を接続するマッチング機能のみを提供します。
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-deep-blue mb-4 border-l-4 border-life-red pl-4">第2条（医療行為への非関与）</h2>
                            <p>
                                本サービスは、医療行為を行いません。<br />
                                採血の可否、適合判断、治療内容、輸血の実施、予後その他一切の医療判断は、医療機関の責任において行われます。運営者は医療上の結果について責任を負いません。
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-deep-blue mb-4 border-l-4 border-life-red pl-4">第3条（ドナー提供の性質）</h2>
                            <p>
                                ドナー登録者による供血は任意の協力行為であり、強制されるものではありません。<br />
                                供血の実施は、ドナー登録者と医療機関との合意に基づき行われます。運営者は供血実施の保証を行いません。
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-deep-blue mb-4 border-l-4 border-life-red pl-4">第4条（要請発令）</h2>
                            <p>
                                供血要請は、医療機関の判断により発令されます。<br />
                                本サービスは、要請発令の妥当性判断を行いません。
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-deep-blue mb-4 border-l-4 border-life-red pl-4">第5条（承認およびキャンセル）</h2>
                            <p>
                                ドナー登録者は、供血要請に対して承認を行う場合、実際に対応可能であることを確認の上で行うものとします。<br />
                                承認後のキャンセルには理由入力を必須とします。無断キャンセルまたは虚偽理由が一定回数に達した場合、システムにより自動的に利用制限が行われます。
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-deep-blue mb-4 border-l-4 border-life-red pl-4">第6条（責任の帰属）</h2>
                            <p>
                                供血に関連するトラブル、損害、紛争は、当事者間において解決されるものとします。<br />
                                運営者は、当事者間の紛争に関与しません。
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-deep-blue mb-4 border-l-4 border-life-red pl-4">第7条（情報の取り扱い）</h2>
                            <p>
                                登録情報は、本サービスの運営目的の範囲内で利用されます。<br />
                                患者情報および案件情報は原則として外部公開されません。
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-deep-blue mb-4 border-l-4 border-life-red pl-4">第8条（外部公開の禁止）</h2>
                            <p>
                                利用者は、患者、医療機関、供血案件を特定可能な情報をSNSその他外部媒体へ公開してはなりません。
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-deep-blue mb-4 border-l-4 border-life-red pl-4">第9条（協賛企業の非関与）</h2>
                            <p>
                                協賛企業は、供血要請の発令、ドナー選定、優先順位決定、医療判断に一切関与しません。
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-deep-blue mb-4 border-l-4 border-life-red pl-4">第10条（免責）</h2>
                            <p>
                                本サービスはマッチング機能のみを提供するものであり、供血の実施結果、治療結果その他生じた損害について責任を負いません。
                            </p>
                        </section>
                    </div>

                    <div className="mt-20 pt-12 border-t border-gray-50 text-center">
                        <Link href="/" className="text-trust-blue font-black hover:underline">
                            トップページへ戻る
                        </Link>
                    </div>
                </div>
            </main>

            <footer className="bg-deep-blue py-12 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">
                        © 2026 Japan Animal Rescue Agency (JARA)
                    </p>
                </div>
            </footer>
        </div>
    );
}
