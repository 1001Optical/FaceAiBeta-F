'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ResponsiveContainer from '../../components/ResponsiveContainer';
import SiteHeader from '@/components/header';
import DotPlayer from '@/components/dotLottiePlayer';

// 내부 컴포넌트 분리
function LoadingInner() {
  const router = useRouter();
  const params = useSearchParams();

  // 3초 후 자동 이동
  useEffect(() => {
    const timeout = setTimeout(() => {
      // /result?뒤에 현재 쿼리스트링 그대로 붙이기
      router.push(`/result?${params.toString()}`);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [router, params]);

  return (
    <ResponsiveContainer page={'loading'}>
      <SiteHeader />
      <div className={'w-full py-[64px] flex justify-center items-center'}>
        <div
          className={'w-full px-9 flex flex-col justify-center items-center gap-10'}
        >
          <div
            className={
              'w-[420px] h-fit flex flex-col justify-center items-center gap-2'
            }
          >
            <p className={'heading-md text-white-1000'}>
              Smart AI face scan
            </p>
            <div className={'bg-white-200 w-[270px] h-0.5'} />
            <p className={'heading-sm text-white-800'}>
              In progress
            </p>
          </div>
          <div className={'size-[420px]'}>
            {/*<LottieCanvas />*/}
            <DotPlayer page={'loading'} src={'https://lottie.host/3ee95351-a63f-4806-9414-45d55670a4b0/V8oXQSrKxH.lottie'} />
          </div>
          <div className={'w-full h-[132px] px-10 py-8 bg-black-400 border-2 border-white-400 rounded-[48px]'}>
            <p className={'label-xl text-white-1000 text-center'}>
              We’re analyzing which eyewears<br/>
              suit you best!
            </p>
          </div>
        </div>
      </div>
    </ResponsiveContainer>
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
