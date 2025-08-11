'use client';

import Image from 'next/image';
import { useState } from 'react';
import PolicyModal from '@/components/PolicyModal';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import OrbitEyewear from '@/components/OrbitEyewear';
import ResponsiveContainer from '../components/ResponsiveContainer';

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

            <div className="relative z-20 max-w-[834px] mx-auto px-6 py-8">
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

                <ResponsiveContainer>
                    {/* 메인 콘텐츠 영역 */}
                    <div className="max-w-[768px] mx-auto flex flex-col items-center justify-center pt-16">

                        <div className="flex flex-col items-center justify-center">
                            <div className="w-[700px] max-w-[90%] mx-auto flex justify-center">
                                <Image
                                    src="/Title.png"
                                    alt="AI Eyewear Recommendation, Perfect Frames. Powered by AI."
                                    width={579}
                                    height={176}
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <OrbitEyewear />
                            <div className="absolute bottom-0 left-0 w-full flex justify-center pb-24">
                                <Link href="/scan" className="flex justify-center">
                                    <button
                                        className="
                                        flex
                                        w-[738px]
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
                                            width={43}
                                            height={43}
                                            className="ml-2"
                                        />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </ResponsiveContainer>
            </div>


            <PolicyModal
                isOpen={isPolicyModalOpen}
                onClose={() => setIsPolicyModalOpen(false)}
            />
        </main>
    );
}