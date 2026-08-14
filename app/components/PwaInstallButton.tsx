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

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // インストール済みの場合は非表示
    window.addEventListener("appinstalled", () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  if (!isInstallable) return null;


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
