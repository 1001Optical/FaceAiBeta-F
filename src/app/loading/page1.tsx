'use client';

import React, { useEffect, Suspense } from 'react';
import LottieCanvas from '@/components/LottieCanvas';
import { useRouter, useSearchParams } from 'next/navigation';
import ResponsiveContainer from '../../components/ResponsiveContainer';
import SiteHeader from '@/components/header';

// 내부 컴포넌트 분리
function LoadingInner() {
  const router = useRouter();
  const params = useSearchParams();

  // dotlottie-player 컴포넌트 스크립트 동적 로드
  useEffect(() => {
    if (!window.customElements.get('dotlottie-player')) {
      const script = document.createElement('script');
      script.src =
        'https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs';
      script.type = 'module';
      document.body.appendChild(script);
    }
  }, []);

  // 3초 후 자동 이동
  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     // /result?뒤에 현재 쿼리스트링 그대로 붙이기
  //     router.push(`/result?${params.toString()}`);
  //   }, 3000);
  //
  //   return () => clearTimeout(timeout);
  // }, [router, params]);

  return (
    <div className="fixed inset-0">
      <ResponsiveContainer page={'loading'}>
        <SiteHeader />
        {/* 로딩 콘텐츠 */}
        <div className="flex flex-col items-center justify-center">
          {/* 중앙 텍스트 및 얼굴 스캔 이미지 */}
          <div className="flex flex-col items-center justify-center flex-1 mt-[84px]">
            {/* Smart AI face scan */}
            <p
              className="font-aribau text-[28px] font-normal leading-[1.36] tracking-[-0.084px] text-white text-center mb-4"
              style={{ color: 'var(--opacity-white-1000, #FFF)' }}
            >
              Smart AI face scan
            </p>
            {/* 흰색 바 */}
            <div
              className="w-[270px] h-[2px] rounded-[24px] mb-4"
              style={{
                background: 'var(--opacity-white-200, rgba(255,255,255,0.12))',
              }}
            />
            {/* in progress */}
            <p
              className="font-aribau text-[24px] font-light leading-[1.33] tracking-[-0.036px] text-center"
              style={{
                color: 'var(--opacity-white-800, rgba(255,255,255,0.87))',
              }}
            >
              in progress
            </p>

            {/* Lottie 애니메이션 (중앙에 겹치게) */}
            <div className="w-[420px] h-[420px] mt-5 flex items-center justify-center">
              <LottieCanvas />
            </div>
          </div>
          {/* 하단 안내 메시지 (반투명 박스) */}
          <div className="flex justify-center items-center w-full h-full">
            <div
              className="flex flex-col justify-center items-center p-8 px-10 rounded-[3rem] border-2 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[12.5px] w-[738px] h-[132px] mt-[-70px]"
              style={{
                borderColor: 'var(--opacity-white-400, rgba(255,255,255,0.38))',
                background: 'var(--opacity-black-400, rgba(0,0,0,0.38))',
              }}
            >
              <p
                className="label-xl text-center w-[658px]"
                style={{ color: 'var(--opacity-white-1000, #FFF)' }}
              >
                We&apos;re analyzing which eyewears suit you best!
              </p>
            </div>
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
}

// 페이지 default export에서 Suspense로 감쌈
export default function Loading() {
  return (
    <Suspense fallback={null}>
      <LoadingInner />
    </Suspense>
  );
}
