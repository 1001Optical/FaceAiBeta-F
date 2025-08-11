'use client';

import Image from 'next/image';
import { useState } from 'react';
import PolicyModal from '@/components/PolicyModal';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import OrbitEyewear from '@/components/OrbitEyewear';

export default function Home() {
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);

  const LottiePlayer = dynamic(() => import('@/components/MainPage'), {
    ssr: false,
  });

  return (
    <main className="min-h-screen w-full relative overflow-hidden">
      {/* 배경 이미지 */}
      <Image
        src="/Blur.jpg"
        alt="배경"
        fill
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
          zIndex: 0,
        }}
        priority
      />

      <div className="absolute inset-0 z-10 pointer-events-none">
        <LottiePlayer />
      </div>

      <header className="fixed top-8 left-1/2 -translate-x-1/2 z-30">
        <Link href="/" passHref>
          <div
            className="relative cursor-pointer"
            style={{
              width: 'clamp(60px, 10vw, 100px)',
              height: 'clamp(38px, 6.4vw, 64px)',
            }}
          >
            <Image src="/1001Logo.png" alt="1001Logo" fill sizes="100px" className="object-contain" priority />
          </div>
        </Link>
      </header>

      {/* 메인 콘텐츠 */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full min-h-screen pt-30">
        {/* Title 이미지(반응형) */}
        <div className="w-full max-w-[579px] mx-auto flex justify-center px-4 mt-10">
          <Image
            src="/Title.png"
            alt="AI Eyewear Recommendation, Perfect Frames. Powered by AI."
            width={579}
            height={176}
            priority
            sizes="(max-width: 579px) 90vw, 579px"
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
            }}
          />
        </div>

        {/* OrbitEyewear(반응형 컨테이너) */}
        <div className="w-full max-w-[810px] mx-auto">
          <OrbitEyewear />
        </div>
      </div>

      {/* Start Face Scan 버튼(고정 위치) */}
      <div
        className="fixed left-1/2 -translate-x-1/2 z-50"
        style={{ bottom: 32 }}
      >
        <Link href="/scan">
          <button
            className="
              flex
              w-[738px]
              max-w-[90vw]
              h-[88px]
              px-8
              py-2.5
              justify-center
              items-center
              gap-1
              shrink-0
              rounded-full
              bg-black/40
              border border-white/40
              backdrop-blur-lg
              text-white
              font-normal
              text-[30px]
              leading-[142%]
              shadow-md
              transition-colors
              duration-200
              hover:bg-white/35
              font-aribau
            "
          >
            Start Face Scan
            <Image
              src="/arrow_right.png"
              alt="오른쪽 화살표"
              width={43}
              height={43}
              className="ml-2"
            />
          </button>
        </Link>
      </div>

      <PolicyModal
        isOpen={isPolicyModalOpen}
        onClose={() => setIsPolicyModalOpen(false)}
      />
    </main>
  );
}
