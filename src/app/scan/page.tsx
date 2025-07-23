'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { faceShapeDetails } from '@/data/faceData';
import { frameRecommendations } from '@/data/reconMap';
import { frameShapeDetails } from '@/data/frameData';
import { FaceShapeDetail, FrameShapeDetail } from '@/types/face';
import Image from 'next/image';
import "./FaceScanner.css";
import FaceScanBar from "./FaceScanBar";
import Link from 'next/link';
import ResponsiveContainer from "@/components/ResponsiveContainer";

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

    // 캡처 및 얼굴 감지 상태
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [captured, setCaptured] = useState(false);
    const [, setCountdown] = useState<number | null>(null);

    // 카메라 프리뷰 시작
    useEffect(() => {
        if (step === 'intro' || step === 'guide') {
            startCamera();
        }
        const videoEl = videoRef.current;
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
            ctx.scale(-1, 1);
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
        setError(null);

        try {
            const blob = await new Promise<Blob | null>(resolve => {
                canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.95);
            });
            if (!blob) throw new Error('Failed to convert image.');

            const formData = new FormData();
            formData.append('image', blob, 'capture.jpg');
            const response = await fetch(`${apiUrl}/upload_image`, {
                method: 'POST',
                body: formData,
                headers: { Accept: 'application/json' },
                signal: AbortSignal.timeout(10000),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
            const data = await response.json();
            if (!data || !data.image_url) throw new Error('Image upload failed.');

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

            if (
                (detectData.status === 'error' && detectData.status_code === 'unable_to_determine') ||
                detectData.shape === 'Unknown' ||
                !detectData.shape
            ) {
                setError('Face recognition failed. Please try again.');
                setStep('guide');
                setCaptured(false);
                return;
            }

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

            const faceDetail = faceShapeDetails.find(
                (f: FaceShapeDetail) => f.shape === detectData.shape
            );
            const recommendations =
                frameRecommendations[detectData.shape as keyof typeof frameRecommendations];
            const frameDetails =
                recommendations?.recommendedFrames
                    .map((frameName: string) =>
                        frameShapeDetails.find(
                            (f: FrameShapeDetail) =>
                                f.shape.toLowerCase() === frameName.toLowerCase()
                        )
                    )
                    .filter(Boolean) || [];

            const imageUrls = [
                faceDetail?.image,
                ...frameDetails.map(
                    (frame: FrameShapeDetail | undefined) => frame?.image
                ),
            ].filter(Boolean) as string[];

            try {
                await limitedParallelLoad(imageUrls, 3);
                router.push(`/loading?${queryParams}`);
            } catch (error) {
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

    useEffect(() => {
        if (step === 'guide' && !captured) {
            setCountdown(3);
            const timer = setTimeout(() => {
                handleCapture();
            }, 3000);
            return () => clearTimeout(timer);
        } else {
            setCountdown(null);
        }
    }, [step, captured, handleCapture]);

    return (
        <div className="fixed left-0 top-0 w-full h-full bg-black overflow-hidden">
            {/* --- (1) 영상 배경 --- */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="fixed top-0 left-0 w-screen h-screen object-cover -z-10"
                style={{ transform: 'scaleX(-1)' }}
            />
            <div className="fixed left-0 top-0 w-full h-full bg-[rgba(0,0,0,0.35)] pointer-events-none z-0" />

            {/* --- (2) 상단 네비게이션/로고(고정, scale 영향X) --- */}
            <div
                className="absolute top-10 left-6 z-30 cursor-pointer w-[44px] h-[44px]"
                onClick={() => router.back()}
            >
                <Image
                    src="/direction_left.png"
                    alt="내비게이션 바"
                    fill
                    sizes="44px"
                    className="object-contain"
                />
            </div>
            <header
                className="absolute top-0 left-1/2 -translate-x-1/2 pt-8 z-20 flex flex-col items-center"
            >
                <Link href="/" passHref>
                    <div className="relative w-[100px] h-[64px] cursor-pointer">
                        <Image
                            src="/1001Logo.png"
                            alt="1001Logo"
                            fill
                            sizes="200px"
                            className="object-contain"
                        />
                    </div>
                </Link>
            </header>

            {/* --- (3) 중앙 콘텐츠: ResponsiveContainer(비율 유지) --- */}
            <ResponsiveContainer>
                {/* 에러 메시지 */}
                {error && (
                    <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg w-11/12 max-w-md text-center">
                        <p>{error}</p>
                    </div>
                )}

                {/* --- step === 'intro' : 인트로 오버레이/안내 --- */}
                {step === 'intro' && (
                    <>
                        <div className="absolute inset-0 z-10]" />
                        <div
                            className="absolute z-20"
                            style={{
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 738,
                                height: 716,
                                boxSizing: 'border-box',
                                borderRadius: 48,
                                border: '2px solid rgba(255, 255, 255, 0.38)',
                                background: 'rgba(0, 0, 0, 0.60)',
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
                                <div className="flex gap-8">
                                    <span className="text-[#888] font-aribau text-[18px] font-medium text-center" style={{ width: 206, marginTop: 8, marginBottom: 8, letterSpacing: '0.01em' }}>Camera</span>
                                    <span className="text-[#888] font-aribau text-[18px] font-medium text-center" style={{ width: 206, marginTop: 8, marginBottom: 8, letterSpacing: '0.01em' }}>Eyewear</span>
                                    <span className="text-[#888] font-aribau text-[18px] font-medium text-center" style={{ width: 206, marginTop: 8, marginBottom: 8, letterSpacing: '0.01em' }}>Hair</span>
                                </div>
                                <div className="flex gap-8">
                                    <span className="text-white font-aribau text-[24px] font-light text-center" style={{ width: 206 }}>Please look straight at the camera.</span>
                                    <span className="text-white font-aribau text-[24px] font-light text-center" style={{ width: 206 }}>Remove your eyewear for an accurate scan.</span>
                                    <span className="text-white font-aribau text-[24px] font-light text-center" style={{ width: 206 }}>Pull your hair back to show your face.</span>
                                </div>
                            </div>
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
                    </>
                )}

                {/* --- step === 'guide' : 가이드 오버레이/안내 --- */}
                {step === 'guide' && (
                    <>
                        <div className="absolute inset-0 z-10" />
                        <div
                            style={{
                                position: "absolute",
                                width: 1200,
                                height: 1200,
                                left: "50%",
                                top: "50%",
                                transform: "translate(-50%, -50%)",
                                pointerEvents: "none",
                                zIndex: 20,
                            }}
                        >
                            <svg width="100%" height="100%" viewBox="0 0 1200 1200">
                                <ellipse
                                    cx="600"
                                    cy="540"
                                    rx={207}
                                    ry={265}
                                    stroke="#FFF"
                                    strokeWidth={8}
                                    fill="none"
                                    style={{ filter: 'drop-shadow(0 0 12px #fff)' }}
                                />
                            </svg>
                            <FaceScanBar />
                        </div>
                        <div className="absolute left-1/2 bottom-[150px] -translate-x-1/2 flex justify-center items-center rounded-[48px] border border-white/40 bg-black/40 shadow-lg backdrop-blur-[12.5px] text-white text-center z-30 w-[738px] h-[132px] text-[1.15rem]">
                            <div className="w-[658px] text-white text-center font-aribau text-[24px] font-normal leading-[142%] tracking-[-0.048px]">
                                Just a moment<br />
                                We&apos;re scanning your face to find the best frames for you!
                            </div>
                        </div>
                    </>
                )}
            </ResponsiveContainer>
        </div>
    );
}
