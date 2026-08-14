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

    // iOS判定
    const isIos =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as any).MSStream;

    // インストール済み判定（standalone モードで起動中）
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true;

    if (isStandalone) return; // インストール済みなら何もしない

    if (isIos) {
      // iOS は beforeinstallprompt が発火しないので常に表示
      setIsInstallable(true);
      return;
    }

    // ① layout.tsx の Script が既に捕まえていた場合
    if ((window as any).__pwaPrompt) {
      setDeferredPrompt((window as any).__pwaPrompt);
      setIsInstallable(true);
      return;
    }

    // ② まだの場合は「pwa-prompt-ready」カスタムイベントを待つ
    const onPromptReady = () => {
      const p = (window as any).__pwaPrompt;
      if (p) {
        setDeferredPrompt(p);
        setIsInstallable(true);
      }
    };
    window.addEventListener("pwa-prompt-ready", onPromptReady);

    // ③ 念のため beforeinstallprompt も直接リスンする
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      (window as any).__pwaPrompt = e;
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    // インストール完了後は非表示
    window.addEventListener("appinstalled", () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("pwa-prompt-ready", onPromptReady);
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    // iOS はホーム画面追加の手順を案内
    const isIos =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as any).MSStream;
    if (isIos) {
      alert(
        "【iPhoneの場合】\nSafariのブラウザ下部にある「共有」アイコン（四角から矢印が出たマーク）をタップし、「ホーム画面に追加」を選択してください。"
      );
      return;
    }

    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstallable(false);
    }
    (window as any).__pwaPrompt = null;
    setDeferredPrompt(null);
  };

  if (!isInstallable) return null;

  return (
    <button
      id="pwa-install-btn"
      onClick={handleInstallClick}
      className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 bg-trust-blue text-white px-5 py-3 rounded-full shadow-2xl hover:bg-blue-600 transition-all transform hover:scale-105 font-bold border border-white/20"
      style={{ animation: "slideUp 0.4s ease-out" }}
    >
      <Download className="w-5 h-5" />
      <span>アプリをインストール</span>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100px); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
      `}</style>
    </button>
  );
}
