"use client";

import { useState, useEffect } from "react";
import { Download } from "lucide-react";

export default function PwaInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // サービスワーカーの登録
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error);
    }

    // iOSデバイスの判定
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    // 既にPWAとして起動しているか（iOSの場合はstandalone、Android等はmatchMedia）
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone === true;

    if (isStandalone) {
      // すでにインストール済みの場合は非表示
      setIsInstallable(false);
      return;
    }

    if (isIos) {
      // iOSの場合はインストールプロンプトが出ないので強制表示（クリック時に手動追加を案内）
      setIsInstallable(true);
    } else {
      // Android / PCの場合: 既にlayout.tsxで発火した可能性のあるイベントをチェック
      const checkPrompt = () => {
        if ((window as any).deferredPrompt) {
          setDeferredPrompt((window as any).deferredPrompt);
          setIsInstallable(true);
        }
      };
      
      checkPrompt(); // 初回チェック
      // それでもまだならリスナーを追加
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        (window as any).deferredPrompt = e;
        setDeferredPrompt(e);
        setIsInstallable(true);
      };
      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      };
    }

    window.addEventListener("appinstalled", () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
    });
  }, []);

  const handleInstallClick = async () => {
    // iOSの場合はブラウザの共有メニューからの追加を案内
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    if (isIos) {
      alert("iPhone (iOS) の場合：\nブラウザ下部の「共有アイコン」から「ホーム画面に追加」を選択してください。");
      return;
    }

    if (!deferredPrompt) {
      alert("自動インストール画面を表示できませんでした。\n\nAndroid / PC の場合：\nブラウザの右上のメニュー（︙）から「ホーム画面に追加」または「アプリをインストール」を選択してください。\n\n※アイコン画像のサイズ要件等により、自動ポップアップがブロックされることがあります。");
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
    (window as any).deferredPrompt = null;
  };

  // すでにインストール済みの場合は非表示
  if (isInstallable === false && (typeof window !== "undefined" && window.matchMedia("(display-mode: standalone)").matches)) {
    return null;
  }

  return (
    <button
      onClick={handleInstallClick}
      className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 bg-trust-blue text-white px-5 py-3 rounded-full shadow-2xl hover:bg-blue-600 transition-all transform hover:scale-105 font-bold border border-white/20 animate-in fade-in slide-in-from-bottom-4"
    >
      <Download className="w-5 h-5 animate-bounce" />
      <span>アプリをインストール</span>
    </button>
  );
}
