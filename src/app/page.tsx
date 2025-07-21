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

            {/* max-w 는 데스크탑/태블릿/모바일별로 조정 */}
            <div className="relative z-20 mx-auto px-4 py-6 max-w-full sm:px-6 sm:py-8 md:max-w-[720px] lg:max-w-[834px]">
                {/* Header */}
                <header className="flex flex-col items-center justify-center space-y-6 sm:space-y-8">
                    {/* logo size responsive */}
                    <div className="relative w-[80px] h-[48px] sm:w-[100px] sm:h-[64px]">
                        <Image
                            src="/1001Logo.png"
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
                <div className="mx-auto flex flex-col items-center justify-center pt-6 sm:pt-8 max-w-full md:max-w-[768px]">
                    <div className="flex flex-col items-center justify-center w-full">
                        {/* h1 텍스트 크기 반응형, 줄바꿈 개선 */}
                        <h1
                            className="
                                font-aribau font-bold
                                text-3xl
                                xs:text-4xl
                                sm:text-6xl
                                md:text-[52px]
                                lg:text-[68px]
                                leading-[90%] text-center text-white mb-2
                            "
                            style={{
                                textShadow: '1px 0px 1px rgba(255, 255, 255, 0.50)',
                                fontStyle: 'normal',
                            }}
                        >
                            AI Eyewear<br className="md:hidden" /> Recommendation
                        </h1>
                        <p
                            className="
                                font-aribau font-normal
                                text-base xs:text-lg
                                md:text-lg
                                leading-[136%] text-center
                                mb-0
                            "
                            style={{
                                color: 'rgba(255, 255, 255, 0.60)',
                                fontStyle: 'normal',
                                letterSpacing: '-0.75px',
                                marginBottom: '-28px',
                            }}
                        >
                            From AI face scan to perfect frames
                        </p>
                        <OrbitEyewear />
                        {/* 버튼 래퍼 - 화면 크기에 맞게 높이, 너비 조정  */}
                        <div className="absolute bottom-0 left-0 w-full flex justify-center pb-6 sm:pb-10">
                            <Link href="/scan" className="flex justify-center w-full">
                                <button
                                    className="
                                        flex
                                        w-full max-w-[95vw]
                                        xs:max-w-[320px]
                                        sm:max-w-[430px]
                                        md:max-w-[560px]
                                        lg:max-w-[738px]
                                        h-[50px] xs:h-[60px] md:h-[76px] lg:h-[88px]
                                        px-6 xs:px-8
                                        py-2.5
                                        justify-center
                                        items-center
                                        gap-1
                                        rounded-full
                                        bg-black/40
                                        text-white
                                        font-normal
                                        text-lg xs:text-xl md:text-2xl lg:text-[30px]
                                        leading-[142%]
                                        backdrop-blur shadow-md
                                        transition-colors
                                        duration-200
                                        hover:bg-black/60
                                        font-aribau
                                    "
                                    style={{
                                        color: '#FFF',
                                        fontStyle: 'normal',
                                        letterSpacing: '-0.048px',
                                    }}
                                >
                                    Start Face Scan
                                    <Image
                                        src="/arrow_right.png"
                                        alt="오른쪽 화살표"
                                        width={28}
                                        height={28}
                                        className="ml-2 md:w-[36px] md:h-[36px] lg:w-[43px] lg:h-[43px]"
                                    />
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
