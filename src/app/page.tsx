'use client';

import Image from 'next/image';
import { useState } from 'react';
import PolicyModal from '@/components/PolicyModal';
import Link from 'next/link';
import dynamic from 'next/dynamic';

export default function Home() {
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);

  const LottiePlayer = dynamic(() => import('@/components/MainPage'), {
    ssr: false,
  });

  return (
    <main className="min-h-screen w-full bg-white relative">
      <div className="absolute inset-0 z-0">
        <LottiePlayer />
      </div>
      <div className="max-w-[834px] mx-auto px-6 py-8">
        {/* header section */}
        <header className="flex flex-col items-center justify-center space-y-8 mb-8">
          <div className="relative w-[200px] h-[120px]">
            <Image
              src="/1001Logo.jpg"
              alt="1001Logo"
              fill
              sizes="200px"
              className="object-contain"
              priority
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </header>

        {/* 메인 콘텐츠 영역 */}
        <div className="max-w-[768px] mx-auto">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-center text-white mb-6">
              Ai Facial Recommendation
            </h1>


              <div className="absolute bottom-0 left-0 w-full flex justify-center pb-8">
                <Link href="/scan" className="flex justify-center">
                  <button className="px-12 py-4 bg-[#007a8a] text-white rounded-xl font-semibold text-lg hover:bg-gray-300 transition-colors duration-200 shadow-md">
                    Start New Test
                  </button>
                </Link>
              </div>
          </div>
        </div>
      </div>

      <PolicyModal
        isOpen={isPolicyModalOpen}
        onClose={() => setIsPolicyModalOpen(false)}
      />
    </main>
  );
}
