'use client';

import Image from 'next/image';
import { useState } from 'react';
import PolicyModal from '@/components/PolicyModal';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import OrbitEyewear from '@/components/OrbitEyewear';

export default function Home() {
    const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);

    const LottiePlayer = dynamic(() => import('@/components/MainPage'), { ssr: false });

    return (
        <main className="min-h-screen min-w-full bg-black flex items-center justify-center overflow-hidden">
            {/* 최대 810x1080 px로 고정된 중앙 컨테이너 */}
            <div className="
                relative
                w-full h-full
                max-w-[810px] max-h-[1080px]
                flex flex-col
                justify-center
                items-center
                mx-auto
                min-h-screen
                min-w-0">
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

                <div className="relative z-20 w-full h-full px-4 py-6 flex flex-col">
                    {/* 헤더 */}
                    <header className="flex flex-col items-center justify-center space-y-8">
                        <div className="relative w-[70px] h-[44px] sm:w-[100px] sm:h-[64px]">
                            <Image
                                src="/1001Logo.png"
                                alt="1001Logo"
                                fill
                                sizes="(max-width: 640px) 70px, 100px"
                                className="object-contain"
                                priority
                                style={{ width: '100%', height: '100%' }}
                            />
                        </div>
                    </header>

                    {/* 메인 콘텐츠 */}
                    <div className="flex-1 flex flex-col items-center justify-center relative pt-4">
                        <h1 className="font-aribau font-bold text-[32px] sm:text-[48px] md:text-[68px] leading-[100%] text-center text-white mb-2"
                            style={{
                                textShadow: '1px 0px 1px rgba(255,255,255,0.5)',
                            }}>
                            AI Eyewear Recommendation
                        </h1>
                        <p className="font-aribau font-normal text-[16px] sm:text-[20px] md:text-[30px] leading-[136%] text-center"
                            style={{
                                color: 'rgba(255,255,255,0.60)',
                                letterSpacing: '-0.75px',
                                marginBottom: '-40px'
                            }}>
                            From AI face scan to perfect frames
                        </p>
                        <OrbitEyewear />
                        <div className="absolute bottom-0 left-0 w-full flex justify-center pb-6 sm:pb-10">
                            <Link href="/scan" className="flex justify-center w-full">
                                <button
                                    className="
                                        flex w-full max-w-[738px] h-[56px] sm:h-[70px] md:h-[88px]
                                        px-4 sm:px-8 py-2.5
                                        justify-center items-center gap-1 shrink-0 rounded-full
                                        bg-black/40 text-white
                                        font-normal text-[18px] sm:text-[24px] md:text-[30px]
                                        leading-[142%] backdrop-blur shadow-md
                                        transition-colors duration-200 hover:bg-black/60 font-aribau
                                    "
                                    style={{
                                        color: '#FFF',
                                        letterSpacing: '-0.048px',
                                    }}
                                >
                                    Start Face Scan
                                    <Image
                                        src="/arrow_right.png"
                                        alt="오른쪽 화살표"
                                        width={32}
                                        height={32}
                                        className="ml-2"
                                    />
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                <PolicyModal
                    isOpen={isPolicyModalOpen}
                    onClose={() => setIsPolicyModalOpen(false)}
                />
            </div>
        </main>
    );
}
