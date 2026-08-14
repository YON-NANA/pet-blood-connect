"use client";

import { useState, useEffect } from "react";
import { Download, X, Share, MoreVertical } from "lucide-react";

export default function PwaInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // サービスワーカーの登録
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error);
    }

    // OS & Standalone 判定
    const ios =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIos(ios);

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true;
    setIsStandalone(standalone);

    // layout.tsx でプロンプトが取れていれば保持
    if ((window as any).__pwaPrompt) {
      setDeferredPrompt((window as any).__pwaPrompt);
    }

    const onPromptReady = () => {
      const p = (window as any).__pwaPrompt;
      if (p) setDeferredPrompt(p);
    };
    window.addEventListener("pwa-prompt-ready", onPromptReady);

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      (window as any).__pwaPrompt = e;
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    return () => {
      window.removeEventListener("pwa-prompt-ready", onPromptReady);
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
    };
  }, []);

  // すでにアプリ（スタンドアロンモード）として起動している場合はボタンを出さない
  if (isStandalone) return null;

  const handleInstallClick = async () => {
    const promptEvent = deferredPrompt || (window as any).deferredPrompt || (window as any).__pwaPrompt;
    if (promptEvent) {
      try {
        await promptEvent.prompt();
        const { outcome } = await promptEvent.userChoice;
        if (outcome === "accepted") {
          setDeferredPrompt(null);
          (window as any).__pwaPrompt = null;
          (window as any).deferredPrompt = null;
          return;
        }
      } catch (err) {
        console.error("Install prompt error:", err);
      }
    }
    // プロンプトが使えない環境（iOS Safari / 各種インアプリブラウザ等）はモーダルガイドを表示
    setShowModal(true);
  };

  return (
    <>
      {/* 画面右下のフローティングボタン */}
      <button
        id="pwa-install-btn"
        onClick={handleInstallClick}
        className="fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 bg-trust-blue hover:bg-blue-600 text-white px-5 py-3.5 rounded-full shadow-2xl transition-all transform hover:scale-105 active:scale-95 font-bold border border-white/20"
      >
        <Download className="w-5 h-5 animate-bounce" />
        <span className="text-sm">アプリをインストール</span>
      </button>

      {/* インストール手順ガイドモーダル */}
      {showModal && (
        <div className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl relative space-y-6 text-gray-800">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto text-trust-blue mb-2">
                <Download className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-deep-blue">
                ホーム画面に追加
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                スマートフォンにアイコンを配置して、アプリとしてすぐに移動できます。
              </p>
            </div>

            {isIos ? (
              /* iOSの手順 */
              <div className="bg-gray-50 rounded-2xl p-4 space-y-4 border border-gray-100 text-sm">
                <div className="flex items-start gap-3">
                  <span className="bg-trust-blue text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <p className="font-bold text-gray-800">
                      画面下の <Share className="w-4 h-4 inline text-blue-600 mx-1" /> 「共有」アイコンをタップ
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Safariブラウザの最下部にあるメニューバーにあります。
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-trust-blue text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <p className="font-bold text-gray-800">
                      「ホーム画面に追加」をタップ
                    </p>
                    <p className="text-[11px] text-gray-500">
                      メニューを下にスクロールすると見つかります。
                    </p>
                  </div>
                </div>
                <div className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200/60 font-medium">
                  ⚠️ LINEやYahooなどのアプリ内ブラウザで開いている場合は、右上の「⋮」メニューから「Safariで開く」を選択してから追加してください。
                </div>
              </div>
            ) : (
              /* Android / その他ブラウザの手順 */
              <div className="bg-gray-50 rounded-2xl p-4 space-y-4 border border-gray-100 text-sm">
                <div className="flex items-start gap-3">
                  <span className="bg-trust-blue text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <p className="font-bold text-gray-800">
                      右上メニュー <MoreVertical className="w-4 h-4 inline text-gray-700 mx-1" /> をタップ
                    </p>
                    <p className="text-[11px] text-gray-500">
                      ブラウザ右上の3つの点アイコンを押します。
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-trust-blue text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <p className="font-bold text-gray-800">
                      「アプリをインストール」または「ホーム画面に追加」を選択
                    </p>
                  </div>
                </div>
                <div className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200/60 font-medium">
                  ⚠️ LINEやX(Twitter)などのアプリ内ブラウザで開いている場合は、右上のメニューから「Chromeで開く」または「デフォルトのブラウザで開く」を選択してから追加してください。
                </div>
              </div>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-trust-blue text-white py-3.5 rounded-full font-black text-sm shadow-lg hover:bg-blue-600 transition"
            >
              とじる
            </button>
          </div>
        </div>
      )}
    </>
  );
}

