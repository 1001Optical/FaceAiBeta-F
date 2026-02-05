'use client';

import { DotLottiePlayer } from '@dotlottie/react-player';
import '@dotlottie/react-player/dist/index.css';
import { useState, useEffect } from 'react';

export default function OrbitEyewear() {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        // dotLottie 에러 감지를 위한 전역 에러 핸들러
        const handleError = (event: ErrorEvent) => {
            const errorMsg = event.message || '';
            if (errorMsg.includes('dotLottie') && (errorMsg.includes('403') || errorMsg.includes('Failed to load'))) {
                console.warn('OrbitEyewear animation failed to load, hiding component');
                setHasError(true);
            }
        };

        // 콘솔 에러도 감지 (dotLottie는 콘솔에 에러를 출력함)
        const originalConsoleError = console.error;
        const errorInterceptor = (...args: any[]) => {
            const errorMessage = args.join(' ');
            if (errorMessage.includes('[dotLottie-common]') && errorMessage.includes('403')) {
                console.warn('OrbitEyewear: Animation load failed (403), gracefully handling error');
                setHasError(true);
            }
            originalConsoleError.apply(console, args);
        };
        console.error = errorInterceptor;

        window.addEventListener('error', handleError);

        // 일정 시간 후에도 로드 확인이 안 되면 에러로 간주하지 않음 (조용히 실패)
        const timeout = setTimeout(() => {
            // 3초 후에도 에러가 감지되지 않으면 정상으로 간주
        }, 3000);

        return () => {
            window.removeEventListener('error', handleError);
            console.error = originalConsoleError;
            clearTimeout(timeout);
        };
    }, []);

    // 에러 발생 시 빈 공간 유지 (레이아웃 깨짐 방지)
    if (hasError) {
        return <div className="flex items-center justify-center w-full" style={{ width: 810, height: 705 }} />;
    }

    return (
        <div className="flex items-center justify-center w-full">
            <DotLottiePlayer
                src="https://lottie.host/c992f4c3-1b27-4dff-8586-f6d9af8192da/Rpb2UtV7ND.lottie"
                autoplay
                loop
                background="transparent"
                speed={1}
                style={{ width: 810, height: 705 }}
            />
        </div>
    );
}


