'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { faceShapeDetails } from '@/data/faceData';
import { frameRecommendations } from '@/data/reconMap';
import { frameShapeDetails } from '@/data/frameData';
import { FaceShapeDetail, FrameShapeDetail } from '@/types/face';
import Image from 'next/image'
import "./FaceScanner.css";
import FaceScanBar from "./FaceScanBar";
import Link from 'next/link';
import ResponsiveContainer from '../../components/ResponsiveContainer';

// 최대 동시 3개씩 이미지를 프리로드, 각 이미지의 로딩이 비동기적으로 병렬 진행
async function limitedParallelLoad(urls: string[], limit: number = 3): Promise<boolean[]> {
    const results: boolean[] = [];
    let idx = 0;

    const preloadImage = (url: string): Promise<void> =>
        new Promise((resolve, reject) => {
            const img = new window.Image();
            img.onload = () => resolve();
            img.onerror = () => reject();
            img.src = url;
        });

    async function loadNext(): Promise<void> {
        if (idx >= urls.length) return;
        const i = idx++;
        try {
            await preloadImage(urls[i]);
            results[i] = true;
        } catch {
            results[i] = false;
        }
        await loadNext();
    }
    await Promise.all(Array(limit).fill(0).map(() => loadNext()));
    return results;
}

export default function ScanPage() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [step, setStep] = useState<'intro' | 'guide' | 'loading'>('intro');
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;


    // 캡처 및 얼굴 감지 상태 (useCallback, useEffect보다 위에 선언)
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [captured, setCaptured] = useState(false);
    const [, setCountdown] = useState<number | null>(null);

    // 카메라 프리뷰 시작
    useEffect(() => {
        if (step === 'intro' || step === 'guide') {
            startCamera();
        }

        // ref의 값을 클로저 변수로 저장
        const videoEl = videoRef.current;

        // 정리: 컴포넌트 언마운트 시 카메라 종료
        return () => {
            if (videoEl) {
                const stream = videoEl.srcObject as MediaStream;
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
            }
        };
    }, [step]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user',
                },
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error(err);
            setError('Cannot access camera. Please check camera permissions.');
        }
    };

    // 캡처 함수 useCallback 적용
    const handleCapture = useCallback(async () => {
        if (!videoRef.current || !canvasRef.current || isLoading) {
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.save();
            ctx.scale(-1, 1); // 좌우반전
            ctx.drawImage(
                video,
                -video.videoWidth,
                0,
                video.videoWidth,
                video.videoHeight
            );
            ctx.restore();
        }
        setCaptured(true);
        setIsLoading(true);
        setError(null); // 에러 상태 초기화

        try {
            // 캡처된 이미지를 Blob으로 변환
            const blob = await new Promise<Blob | null>(resolve => {
                canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.95);
            });

            if (!blob) {
                throw new Error('Failed to convert image.');
            }

            // FormData로 변환
            const formData = new FormData();
            formData.append('image', blob, 'capture.jpg');

            // Flask API 엔드포인트에 POST 요청
            const response = await fetch(`${apiUrl}/upload_image`, {
                method: 'POST',
                body: formData,
                headers: {
                    Accept: 'application/json',
                },
                signal: AbortSignal.timeout(10000),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const data = await response.json();

            if (!data || !data.image_url) {
                throw new Error('Image upload failed.');
            }

            // 업로드된 이미지 URL을 Face Shape Detection API에 POST
            const detectRes = await fetch(`${apiUrl}/detect_face_shape`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer eyJzdWIiOiIxMjM0NTY4ODkwIiwibmFtZSI6IkpqaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ`,
                    Accept: 'application/json',
                },
                body: JSON.stringify({ image_url: data.image_url }),
                signal: AbortSignal.timeout(10000),
            });

            if (!detectRes.ok) {
                const errorText = await detectRes.text();
                throw new Error(`HTTP error! status: ${detectRes.status}, message: ${errorText}`);
            }

            const detectData = await detectRes.json();

            // 얼굴 인식 실패 처리
            if (
                (detectData.status === 'error' &&
                    detectData.status_code === 'unable_to_determine') ||
                detectData.shape === 'Unknown' ||
                !detectData.shape
            ) {
                setError('Face recognition failed. Please try again.');
                setStep('guide');
                setCaptured(false);
                return;
            }

            // 결과 페이지로 이동하면서 데이터 전달
            const queryParams = new URLSearchParams({
                faceShape: detectData.shape,
                confidence: detectData.confidence || '0',
                ratios: JSON.stringify({
                    cheek: detectData.cheek_ratio,
                    chin: detectData.chin_ratio,
                    forehead: detectData.forehead_ratio,
                    head: detectData.head_ratio,
                    jaw: detectData.jaw_ratio,
                    jawAngle: detectData.jaw_angle,
                }),
            }).toString();

            // 얼굴형 이미지와 프레임 이미지들을 미리 로드
            const faceDetail = faceShapeDetails.find(
                (f: FaceShapeDetail) => f.shape === detectData.shape
            );
            const recommendations =
                frameRecommendations[
                detectData.shape as keyof typeof frameRecommendations
                ];
            const frameDetails =
                recommendations?.recommendedFrames
                    .map((frameName: string) =>
                        frameShapeDetails.find(
                            (f: FrameShapeDetail) =>
                                f.shape.toLowerCase() === frameName.toLowerCase()
                        )
                    )
                    .filter(Boolean) || [];

            // 모든 이미지 로드 완료 대기
            const imageUrls = [
                faceDetail?.image,
                ...frameDetails.map(
                    (frame: FrameShapeDetail | undefined) => frame?.image
                ),
            ].filter(Boolean) as string[];

            try {
                // 모든 이미지가 로드될 때까지 대기
                await limitedParallelLoad(imageUrls, 3);
                // 이미지 로드가 완료된 후 결과 페이지로 이동
                router.push(`/loading?${queryParams}`);
            } catch (error) {
                // 이미지 로드 실패 시에도 로딩 페이지로 이동
                console.error(error);
                router.push(`/loading?${queryParams}`);
            }
        } catch (err) {
            setError(
                'API request failed: ' + (err instanceof Error ? err.message : String(err))
            );
            setStep('guide');
            setCaptured(false);
        } finally {
            setIsLoading(false);
        }
    }, [apiUrl, isLoading, router]);

    // 얼굴이 타원 안에 들어오면 2초 후 자동 캡처 (임시: 버튼 없이 타이머)
    useEffect(() => {
        if (step === 'guide' && !captured) {
            setCountdown(2);
            const timer = setTimeout(() => {
                handleCapture();
            }, 2000);
            return () => clearTimeout(timer);
        } else {
            setCountdown(null);
        }
    }, [step, captured, handleCapture]);

    return (
        <div
            className="relative flex flex-col items-center justify-center min-h-screen w-full h-screen bg-black overflow-hidden"
        >
            {/* 카메라 프리뷰 */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover z-0 transform scale-x-[-1]"
            />
            {/* 캡처된 이미지 미리보기 (디버그용) */}
            <canvas ref={canvasRef} className="hidden" />

            {/* 반투명 오버레이 + 안내문구 + 버튼 (1번 화면) */}
            {step === 'intro' && (
                <div
                    className="fixed inset-0 z-10"
                    style={{
                        background: 'rgba(0,0,0,0.35)',
                        minWidth: 658,
                        minHeight: 652,
                    }}
                >
                    {/* 내비게이션바 (뒤로가기 버튼) */}
                    <div
                        onClick={() => router.back()}
                        className="fixed top-8 left-6 cursor-pointer z-30"
                        style={{
                            width: 'clamp(28px, 7vw, 44px)',
                            height: 'clamp(28px, 7vw, 44px)',
                        }}
                    >
                        <Image
                            src="/direction_left.png"
                            alt="내비게이션 바"
                            fill
                            sizes="80px"
                            className="object-contain"
                            priority
                        />
                    </div>

                    {/* 로고 (가로 중앙 상단 고정) */}
                    <header
                        className="fixed top-8 left-1/2 -translate-x-1/2 z-30"
                        style={{ pointerEvents: 'none' }} // header 자체에 클릭 무시, 내부만 클릭 가능
                    >
                        <Link href="/" passHref>
                            <div
                                className="relative cursor-pointer pointer-events-auto"
                                style={{
                                    width: 'clamp(60px, 10vw, 100px)',
                                    height: 'clamp(38px, 6.4vw, 64px)',
                                }}
                            >
                                <Image
                                    src="/1001Logo.png"
                                    alt="1001Logo"
                                    fill
                                    sizes="100px"
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </Link>
                    </header>

                    <ResponsiveContainer>
                        {/* 중앙 반투명 박스 */}
                        <div
                            style={{
                                position: 'absolute',
                                top: '45%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 738,
                                height: 716,
                                boxSizing: 'border-box',
                                borderRadius: 48,
                                border: '2px solid var(--opacity-white-400, rgba(255, 255, 255, 0.38))',
                                background: 'var(--opacity-black-600, rgba(0, 0, 0, 0.60))',
                                boxShadow: '0px 4px 30px 0px rgba(0, 0, 0, 0.10)',
                                backdropFilter: 'blur(12.5px)',
                                display: 'inline-flex',
                                padding: '32px 40px',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 42,
                            }}
                        >
                            {/* 안내문구 및 아이콘 */}
                            <div className="flex flex-col items-center">
                                <div className="flex justify-center items-center">
                                    <Image
                                        src="/record_icon.png"
                                        alt="Record"
                                        width={100}
                                        height={100}
                                    />
                                </div>
                                <h1
                                    style={{
                                        color: '#FFF',
                                        fontFamily: '"Aribau Grotesk", sans-serif',
                                        fontSize: 28,
                                        fontWeight: 400,
                                        lineHeight: '136%',
                                        letterSpacing: '-0.084px',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    Please adjust face to guidelines
                                </h1>

                                {/* 실선 구분선 */}
                                <div
                                    style={{
                                        width: 658,
                                        height: 2,
                                        background: 'rgba(136,136,136,0.55)',
                                        marginTop: 10,
                                        marginBottom: 10,
                                        marginLeft: 0,
                                        marginRight: 0,
                                        borderRadius: 1,
                                    }}
                                />

                                {/* 흰색 반투명 박스 3개 (아이콘만) */}
                                <div className="flex gap-8 mt-2">
                                    <Image
                                        src="/icon/cameracheck.png"
                                        alt="카메라 체크"
                                        width={206}
                                        height={206}
                                        style={{ borderRadius: 42 }}
                                    />
                                    <Image
                                        src="/icon/glassesclose.png"
                                        alt="안경 클로즈"
                                        width={206}
                                        height={206}
                                        style={{ borderRadius: 42 }}
                                    />
                                    <Image
                                        src="/icon/haircheck.png"
                                        alt="헤어 체크"
                                        width={206}
                                        height={206}
                                        style={{ borderRadius: 42 }}
                                    />
                                </div>

                                {/* 카테고리명: Camera, Eyewear, Hair */}
                                <div className="flex gap-8">
                                    <span
                                        style={{
                                            color: '#888',
                                            fontFamily: '"Aribau Grotesk"',
                                            fontSize: 18,
                                            fontWeight: 500,
                                            textAlign: 'center',
                                            width: 206,
                                            marginTop: 8,
                                            marginBottom: 8,
                                            letterSpacing: '0.01em',
                                        }}
                                    >
                                        Camera
                                    </span>
                                    <span
                                        style={{
                                            color: '#888',
                                            fontFamily: '"Aribau Grotesk"',
                                            fontSize: 18,
                                            fontWeight: 500,
                                            textAlign: 'center',
                                            width: 206,
                                            marginTop: 8,
                                            marginBottom: 8,
                                            letterSpacing: '0.01em',
                                        }}
                                    >
                                        Eyewear
                                    </span>
                                    <span
                                        style={{
                                            color: '#888',
                                            fontFamily: '"Aribau Grotesk"',
                                            fontSize: 18,
                                            fontWeight: 500,
                                            textAlign: 'center',
                                            width: 206,
                                            marginTop: 8,
                                            marginBottom: 8,
                                            letterSpacing: '0.01em',
                                        }}
                                    >
                                        Hair
                                    </span>
                                </div>

                                {/* 안내문구 3개: 각 박스 하단에 위치 */}
                                <div className="flex gap-8">
                                    <span
                                        style={{
                                            color: '#FFF',
                                            fontFamily: '"Aribau Grotesk"',
                                            fontSize: 24,
                                            fontWeight: 300,
                                            textAlign: 'center',
                                            width: 206,
                                        }}
                                    >
                                        Please look straight at the camera.
                                    </span>
                                    <span
                                        style={{
                                            color: '#FFF',
                                            fontFamily: '"Aribau Grotesk"',
                                            fontSize: 24,
                                            fontWeight: 300,
                                            textAlign: 'center',
                                            width: 206,
                                        }}
                                    >
                                        Remove your eyewear for an accurate scan.
                                    </span>
                                    <span
                                        style={{
                                            color: '#FFF',
                                            fontFamily: '"Aribau Grotesk"',
                                            fontSize: 24,
                                            fontWeight: 300,
                                            textAlign: 'center',
                                            width: 206,
                                        }}
                                    >
                                        Pull your hair back to show your face.
                                    </span>
                                </div>
                            </div>

                            {/* 버튼: 박스 하단 */}
                            <button
                                className="
                                w-[658px]
                                h-[88px]
                                flex items-center justify-center
                                rounded-full
                                border
                                border-white/40
                                bg-white/15
                                text-white
                                text-[24px]
                                font-aribau
                                font-light
                                shadow-md
                                transition-colors
                                duration-200
                                hover:bg-white/35
                             "
                                onClick={() => setStep('guide')}
                                onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.35)')}
                                onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
                            >
                                Let&apos;s Begin
                            </button>
                        </div>
                    </ResponsiveContainer>
                </div>
            )}

            {/* 2번 화면: 타원 가이드라인 + 안내문구 */}
            {
                step === 'guide' && (
                    <div
                        className="fixed inset-0 z-10"
                        style={{ background: 'rgba(0,0,0,0.35)' }}
                    >

                        {/* 내비게이션바 (뒤로가기 버튼) */}
                        <div
                            onClick={() => router.back()}
                            className="fixed top-8 left-6 cursor-pointer z-30"
                            style={{
                                width: 'clamp(28px, 7vw, 44px)',
                                height: 'clamp(28px, 7vw, 44px)',
                            }}
                        >
                            <Image
                                src="/direction_left.png"
                                alt="내비게이션 바"
                                fill
                                sizes="80px"
                                className="object-contain"
                                priority
                            />
                        </div>

                        {/* 로고 (가로 중앙 상단 고정) */}
                        <header
                            className="fixed top-8 left-1/2 -translate-x-1/2 z-30"
                            style={{ pointerEvents: 'none' }} // header 자체에 클릭 무시, 내부만 클릭 가능
                        >
                            <Link href="/" passHref>
                                <div
                                    className="relative cursor-pointer pointer-events-auto"
                                    style={{
                                        width: 'clamp(60px, 10vw, 100px)',
                                        height: 'clamp(38px, 6.4vw, 64px)',
                                    }}
                                >
                                    <Image
                                        src="/1001Logo.png"
                                        alt="1001Logo"
                                        fill
                                        sizes="100px"
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                            </Link>
                        </header>
                        <ResponsiveContainer>
                            <div
                                style={{
                                    position: "absolute",
                                    width: 1200,
                                    height: 1200,
                                    left: "50%",
                                    top: "40%",
                                    transform: "translate(-50%, -50%)",
                                    pointerEvents: "none",
                                    zIndex: 20,
                                }}
                            >
                                {/* 타원 가이드라인 */}
                                <svg
                                    width="100%"
                                    height="100%"
                                    viewBox="0 0 1200 1200"
                                >
                                    <ellipse
                                        cx="600"
                                        cy="540"
                                        rx={207}
                                        ry={265}
                                        stroke="var(--opacity-white-1000, #FFF)"
                                        strokeWidth={8}
                                        fill="none"
                                        style={{ filter: 'drop-shadow(0 0 12px #fff)' }}
                                    />
                                </svg>
                                <FaceScanBar />
                            </div>

                            {/* 안내문구 박스: 타원보다 훨씬 아래에 배치 */}
                            <div
                                className={`absolute left-1/2 bottom-[200px] -translate-x-1/2 flex justify-center items-center rounded-[48px] border border-white/40 shadow-lg backdrop-blur-[12.5px] text-white text-center z-30 w-[738px] h-[132px] text-[1.15rem] 
                                    ${error ? 'bg-red-500/40' : 'bg-black/40'}`}
                            >
                                <div className="w-[658px] text-white text-center font-aribau text-[24px] font-normal leading-[142%] tracking-[-0.048px]">
                                    {error
                                        ? <>We couldn&apos;t recognize your face.<br />Make sure your face is clearly visible and try again.</>
                                        : <>Just a moment<br />We&apos;re scanning your face to find the best frames for you!</>
                                    }
                                </div>
                            </div>
                        </ResponsiveContainer>
                    </div>
                )
            }
        </div >
    );
}