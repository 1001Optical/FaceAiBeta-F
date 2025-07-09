'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';


export default function Loading() {
    // dotlottie-player 컴포넌트 스크립트 동적 로드
    useEffect(() => {
        if (!window.customElements.get('dotlottie-player')) {
            const script = document.createElement('script');
            script.src = "https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs";
            script.type = "module";
            document.body.appendChild(script);
        }
    }, []);

    return (
        <div className="fixed inset-0 z-20">
            {/* 배경 이미지 */}
            <Image
                src="/Blur.jpg"
                alt="로딩 배경"
                fill
                className="object-cover object-center z-0"
                priority
            />
            {/* 로딩 콘텐츠 */}
            <div className="flex flex-col h-full absolute inset-0 z-10">
                {/* 상단 로고 */}
                <header className="flex flex-col items-center mt-8 mb-4">
                    <div className="relative w-[200px] h-[120px] mb-12">
                        <Image
                            src="/1001Logo.png"
                            alt="1001Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </header>
                {/* 중앙 텍스트 및 얼굴 스캔 이미지 */}
                <div className="flex flex-col items-center justify-center flex-1">
                    {/* Smart AI face scan */}
                    <p
                        className="
                            font-aribau
                            text-[28px]
                            font-normal
                            leading-[1.36]
                            tracking-[-0.084px]
                            text-white
                            text-center
                            mb-4
                        "
                        style={{ color: 'var(--opacity-white-1000, #FFF)' }}
                    >
                        Smart AI face scan
                    </p>
                    {/* 흰색 바 */}
                    <div
                        className="
                            w-[270px]
                            h-[2px]
                            rounded-[24px]
                            mb-4
                            "
                        style={{
                            background: 'var(--opacity-white-200, rgba(255,255,255,0.12))',
                        }}
                    ></div>

                    {/* in progress */}
                    <p
                        className="
                            font-aribau
                            text-[24px]
                            font-light
                            leading-[1.33]
                            tracking-[-0.036px]
                            text-center
                            "
                        style={{
                            color: 'var(--opacity-white-800, rgba(255,255,255,0.87))',
                        }}
                    >
                        in progress
                    </p>

                    {/* Lottie 애니메이션 (중앙에 겹치게) */}
                    <div className="relative w-[420px] h-[420px] mt-24 flex items-center justify-center">
                            <dotlottie-player
                                src="https://lottie.host/3ee95351-a63f-4806-9414-45d55670a4b0/V8oXQSrKxH.lottie"
                                background="transparent"
                                speed="1"
                                style={{ width: 420, height: 420 }}
                                loop
                                autoplay
                            ></dotlottie-player>
                    </div>
                </div>
                {/* 하단 안내 메시지 (반투명 박스) */}
                <div className="flex justify-center items-center w-full h-full">
                <div
                    className="
                        inline-flex
                        flex-col
                        justify-center
                        items-center
                        gap-[24px]
                        p-[32px] 
                        px-[40px]
                        rounded-[48px]
                        border
                        border-[2px]
                        shadow-[0_4px_30px_0_rgba(0,0,0,0.10)]
                        backdrop-blur-[12.5px]
                        w-[738px]
                        h-[132px]
                    "
                    style={{
                        borderColor: 'var(--opacity-white-400, rgba(255,255,255,0.38))',
                        background: 'var(--opacity-black-400, rgba(0,0,0,0.38))',
                    }}
                >
                    <p
                        className="
                            font-aribau
                            text-[24px]
                            font-normal
                            leading-[1.42]
                            tracking-[-0.048px]
                            text-center
                            w-[658px]
                        "
                        style={{
                            color: 'var(--opacity-white-1000, #FFF)',
                        }}
                    >
                            We're analyzing which eyewears suit you best!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
