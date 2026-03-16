"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function StoryPage() {
  const [activeImage, setActiveImage] = useState<number | null>(null);

  return (
    <div className="bg-[#FAFAFA] min-h-screen flex flex-col font-sans">
      <header className="bg-white shadow-sm py-4 h-20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <Image src="/assets/logo_v2.png" alt="Logo" width={60} height={60}
              className="h-14 w-auto object-contain" />
            <span className="ml-3 text-xl font-black tracking-tighter hidden sm:block leading-none">
              <span className="text-life-green">Animal</span>
              <span className="text-life-red">Blood</span>
              <span className="text-trust-blue">Connect</span>
            </span>
          </Link>
          <Link href="/" className="text-sm font-bold text-gray-500 hover:text-black">
            トップへ戻る
          </Link>
        </div>
      </header>
      
      <main className="flex-grow">
        {/* ☀️ Taiyou Story Section */}
        <section id="story" className="py-24 bg-deep-blue text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none"></div>
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter">The Story that Inspired this Network.</h1>
              <p className="text-life-green font-black tracking-[0.3em] uppercase text-xs">太陽がくれた、命のバトン</p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div className="space-y-6 text-base md:text-lg font-medium leading-relaxed text-blue-50/90">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-grow">
                    <p>2年前の夜、一本の電話が鳴りました。<br />「近くの駐車場で、犬が血まみれで倒れている」</p>
                    <p className="text-xs md:text-sm text-blue-200/60 mt-2 leading-relaxed">Two years ago at night, the phone rang. <br />&quot;There&#39;s a dog lying bleeding in a parking lot nearby.&quot;</p>
                  </div>
                  {/* ☀️ Taiyou Top Image - Fixed size to fit content */}
                  <div className="w-full md:w-48 flex-shrink-0 flex justify-center md:block">
                    <div className="rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl transform md:-rotate-2 inline-block">
                      <Image 
                        src="/assets/taiyou_top.jpg" 
                        alt="Taiyou Top" 
                        width={400} 
                        height={400} 
                        className="object-contain w-auto h-48 md:h-48 bg-deep-blue/10" 
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <p>すぐに向かうと、ライトに照らされた地面は真っ赤でした。国道で車に巻き込まれた野犬。包帯を巻く間も、命がこぼれていくような絶望的な状況でした。</p>
                  <p className="text-xs md:text-sm text-blue-200/60 mt-2 leading-relaxed">When we arrived, the ground illuminated by the headlights was bright red. A stray dog had been hit by a car on the highway. Even while wrapping his bandages, it felt like his life was slipping away.</p>
                </div>
                
                <div>
                  <p>緊急手術で左前脚を断脚し、なんとか一命を取り留めたその子に、私たちは<span className="text-white font-black border-b-2 border-life-green">「太陽」</span>と名付けました。</p>
                  <p className="text-xs md:text-sm text-blue-200/60 mt-2 leading-relaxed">Left with no choice but to amputate his left front leg in an emergency surgery, he miraculously survived. We named him &quot;Taiyou&quot; (Sun).</p>
                </div>
                
                <div className="py-4">
                  <p className="text-2xl md:text-3xl font-black text-white italic leading-tight">太陽は、強い子でした。</p>
                  <p className="text-sm md:text-base text-life-green mt-2 font-bold italic">Taiyou was a tough boy.</p>
                </div>

                <div>
                  <p>三本脚になっても、1メートルの高さを軽々と跳び越え、誰より速く走る。そして、猫たちが自分から寄ってくるほど、穏やかな性格をしていました。散歩の帰り道、脚が疲れた太陽を何度も抱きかかえて帰ったのは、今では温かい思い出です。</p>
                  <p className="text-xs md:text-sm text-blue-200/60 mt-2 leading-relaxed">Even on three legs, he could easily jump over a meter high and run faster than anyone. He was so gentle that cats would naturally approach him. Carrying Taiyou home many times when his leg got tired after walks is now a warm memory.</p>
                </div>
                
                <div>
                  <p>それから2年後。また一本の電話が鳴りました。それは、かつて太陽を救ってくれた動物病院の院長からでした。</p>
                  <p className="text-xs md:text-sm text-blue-200/60 mt-2 leading-relaxed">Two years later, the phone rang again. It was from the director of the veterinary hospital that had once saved Taiyou.</p>
                </div>
                
                <div className="bg-white/10 border-l-4 border-life-red p-4">
                  <p className="font-bold text-white">「手術で、緊急に血液が必要になった。太陽の力を貸してほしい」</p>
                  <p className="text-xs md:text-sm text-blue-200/80 mt-2 italic">&quot;We urgently need blood for a surgery. We need Taiyou&#39;s help.&quot;</p>
                </div>
                
                <div>
                  <p>かつて自分を救ってくれた場所へ。怖がりの太陽でしたが、私たちがそばにいると、静かに供血を受け入れてくれました。あの日、地面を赤く染めた太陽の血が、今度は別の命を救うために、誰かの体の中へと繋がったのです。</p>
                  <p className="text-xs md:text-sm text-blue-200/60 mt-2 leading-relaxed">Returning to the place that once saved him, the normally timid Taiyou quietly accepted the blood donation process with us by his side. The blood that had once stained the ground red was now flowing into someone else to save another life.</p>
                </div>
                
                <div className="pt-8">
                  <p className="text-xl font-black text-life-green mb-1">これが、私たちがABCを作った理由です。</p>
                  <p className="text-xs md:text-sm text-blue-200/80 mb-4 font-bold tracking-widest uppercase">This is why we created ABC.</p>
                  <div className="border border-white/20 p-6 rounded-2xl bg-white/5 space-y-4">
                    <p className="text-sm">
                      ドナーが見つからずに救えない命がある。その現実を変えるために、ここから始めます。太陽のように、助けられた命が、また誰かを助ける命になる。その連鎖を、当たり前の「仕組み」にしたい。
                    </p>
                    <p className="text-xs text-blue-200/60 leading-relaxed border-t border-white/10 pt-4">
                      There are lives that cannot be saved simply because a donor cannot be found. We are starting from here to change this reality. Just like Taiyou, a saved life becomes a life that saves someone else. We want to turn this chain of life into a standard system.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="flex flex-wrap gap-4 justify-center lg:justify-end">
                  {[
                    { src: "/assets/taiyou_1.jpg", alt: "Taiyou 1", rotate: "-rotate-3" },
                    { src: "/assets/taiyou_2.jpg", alt: "Taiyou 2", rotate: "rotate-2" },
                    { src: "/assets/taiyou_3.jpg", alt: "Taiyou 3", rotate: "-rotate-1" },
                    { src: "/assets/taiyou_4.jpg", alt: "Taiyou 4", rotate: "rotate-3" },
                    { src: "/assets/taiyou_5.jpg", alt: "Taiyou 5", rotate: "-rotate-2" },
                  ].map((img, idx) => {
                    const isActive = activeImage === idx;
                    return (
                    <div 
                      key={idx} 
                      onClick={() => setActiveImage(isActive ? null : idx)}
                      className={`group relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-xl border-2 border-white/20 transform transition-all duration-500 ease-out cursor-pointer ${
                        isActive 
                          ? 'scale-[2.5] md:scale-[2] rotate-0 z-50 shadow-2xl bg-black' 
                          : `${img.rotate} hover:rotate-0 hover:scale-110 hover:z-40`
                      }`}
                      tabIndex={0}
                    >
                      <Image 
                        src={img.src} 
                        alt={img.alt} 
                        fill
                        className="object-cover pointer-events-none"
                      />
                      <div className={`absolute inset-0 bg-black/20 pointer-events-none transition-colors duration-300 ${isActive ? 'bg-transparent' : 'group-hover:bg-transparent'}`}></div>
                    </div>
                  )})}
                </div>
                <p className="text-[10px] text-blue-300/60 mt-8 text-center lg:text-right font-bold italic">
                  * 写真をタップ（クリック）すると拡大、もう一度タップで元に戻ります
                </p>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <Link href="/register" className="inline-block bg-life-red text-white font-black px-12 py-5 rounded-full shadow-2xl hover:bg-red-700 transition transform hover:scale-105 active:scale-95 text-lg">
                供血ドナー登録はこちら
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
